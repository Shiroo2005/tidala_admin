import { useCreateTeacherProfile } from "@/features/auth/hooks/mutations/useCreateTeacherProfile";
import { useAuth } from "@/features/auth/providers";
import { Role } from "@/features/auth/types";
import type { ApiErrorResponse } from "@/shared/types/api.type";
import { useToast } from "@/shared/ui/overlay";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { isEqual } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AccountFormState, TeacherProfileFormState } from "../types";
import {
  buildCreateTeacherProfilePayload,
  buildUpdateMyProfilePayload,
} from "../utils/buildPayload";
import { mapUpdateMyProfileApiFieldErrors } from "../utils/mapUpdateMyProfileApiFieldErrors";
import {
  getFirstErrorKey,
  validateUpdateMyProfileAll,
} from "../validators/update-my-profile.validation";
import { useAccountForm } from "./useAccountForm";
import {
  buildCreateDrivingCenterPayload,
  useDrivingCenterBulkCreate,
} from "./useDrivingCenterBulkCreate";
import { useProfileInitializer } from "./useProfileInitializer";
import { useTeacherProfileForm } from "./useTeacherProfileForm";
import { useUpdateMyProfile } from "./useUpdateMyProfile";

type ProfileKeys = keyof TeacherProfileFormState;
type AccountKeys = keyof AccountFormState;

export type FormErrors = Partial<
  Record<ProfileKeys | AccountKeys | "tags", string>
>;

