import { Input } from "@/shared/ui/input/Input";
import { useLoginForm } from "../../hooks/useLoginForm";
import { useEffect } from "react";

export const LoginForm = () => {
  const {
    formData,
    handleChange,
    generalError,
    errorFields,
    handleSubmit,
    isLoading,
  } = useLoginForm();

  useEffect(() => {
    if (generalError) {
      alert(generalError);
    }
  }, [generalError]);

  return (
    <form
      onSubmit={handleSubmit}
      className="self-stretch max-w-sm flex flex-col flex-1 justify-center items-center gap-4 lg:w-full lg:max-w-none"
    >
      <Input
        label="Email"
        placeholder="Nhập email của bạn"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errorFields.email}
      />
      <Input
        label="Mật khẩu"
        placeholder="Nhập mật khẩu của bạn"
        name="password"
        type="password"
        showPasswordToggle
        value={formData.password}
        onChange={handleChange}
        forgotPassword
        error={errorFields.password}
      />
      <button
        type="submit"
        className="self-stretch h-12 rounded-2xl bg-brand font-['Lexend'] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 lg:w-full lg:rounded-lg lg:font-semibold lg:shadow-sm lg:transition lg:hover:bg-brand-hover"
        disabled={isLoading}
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
};
