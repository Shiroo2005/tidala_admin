import { imageUrls } from "@/shared/constants/imageUrls";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/appPaths";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthRequiredModal = ({
  open,
  onClose,
  title = "Đăng nhập để tiếp tục",
  subtitle = "Bạn cần đăng nhập hoặc tạo tài khoản để tiếp tục sử dụng tính năng này",
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = encodeURIComponent(location.pathname + location.search);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const handleLogin = () => {
    onClose();
    // replace: avoid stacking a duplicate history entry for the current page —
    // post-login we navigate back to this same URL, and a duplicate entry
    // breaks any "back"/close logic here that relies on window.history.state.idx.
    navigate(`${APP_PATHS.LOGIN}?redirect=${redirect}`, { replace: true });
  };

  const handleRegister = () => {
    onClose();
    navigate(`${APP_PATHS.REGISTER}?redirect=${redirect}`, { replace: true });
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-2 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-2 scale-95">
            <Dialog.Panel className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <MdClose size={22} />
              </button>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={imageUrls.public.faviconApp}
                    alt="Tidala Logo"
                    className="h-14 w-14"
                  />
                  <span className="text-xl font-black tracking-widest text-[#137FEC] font-['Lexend']">
                    TIDALA
                  </span>
                </div>

                <div>
                  <Dialog.Title className="text-2xl font-extrabold tracking-tight text-indigo-950 font-['Lexend']">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm font-medium leading-6 text-slate-500 font-['Lexend']">
                    {subtitle}
                  </Dialog.Description>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="h-13 rounded-2xl bg-[#137FEC] text-base font-bold text-white shadow-[0px_4px_16px_rgba(19,127,236,0.30)] transition hover:bg-blue-600 active:scale-[0.98] font-['Lexend']">
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="h-13 rounded-2xl border-2 border-[#137FEC] bg-white text-base font-bold text-[#137FEC] transition hover:bg-blue-50 active:scale-[0.98] font-['Lexend']">
                  Tạo tài khoản mới
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