export const useProfileForm = (options?: {
  onNavigateToFieldError?: (errorFieldKey: keyof FormErrors) => void;
  onSuccess?: () => void;
}) => {
  const { user, refetchUser } = useAuth();
  const { showToast } = useToast();

  const [enableEditProfile, setEnabledEditProfile] = useState<boolean>(false);

  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [isRealPhotosUploading, setIsRealPhotosUploading] = useState(false);

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: updateMyProfile, isPending: isSubmitting } =
    useUpdateMyProfile();
  const { mutateAsync: createTeacherProfile } = useCreateTeacherProfile();
  const { createDrivingCenters } = useDrivingCenterBulkCreate();

  const clearError = (key: keyof FormErrors) => {
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const { accountForm, setAccountForm, setAccountField, setAvatarUrl } =
    useAccountForm(clearError);

  const {
    teacherProfileForm,
    setTeacherProfileForm,
    setTeacherProfileField,
    setTrainingLevels,
    setCoverImageUrl,
  } = useTeacherProfileForm(clearError);

  useProfileInitializer({
    user,
    setAccountForm,
    setTeacherProfileForm,
  });

  const [initialForm, setInitialForm] = useState<{
    account: AccountFormState;
    teacher: TeacherProfileFormState;
  } | null>(null);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (initializedRef.current) return;

    if (!accountForm.email) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialForm({
      account: accountForm,
      teacher: teacherProfileForm,
    });

    initializedRef.current = true;
  }, [user, accountForm, teacherProfileForm]);

  const isChanged = useMemo(() => {
    if (!initialForm) return false;

    return (
      !isEqual(initialForm.account, accountForm) ||
      !isEqual(initialForm.teacher, teacherProfileForm)
    );
  }, [initialForm, accountForm, teacherProfileForm]);

  const handleConfirmModal = () => {
    setTeacherProfileForm(initialForm!.teacher);
    setAccountForm(initialForm!.account);
    setFormErrors({});
    setEnabledEditProfile(false);
  };

  const validateAll = () => {
    setSubmitError(null);
    const result = validateUpdateMyProfileAll(
      teacherProfileForm,
      accountForm,
      user?.appUser?.role,
    );
    setFormErrors(result.errors);
    return result;
  };

  const handleUpdateSuccess = () => {
    setInitialForm({
      account: accountForm,
      teacher: teacherProfileForm,
    });
    setEnabledEditProfile(false);
    showToast({
      toastType: "success",
      message: "Cập nhật hồ sơ thành công",
      position: "top",
    });
    refetchUser();
    options?.onSuccess?.();
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const result = validateAll();
    if (!result.ok) {
      showToast({
        toastType: "error",
        message: "Vui lòng kiểm tra lại thông tin",
        position: "top",
      });
      if (options?.onNavigateToFieldError) {
        options.onNavigateToFieldError(result.firstErrorKey);
      }
      return;
    }

    try {
      let finalDrivingCenterIds: string[] = [];
      let finalTeacherForm: TeacherProfileFormState | undefined = undefined;

      if (user?.appUser?.role === Role.TEACHER) {
        const allCenters = [
          ...teacherProfileForm.practiceCenters,
          ...teacherProfileForm.examinationCenters,
        ];

        const newCenters = allCenters.filter((c) => c.source === "NEW");
        const existingCenterIds = allCenters
          .filter((c) => c.source === "EXISTING")
          .map((c) => c.place_id);

        let createdCenterIds: string[] = [];
        if (newCenters.length > 0) {
          const createPayload = buildCreateDrivingCenterPayload(newCenters);
          const createdCenters = await createDrivingCenters(createPayload);
          createdCenterIds = createdCenters.map((c) => c.id);
        }

        finalDrivingCenterIds = [...existingCenterIds, ...createdCenterIds];
        finalTeacherForm = teacherProfileForm;
      }
      // Handle truong hợp teacher profile chưa tồn tại, cần tạo mới rồi mới update
      if (
        user?.appUser?.role === Role.TEACHER &&
        !user.appUser.teacherProfile
      ) {
        const createTeacherProfilePayload =
          buildCreateTeacherProfilePayload(teacherProfileForm);
        await createTeacherProfile(createTeacherProfilePayload);
      }

      const payload = buildUpdateMyProfilePayload(
        accountForm,
        finalDrivingCenterIds,
        finalTeacherForm,
      );
      await updateMyProfile(payload);

      handleUpdateSuccess();
      return { success: true };
    } catch (error) {
      const apiError = error as ApiErrorResponse;

      if (apiError?.fieldErrors) {
        const { mappedErrors, unknownMessages } =
          mapUpdateMyProfileApiFieldErrors(apiError.fieldErrors);
        setFormErrors((prev) => ({ ...prev, ...mappedErrors }));

        const errorMessage =
          unknownMessages.length > 0
            ? unknownMessages[0]
            : "Vui lòng kiểm tra lại thông tin";

        setSubmitError(errorMessage);
        showToast({
          toastType: "error",
          message: errorMessage,
          position: "top",
        });

        const firstErrorKey = getFirstErrorKey(mappedErrors);
        if (firstErrorKey && options?.onNavigateToFieldError) {
          options.onNavigateToFieldError(firstErrorKey);
        }

        return {
          success: false,
          firstErrorKey,
        };
      }

      showToast({
        toastType: "error",
        message:
          getErrorMessage(
            apiError?.code,
            "Đã có lỗi xảy ra khi tạo hồ sơ. Vui lòng thử lại.",
          ) || apiError?.message,
        position: "top",
      });

      setSubmitError(
        getErrorMessage(apiError?.code, "Đã xảy ra lỗi. Vui lòng thử lại."),
      );

      return { success: false };
    }
  };

  return {
    enableEditProfile,
    setEnabledEditProfile,
    accountForm,
    setAccountForm,
    teacherProfileForm,
    setTeacherProfileForm,
    formErrors,
    setFormErrors,
    setAccountField,
    setTeacherProfileField,
    setTrainingLevels,
    clearError,
    setAvatarUrl,
    setCoverImageUrl,
    isAvatarUploading,
    setIsAvatarUploading,
    isCoverImageUploading,
    setIsCoverImageUploading,
    isRealPhotosUploading,
    setIsRealPhotosUploading,
    isChanged,
    handleConfirmModal,
    handleSubmit,
    submitError,
    setSubmitError,
    isSubmitting,
    role: user?.appUser?.role,
  };
};
