import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import { useOverlay } from "../useOverlay";

interface OptionDialogOverlay {
  id: string;
  type: "option-dialog";
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  option1Text?: string;
  option1OnClick?: () => void;
  option2Text?: string;
  option2OnClick?: () => void;
  showCloseButton?: boolean;
}

type OptionDialogProps = OptionDialogOverlay;

export const OptionDialog = ({
  id,
  title,
  titleClassName,
  content,
  option1Text = "Tùy chọn 1",
  option1OnClick,
  option2Text = "Tùy chọn 2",
  option2OnClick,
  showCloseButton = true,
}: OptionDialogProps) => {
  const { hide } = useOverlay();

  const handleOption1 = () => {
    hide(id);
    option1OnClick?.();
  };

  const handleOption2 = () => {
    hide(id);
    option2OnClick?.();
  };

  const handleBackdropClose = () => {
    hide(id);
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleBackdropClose}>
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
            <Dialog.Panel className="bg-white rounded-xl w-full max-w-sm overflow-hidden">
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-gray-100">
                  <Dialog.Title
                    className={`text-lg font-semibold text-left flex-1 ${titleClassName || "text-gray-900"}`}
                  >
                    {title}
                  </Dialog.Title>
                  {showCloseButton && (
                    <button
                      onClick={handleBackdropClose}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors ml-4 shrink-0"
                    >
                      <IoClose className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-6">
                {content && <div className="mb-6">{content}</div>}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleOption1}
                    className="flex-1 px-4 h-12 text-[14px] font-semibold text-[#137FEC] hover:bg-blue-50 border-3 border-[#137FEC] rounded-xl transition-colors"
                  >
                    {option1Text}
                  </button>
                  <button
                    onClick={handleOption2}
                    className="flex-1 px-4 h-12 text-[14px] font-medium bg-[#137FEC] text-white rounded-xl hover:bg-[#0f6bc2] transition-colors"
                  >
                    {option2Text}
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
