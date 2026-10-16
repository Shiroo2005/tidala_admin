import { useCallback, useState } from "react";
import type { BasicInfoFormState, TeachingInfoFormState } from "../../types";

export const useBasicInfoForm = (
  clearError: (
    key: keyof BasicInfoFormState | keyof TeachingInfoFormState,
  ) => void,
) => {
  const [basicInfoForm, setBasicInfoForm] = useState<BasicInfoFormState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "",
  });
  const setAccountField = useCallback(
    <K extends keyof BasicInfoFormState>(
      key: K,
      value: BasicInfoFormState[K],
    ) => {
      setBasicInfoForm((prev) => ({ ...prev, [key]: value }));
      clearError(key);
    },
    [clearError],
  );
  const setAvatarUrl = useCallback(
    (url: string | null) => {
      setBasicInfoForm((prev) => ({
        ...prev,
        avatarUrl: url,
      }));

      clearError("avatarUrl");
    },
    [clearError],
  );

  return {
    basicInfoForm,
    setBasicInfoForm,
    setAccountField,
    setAvatarUrl,
  };
};
