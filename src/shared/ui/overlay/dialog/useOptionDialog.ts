import { useOverlay } from "../useOverlay";

interface UseOptionDialogOptions {
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  option1Text?: string;
  option1OnClick?: () => void;
  option2Text?: string;
  option2OnClick?: () => void;
  showCloseButton?: boolean;
}

/**
 * Hook để hiển thị option dialog với 2 nút tùy chọn
 *
 * @example
 * ```tsx
 * const { showOptionDialog } = useOptionDialog();
 *
 * showOptionDialog({
 *   title: "Chọn hành động",
 *   content: <p>Bạn muốn làm gì?</p>,
 *   option1Text: "Đăng nhập",
 *   option1OnClick: () => navigate(APP_PATHS.LOGIN),
 *   option2Text: "Đăng ký",
 *   option2OnClick: () => navigate(APP_PATHS.REGISTER),
 * });
 * ```
 */
export const useOptionDialog = () => {
  const { show } = useOverlay();

  const showOptionDialog = (options: UseOptionDialogOptions) => {
    const dialogId = `option-dialog-${Date.now()}`;

    const overlay = {
      id: dialogId,
      type: "option-dialog" as const,
      title: options.title,
      titleClassName: options.titleClassName,
      content: options.content,
      option1Text: options.option1Text,
      option1OnClick: options.option1OnClick,
      option2Text: options.option2Text,
      option2OnClick: options.option2OnClick,
      showCloseButton: options.showCloseButton ?? true,
    };

    show(overlay);
    return dialogId;
  };

  return { showOptionDialog };
};
