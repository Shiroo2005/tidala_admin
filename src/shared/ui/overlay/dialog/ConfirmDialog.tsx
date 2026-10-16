import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { useOverlay } from "../useOverlay";

export interface ConfirmDialogOverlay {
  id: string;
  type: "confirm-dialog";
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dialogType?: "warning" | "default";
}

export const ConfirmDialog = ({
  id,
  title = "Xác nhận hành động",
  titleClassName,
  content,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  dialogType = "default",
}: ConfirmDialogOverlay) => {
  const { hide } = useOverlay();

  const handleConfirm = () => {
    onConfirm?.();
    hide(id);
  };
  const handleCancel = () => {
    onCancel?.();
    hide(id);
  };
  const handleBackdropClose = () => {
    hide(id);
  };

  const isWarning = dialogType === "warning";
  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-100" onClose={handleBackdropClose}>
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
            <Dialog.Panel className="bg-white rounded-3xl w-full max-w-md overflow-hidden p-0 animate-in fade-in zoom-in-95 duration-200">
              {/* Icon warning */}
              {isWarning && (
                <div className="flex justify-center mt-8 mb-4">
                  <div className="w-16 h-16 text-app-error bg-app-error/10 rounded-full flex items-center justify-center">
                    <TbAlertTriangleFilled size={30} />
                  </div>
                </div>
              )}
              {/* Title */}
              <div className="text-center px-8 mt-8">
                <h2
                  className={`text-2xl font-bold mb-2 ${titleClassName || "text-gray-900"}`}
                >
                  {title}
                </h2>
                {content && (
                  <div className="text-gray-600 text-sm leading-relaxed mb-2">
                    {content}
                  </div>
                )}
              </div>
              {/* Actions */}
              <div className="flex gap-3 px-8 pb-8 mt-8">
                <button
                  type="button"
                  className="flex-1 rounded-xl border-3 border-app-border py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={handleCancel}
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-xl py-3 font-semibold transition-colors ${isWarning ? "bg-app-error text-white hover:bg-app-error/90" : "bg-brand text-white hover:bg-brand/90"}`}
                  onClick={handleConfirm}
                >
                  {confirmText}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
