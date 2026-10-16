import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useOverlay } from "../useOverlay";
import type { FormDialogOverlay } from "../overlay.types";

type FormDialogProps = FormDialogOverlay;

export const FormDialog = ({
  id,
  title,
  titleClassName,
  content,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  showCloseButton = true,
}: FormDialogProps) => {
  const { hide } = useOverlay();

  const handleConfirm = () => {
    const result = onConfirm?.();
    // If onConfirm explicitly returns false, don't close
    if (result === false) return;
    hide(id);
  };

  const handleCancel = () => {
    hide(id);
    onCancel?.();
  };

  const handleBackdropClose = () => {
    hide(id);
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleBackdropClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md" />
        </Transition.Child>

        {/* Dialog panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl w-full max-w-sm overflow-hidden">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-gray-100">
                  <Dialog.Title
                    className={`text-lg font-semibold text-gray-900 text-left flex-1 ${titleClassName || ""}`}
                  >
                    {title}
                  </Dialog.Title>
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors ml-4 shrink-0"
                    >
                      <IoClose className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="">
                <div className="">{content}</div>

                {/* Buttons */}
                <div className="flex gap-3 p-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 h-12 text-[14px] font-semibold text-[#137FEC] hover:bg-blue-50 border-3 border-[#137FEC] rounded-xl transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={confirmDisabled}
                    className="flex-1 px-4 h-12 text-[14px] font-medium bg-[#137FEC] text-white rounded-xl hover:bg-[#0f6bc2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
