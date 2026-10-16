import { imageUrls } from "@/shared/constants/imageUrls";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { Sheet } from "react-modal-sheet";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthRequiredBottomSheet = ({
  open,
  onClose,
  title = "Đăng nhập để tiếp tục",
  subtitle = "Bạn cần đăng nhập hoặc tạo tài khoản để tiếp tục sử dụng tính năng này",
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    setTimeout(onClose, 300);
  };

  const redirect = encodeURIComponent(location.pathname + location.search);

  const handleLogin = () => {
    handleClose();
    setTimeout(() => {
      // replace: avoid stacking a duplicate history entry for the current
      // page — post-login we navigate back to this same URL, and a
      // duplicate entry breaks "back"/close logic relying on history.state.idx.
      navigate(`${APP_PATHS.LOGIN}?redirect=${redirect}`, { replace: true });
    }, 350);
  };

  const handleRegister = () => {
    handleClose();
    setTimeout(() => {
      navigate(`${APP_PATHS.REGISTER}?redirect=${redirect}`, {
        replace: true,
      });
    }, 350);
  };

  return (
    <Sheet isOpen={open} onClose={onClose} detent="content">
      <Sheet.Container className="rounded-t-[30px]!">
        <Sheet.Header>
          <div className="flex items-center justify-between px-6 pt-2">
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-95 transition-all"
            >
              <MdClose size={24} />
            </button>

            <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />

            <div className="w-10" />
          </div>
        </Sheet.Header>

        <Sheet.Content>
          <div className="px-6 pt-2 pb-10">
            {/* Header */}
            <div className="flex flex-col items-center mb-8 gap-4">
              {/* Logo */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={imageUrls.public.faviconApp}
                  alt="Tidala Logo"
                  className="w-14 h-14"
                />

                <span className="text-[#137FEC] text-xl font-black tracking-widest font-['Lexend']">
                  TIDALA
                </span>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-indigo-950 text-2xl font-extrabold font-['Lexend'] tracking-tight mb-1">
                  {title}
                </h3>

                <p className="text-slate-500 font-medium font-['Lexend'] text-sm leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-col gap-3 mt-2">
              <button
                onClick={handleLogin}
                className="
                w-full h-13 rounded-2xl
                bg-[#137FEC] text-white text-base font-bold font-['Lexend']
                shadow-[0px_4px_16px_rgba(19,127,236,0.30)]
                active:scale-[0.97] active:bg-blue-700
                transition-all duration-150
              "
              >
                Đăng nhập
              </button>
              <button
                onClick={handleRegister}
                className="
                w-full h-13 rounded-2xl
                border-2 border-[#137FEC]
                text-[#137FEC] text-base font-bold font-['Lexend']
                bg-white
                active:scale-[0.97] active:bg-blue-50
                transition-all duration-150
              "
              >
                Tạo tài khoản mới
              </button>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
};
