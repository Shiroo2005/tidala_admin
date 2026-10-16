import { useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/providers/useAuth";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { useToast } from "@/shared/ui/overlay/toast/useToast";
import type { ApiErrorResponse } from "@/shared/types/api.type";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { getSafeRedirectPath } from "@/shared/utils/getSafeRedirectPath";

interface LoginFormData {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginPending } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errorFields, setErrorFields] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorFields[name]) {
      setErrorFields((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorFields({});
    setGeneralError("");

    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email không được để trống";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống";
    }

    if (Object.keys(errors).length > 0) {
      setErrorFields(errors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      showToast({
        message: "Đăng nhập thành công!",
        toastType: "success",
        position: "top",
      });

      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        sessionStorage.setItem("auth_redirect", redirectTo);
      }

      const savedRedirect = sessionStorage.getItem("auth_redirect");
      sessionStorage.removeItem("auth_redirect");
      const finalRedirect = getSafeRedirectPath(
        savedRedirect || redirectTo,
        APP_PATHS.ADMIN_DASHBOARD,
      );
      navigate(finalRedirect, { replace: true });
    } catch (error) {
      const authError = error as ApiErrorResponse;

      if (authError?.fieldErrors) {
        setErrorFields(authError.fieldErrors);
        return;
      } else if (authError?.code === "INVALID_CREDENTIALS") {
        setErrorFields({
          email: "Email hoặc mật khẩu không đúng",
        });
        return;
      }

      const message = getErrorMessage(authError?.code, authError?.message);
      showToast({
        message,
        toastType: "error",
        position: "top",
      });
    }
  };

  return {
    formData,
    errorFields,
    generalError,
    handleChange,
    handleSubmit,
    isLoading: loginPending,
  };
};
