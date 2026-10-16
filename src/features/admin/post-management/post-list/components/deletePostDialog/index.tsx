import { extractPostMeta } from "@/features/post/utils/extractPostMeta";
import type { Post } from "@/shared/types/post.type";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useCallback, useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useDeleteAdminPost } from "../../hooks/useDeleteAdminPost";
import { useToast } from "@/shared/ui/overlay";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

interface DeletePostDialogProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  onSuccessCallback?: () => void;
}

export const DeletePostDialog = ({
  open,
  onClose,
  post,
  onSuccessCallback,
}: DeletePostDialogProps) => {
  const { showToast } = useToast();
  const { mutate: deletePostMutation, isPending } = useDeleteAdminPost();
  const [confirmText, setConfirmText] = useState("");

  const handleSubmit = useCallback(() => {
    if (!post) return;

    deletePostMutation(post.id, {
      onSuccess: () => {
        showToast({
          toastType: "success",
          message: "Xóa bài viết thành công",
          position: "top",
        });
        setTimeout(() => {
          onClose();
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        }, 800);
      },
      onError: (error: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiError = error as any;
        const data = apiError?.response?.data || apiError;
        const message =
          data?.message || "Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.";
        showToast({
          toastType: "error",
          message,
          position: "top",
        });
      },
    });
  }, [post, deletePostMutation, onClose, onSuccessCallback, showToast]);

  const handleClose = useCallback(() => {
    if (isPending) return;
    onClose();
  }, [isPending, onClose]);

  // Extract title to display in the confirm dialog
  const { title } = extractPostMeta(
    post?.contentSummary || post?.content || "",
    post?.mediaUrls,
  );

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirmText("");
    }
  }, [open]);

  const expectedConfirmText = "XacNhanXoaBaiDangNay";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
      }}
    >
      <DialogTitle className="flex items-center justify-between pb-3 px-6 pt-5 bg-white">
        <div className="flex items-center gap-2 text-app-error font-bold">
          <AlertTriangle className="h-5 w-5 text-app-error shrink-0" />
          <span className="text-lg font-bold text-app-text">Xác nhận xóa</span>
        </div>
        <button
          onClick={handleClose}
          disabled={isPending}
          className="text-app-text-muted hover:text-app-text transition-colors p-1 rounded-lg hover:bg-app-surface cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </DialogTitle>

      <Divider className="border-app-border/40" />

      <DialogContent className="py-5 px-6 bg-white">
        <p className="text-sm text-app-text-muted leading-relaxed">
          Bạn có chắc chắn muốn xóa bài viết{" "}
          <span className="font-semibold text-app-text">
            &quot;{title}&quot;
          </span>
          ?
        </p>
        <p className="text-xs font-semibold text-app-error mt-2">
          Hành động này không thể hoàn tác.
        </p>

        {title && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-app-text-muted mb-2">
              Vui lòng nhập <strong className="text-app-text font-bold">{expectedConfirmText}</strong> để xác nhận xóa:
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedConfirmText}
              disabled={isPending}
              className="w-full h-10 rounded-xl px-3 border-app-border/80 focus-visible:border-brand focus-visible:ring-brand/20 bg-white text-sm"
            />
          </div>
        )}
      </DialogContent>

      <Divider className="border-app-border/40" />

      <DialogActions className="px-6 py-4 flex gap-3 justify-end bg-app-surface/10">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isPending}
          className="h-9 px-4 rounded-xl text-sm font-semibold border-app-border/80 bg-white text-app-text-muted hover:bg-app-surface hover:text-app-text"
        >
          Hủy
        </Button>
        <Button
          variant="destructive"
          onClick={handleSubmit}
          disabled={isPending || !post || confirmText !== expectedConfirmText}
          isLoading={isPending}
          className="h-9 px-4 rounded-xl text-sm font-semibold min-w-[110px]"
        >
          Xóa bài viết
        </Button>
      </DialogActions>
    </Dialog>
  );
};
