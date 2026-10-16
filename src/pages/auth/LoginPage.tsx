import { AuthPageShell } from "@/features/auth/components/layout/AuthPageShell";
import { LoginForm } from "@/features/auth/components/login/LoginForm";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { useStaggerAnim } from "@/shared/hooks/useStaggerAnim";

export const LoginPage = () => {
  const { animClass } = useStaggerAnim();

  return (
    <div className={animClass}>
      <AuthPageShell
        title="Đăng nhập"
        eyebrow="Chào mừng trở lại"
        heading="Tiếp tục hành trình học lái cùng Tidala"
        description="Đăng nhập để lưu giáo viên yêu thích, theo dõi tương tác và nhận thông báo mới nhất từ Tidala."
        switchText="Chưa có tài khoản?"
        switchLabel="Đăng ký"
        switchTo={APP_PATHS.REGISTER}
        showMobileLogo>
        <LoginForm />
      </AuthPageShell>
    </div>
  );
};
