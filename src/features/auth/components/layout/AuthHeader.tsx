import { useNavigate, useLocation } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { useAuth } from "@/features/auth/providers/useAuth";
import { APP_PATHS } from "@/shared/constants/appPaths";

interface AuthHeaderProps {
  title: string;
}

export const AuthHeader = ({ title }: AuthHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const appUser = user?.appUser;

  const handleBack = async () => {
    // Nếu đang ở trang register và user đã verify email nhưng chưa hoàn tất đăng ký
    if (location.pathname === APP_PATHS.REGISTER && appUser) {
      // Logout để clear access token và cho phép user bắt đầu lại với tài khoản khác
      await logout();
      navigate(APP_PATHS.ONBOARDING, { replace: true });
    } else {
      // Trở về trang trước nếu có history, ngược lại về home
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigate(APP_PATHS.ONBOARDING);
      }
    }
  };

  return (
    <header className="h-16 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-1">
      <button
        onClick={handleBack}
        className="justify-self-start flex items-center justify-center 
        w-10 h-10 bg-white border border-gray-200 rounded-full 
        text-app-text hover:bg-gray-50 transition-colors shadow-sm"
      >
        <FiChevronLeft size={20} />
      </button>
      <h1 className="justify-self-center text-lg font-bold text-app-text">
        {title}
      </h1>
      <div aria-hidden="true" />
    </header>
  );
};
