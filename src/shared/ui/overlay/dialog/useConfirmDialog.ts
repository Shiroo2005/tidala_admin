import { useOverlay } from "../useOverlay";

interface UseConfirmDialogOptions {
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  dialogType?: "warning" | "default";
}

/**
 * Hook để hiển thị confirm dialog
 *
 * @example
 * ```tsx
 * const { showConfirmDialog } = useConfirmDialog();
 *
 * showConfirmDialog({
 *   title: "Xác nhận xóa",
 *   content: <p>Bạn có chắc muốn xóa item này?</p>,
 *   confirmText: "Xóa",
 *   cancelText: "Hủy",
 * }, () => handleDelete());
 * ```
 */
export const useConfirmDialog = () => {
  const { show } = useOverlay();

  const showConfirmDialog = (
    options: UseConfirmDialogOptions,
    onConfirm?: () => void,
    onCancel?: () => void,
  ) => {
    const dialogId = `confirm-dialog-${Date.now()}`;

    const overlay = {
      id: dialogId,
      type: "confirm-dialog" as const,
      title: options.title,
      titleClassName: options.titleClassName,
      content: options.content,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onConfirm,
      onCancel,
      dialogType: options.dialogType,
    };

    show(overlay);
    return dialogId;
  };

  return { showConfirmDialog };
};
