import { useOverlay } from "../useOverlay";

interface UseFormDialogOptions {
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  showCloseButton?: boolean;
}

/**
 * Hook để hiển thị form dialog
 *
 * @example
 * ```tsx
 * const { showFormDialog } = useFormDialog();
 *
 * showFormDialog({
 *   title: "Thêm xe dạy",
 *   content: <CarFormComponent />,
 *   confirmText: "Thêm",
 *   cancelText: "Hủy",
 * }, () => handleSave());
 * ```
 */
export const useFormDialog = () => {
  const { show } = useOverlay();

  const showFormDialog = (
    options: UseFormDialogOptions,
    onConfirm?: () => boolean | void,
    onCancel?: () => void,
  ) => {
    const dialogId = `form-dialog-${Date.now()}`;

    const overlay = {
      id: dialogId,
      type: "form-dialog" as const,
      title: options.title,
      titleClassName: options.titleClassName,
      content: options.content,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onConfirm,
      onCancel,
      confirmDisabled: options.confirmDisabled,
      showCloseButton: options.showCloseButton ?? true,
    };

    show(overlay);
    return dialogId;
  };

  return { showFormDialog };
};