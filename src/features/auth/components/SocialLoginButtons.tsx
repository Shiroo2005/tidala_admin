import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useToast } from '@/shared/ui/overlay';
export const SocialLoginButtons = () => {
 const { showToast } = useToast();
 const handleGoogleLogin = () => showToast({message:'Dùng tài khoản demo: admin@tidala.demo / TidalaDemo123!',toastType:'info',position:'top'});
 const handleFacebookLogin = handleGoogleLogin;
  return (
    <div className="w-full max-w-sm lg:max-w-none">
      <div className="flex items-center gap-4 lg:w-full">
        <hr
          className="flex-1"
          style={{ borderColor: "var(--token-color-text-placeholder)" }}
        />
        <span
          className="text-sm lg:text-xs lg:font-semibold lg:uppercase lg:tracking-[0.18em]"
          style={{ color: "var(--token-color-text-placeholder)" }}>
          HOẶC
        </span>
        <hr
          className="flex-1"
          style={{ borderColor: "var(--token-color-text-placeholder)" }}
        />
      </div>

      <div className="mt-4 flex justify-center gap-4 lg:grid lg:grid-cols-2 lg:gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg active:scale-95 active:bg-gray-50 active:shadow-inner touch-manipulation select-none lg:h-12 lg:w-full lg:gap-2 lg:rounded-lg lg:px-4 lg:text-sm lg:font-semibold lg:text-app-text lg:hover:scale-100 lg:hover:border-brand lg:hover:bg-blue-50 lg:hover:shadow-none"
          style={{ borderColor: "var(--token-color-border)" }}>
          <FcGoogle size={42} className="lg:h-5.5 lg:w-5.5" />
          <span className="hidden lg:inline">Google</span>
        </button>
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-app-border transition-all duration-200 ease-out hover:scale-105 hover:border-[#1877F2] hover:shadow-lg active:scale-95 active:bg-blue-50 active:shadow-inner touch-manipulation select-none lg:h-12 lg:w-full lg:gap-2 lg:rounded-lg lg:px-4 lg:text-sm lg:font-semibold lg:text-app-text lg:hover:scale-100 lg:hover:bg-blue-50 lg:hover:shadow-none">
          <FaFacebook size={42} color="#1877F2" className="lg:h-5.5 lg:w-5.5" />
          <span className="hidden lg:inline">Facebook</span>
        </button>
      </div>
    </div>
  );
};
