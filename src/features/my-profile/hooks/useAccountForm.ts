import { useState } from "react";
import type { AccountFormState, TeacherProfileFormState } from "../types";

export const useAccountForm = (
  clearError: (
    key: keyof TeacherProfileFormState | keyof AccountFormState,
  ) => void,
) => {
  const [accountForm, setAccountForm] = useState<AccountFormState>({
    fullName: "",
    email: "",
    phoneNumber: "",
    avatarUrl: "",
  });

  const setAccountField = <K extends keyof AccountFormState>(
    key: K,
    value: AccountFormState[K],
  ) => {
    setAccountForm((prev) => ({ ...prev, [key]: value }));
  };

  const setAvatarUrl = (url: string | null) => {
    setAccountForm((prev) => ({
      ...prev,
      avatarUrl: url,
    }));

    clearError("avatarUrl");
  };

  return {
    accountForm,
    setAccountForm,
    setAccountField,
    setAvatarUrl,
  };
};
