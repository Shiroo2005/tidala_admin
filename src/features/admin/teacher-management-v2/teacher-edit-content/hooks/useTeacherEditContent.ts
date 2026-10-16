import {
  buildCreateDrivingCenterPayload,
  useDrivingCenterBulkCreate,
} from "@/features/my-profile/hooks/useDrivingCenterBulkCreate";
import { buildEditTeacherContentPayload } from "@/features/my-profile/utils/buildPayload";
import { mapUpdateMyProfileApiFieldErrors } from "@/features/my-profile/utils/mapUpdateMyProfileApiFieldErrors";
import type { ApiErrorResponse } from "@/shared/types/api.type";
import { useToast } from "@/shared/ui/overlay";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { isEqual } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAdminTeacherDetail } from "../../teacher-detail/hooks/useGetAdminTeacherDetail";
import type { BasicInfoFormState, TeachingInfoFormState } from "../../types";
import {
  getFirstErrorKey,
  validateEditTeacherContentAll,
} from "../validations/edit-teacher-content.validation";
import { useBasicInfoForm } from "./useBasicInfoForm";
import { useInitializer } from "./useInitializer";
import { useTeachingInfoForm } from "./useTeachingInfoForm";
import { useUpdateTeacherProfile } from "./useUpdateTeacherProfile";

export type FormErrors = Partial<
  Record<
    keyof BasicInfoFormState | keyof TeachingInfoFormState | "tags",
    string
  >
>;

export const useTeacherEditContent = (options?: {
  onNavigateToFieldError?: (errorFieldKey: keyof FormErrors) => void;
  onSuccess?: () => void;
}) => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const { showToast } = useToast();

  const { teacherDetail, isLoadingTeacherDetail, isErrorFetchTeacherDetail } =
    useGetAdminTeacherDetail(teacherId || "");

  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const [isRealPhotosUploading, setIsRealPhotosUploading] = useState(false);

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const clearError = useCallback((key: keyof FormErrors) => {
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const { mutateAsync: updateTeacherProfile, isPending: isSubmitting } =
    useUpdateTeacherProfile(teacherId || "");
  const { createDrivingCenters } = useDrivingCenterBulkCreate();

  const { basicInfoForm, setBasicInfoForm, setAccountField, setAvatarUrl } =
    useBasicInfoForm(clearError);

  const {
    teachingInfoForm,
    setTeachingInfoForm,
    setTeacherProfileField,
    setTrainingLevels,
    setCoverImageUrl,
  } = useTeachingInfoForm(clearError);

  useInitializer({
    teacherDetail,
    setBasicInfoForm,
    setTeachingInfoForm,
  });

  const [initialForm, setInitialForm] = useState<{
    account: BasicInfoFormState;
    teacher: TeachingInfoFormState;
  } | null>(null);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!teacherDetail) return;
    if (initializedRef.current) return;

    if (!basicInfoForm.email) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialForm({
      account: basicInfoForm,
      teacher: teachingInfoForm,
    });

    initializedRef.current = true;
  }, [teacherDetail, basicInfoForm, teachingInfoForm]);

  const isChanged = useMemo(() => {
    if (!initialForm) return false;

    return (
      !isEqual(initialForm.account, basicInfoForm) ||
      !isEqual(initialForm.teacher, teachingInfoForm)
    );
  }, [initialForm, basicInfoForm, teachingInfoForm]);

  const handleConfirmModal = () => {
    setTeachingInfoForm(initialForm!.teacher);
    setBasicInfoForm(initialForm!.account);
    setOpenConfirmModal(false);
  };

  const validateAll = () => {
    setSubmitError(null);
    const result = validateEditTeacherContentAll(
      teachingInfoForm,
      basicInfoForm,
    );
    setFormErrors(result.errors);
    return result;
  };

  const handleUpdateSuccess = () => {
    setInitialForm({
      account: basicInfoForm,
      teacher: teachingInfoForm,
    });
    showToast({
      toastType: "success",
      message: "Cập nhật hồ sơ thành công",
      position: "top",
    });
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
      let finalTeacherForm: TeachingInfoFormState | undefined = undefined;

      const allCenters = [
        ...teachingInfoForm.practiceCenters,
        ...teachingInfoForm.examinationCenters,
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
      finalTeacherForm = teachingInfoForm;

      const payload = buildEditTeacherContentPayload(
        basicInfoForm,
        finalDrivingCenterIds,
        finalTeacherForm,
      );
      await updateTeacherProfile(payload);

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
            "Đã có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.",
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
    handleSubmit,
    isSubmitting,
    formErrors,
    clearError,
    submitError,
    basicInfoForm,
    setBasicInfoForm,
    setAccountField,
    setAvatarUrl,
    teachingInfoForm,
    setTeachingInfoForm,
    setTeacherProfileField,
    setTrainingLevels,
    setCoverImageUrl,
    isAvatarUploading,
    isCoverImageUploading,
    isRealPhotosUploading,
    setIsAvatarUploading,
    setIsCoverImageUploading,
    setIsRealPhotosUploading,
    isLoadingTeacherDetail,
    isErrorFetchTeacherDetail,
    teacherDetail,
    openConfirmModal,
    setOpenConfirmModal,
    handleConfirmModal,
    isChanged,
  };
};
