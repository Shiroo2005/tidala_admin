import { useCallback, useMemo, useState } from "react";

export interface InviteTeacherFormState {
  fullName: string;
  email: string;
}

export interface InviteTeacherFormErrors {
  fullName?: string;
  email?: string;
}

const INITIAL_STATE: InviteTeacherFormState = {
  fullName: "",
  email: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useInviteTeacherForm = () => {
  const [formState, setFormState] =
    useState<InviteTeacherFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<InviteTeacherFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof InviteTeacherFormState, boolean>>
  >({});

  const validateField = useCallback(
    (field: keyof InviteTeacherFormState, value: string): string | undefined => {
      switch (field) {
        case "fullName":
          if (!value.trim()) return "Vui lòng nhập họ và tên";
          return undefined;
        case "email":
          if (!value.trim()) return "Vui lòng nhập email";
          if (!EMAIL_REGEX.test(value.trim())) return "Email không hợp lệ";
          return undefined;
        default:
          return undefined;
      }
    },
    [],
  );

  const setFieldValue = useCallback(
    (field: keyof InviteTeacherFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));

      // Real-time validation: clear/update error on input
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateField],
  );

  const handleBlur = useCallback(
    (field: keyof InviteTeacherFormState) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, formState[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [formState, validateField],
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: InviteTeacherFormErrors = {};
    let isValid = true;

    (Object.keys(INITIAL_STATE) as (keyof InviteTeacherFormState)[]).forEach(
      (field) => {
        const error = validateField(field, formState[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      },
    );

    setErrors(newErrors);
    setTouched(
      (Object.keys(INITIAL_STATE) as (keyof InviteTeacherFormState)[]).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {} as Partial<Record<keyof InviteTeacherFormState, boolean>>,
      ),
    );

    return isValid;
  }, [formState, validateField]);

  const resetForm = useCallback(() => {
    setFormState(INITIAL_STATE);
    setErrors({});
    setTouched({});
  }, []);

  const isDirty = useMemo(() => {
    return (
      Object.keys(INITIAL_STATE) as (keyof InviteTeacherFormState)[]
    ).some((field) => formState[field] !== INITIAL_STATE[field]);
  }, [formState]);

  const isValid = useMemo(() => {
    return (
      Object.keys(INITIAL_STATE) as (keyof InviteTeacherFormState)[]
    ).every((field) => !validateField(field, formState[field]));
  }, [formState, validateField]);

  const canSubmit = isDirty && isValid;

  return {
    formState,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    validateAll,
    resetForm,
    isDirty,
    isValid,
    canSubmit,
  };
};
