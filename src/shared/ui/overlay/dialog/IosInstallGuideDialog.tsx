import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  IoShareOutline,
  IoCheckmark,
  IoAddCircleOutline,
} from "react-icons/io5";
import { useOverlay } from "../useOverlay";

interface IosInstallGuideDialogProps {
  id: string;
}

export const IosInstallGuideDialog = ({ id }: IosInstallGuideDialogProps) => {
  const { hide } = useOverlay();

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => hide(id)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
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
            <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md">
              <Dialog.Title className="text-lg font-bold mb-4 text-[#137FEC]">
                Hướng dẫn cài đặt ứng dụng trên iOS
              </Dialog.Title>

              <div className="text-sm text-[#1A1D42] space-y-3">
                <p>Để cài đặt ứng dụng Tidala trên iOS:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="flex items-center gap-2">
                    <IoShareOutline className="text-[#137FEC] shrink-0" />
                    Nhấn vào biểu tượng chia sẻ ở thanh điều hướng.
                  </li>
                  <li className="flex items-center gap-2">
                    <IoAddCircleOutline className="text-[#137FEC] shrink-0" />
                    Cuộn xuống và chọn "Thêm vào Màn hình chính".
                  </li>
                  <li className="flex items-center gap-2">
                    <IoCheckmark className="text-[#137FEC] shrink-0" />
                    Nhấn "Thêm" để xác nhận.
                  </li>
                </ol>
                <p>Ứng dụng sẽ được thêm vào màn hình chính của bạn.</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => hide(id)}
                  className="
                    h-11 px-6
                    bg-[#137FEC]
                    rounded-2xl
                    text-white text-sm font-bold font-['Lexend']

                    transition-all duration-200 ease-out
                    hover:bg-[#0d6bd8]
                    hover:-translate-y-0.5
                    active:translate-y-0
                    active:scale-[0.98]

                    focus:outline-none
                    focus:ring-2 focus:ring-[#137FEC]/30
                  "
                >
                  Đã hiểu
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
