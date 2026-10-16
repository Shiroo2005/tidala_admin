import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { DialogOverlay as DialogType } from "../overlay.types";
import { useOverlay } from "../useOverlay";

export const DialogOverlay = ({
  id,
  title,
  message,
  children,
  closeOnOverlayClick = true,
  onClose,
  containerClassName,
}: DialogType) => {
  const { hide } = useOverlay();

  const handleClose = () => {
    hide(id);
    onClose?.();
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog
        as="div"
        className="relative z-100"
        onClose={closeOnOverlayClick ? handleClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 pointer-events-none" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={`bg-white rounded-xl p-6 w-[320px] ${containerClassName ?? ""}`}
            >
              {children ? (
                children
              ) : (
                <>
                  {title && (
                    <Dialog.Title className="text-lg font-semibold mb-2 text-[#137FEC]">
                      {title}
                    </Dialog.Title>
                  )}

                  <p className="text-sm text-[#1A1D42]">{message}</p>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-sm rounded-md bg-[#137FEC] text-white hover:bg-[#0d6bd8]"
                    >
                      OK
                    </button>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
