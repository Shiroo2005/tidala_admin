import { Link } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/appPaths";

export const AuthFooter = () => {
  return (
    <span className="block w-full text-center text-xs font-light leading-6 text-app-text-muted">
      Bằng cách tiếp tục, bạn đồng ý với{" "}
      <Link
        to={APP_PATHS.SUPPORT_POLICIES}
        className="underline underline-offset-2 hover:text-[#137FEC] transition-colors"
      >
        Các điều khoản dịch vụ
      </Link>{" "}
      và{" "}
      <Link
        to={APP_PATHS.SUPPORT_PRIVACY}
        className="underline underline-offset-2 hover:text-[#137FEC] transition-colors"
      >
        Chính sách bảo mật
      </Link>{" "}
      của chúng tôi.
    </span>
  );
};
