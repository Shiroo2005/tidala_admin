import type { Tag } from "@/shared/types/tag.type";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { useCallback, useState, useEffect, useMemo } from "react";
import { MdClose, MdWarning } from "react-icons/md";
import { useDeleteTag } from "../../hooks/useDeleteTag";
import { Input } from "@/shared/components/ui/input";

const generateConfirmText = (text: string) => {
  if (!text) return "";
  let str = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  const words = str.split(/[^a-zA-Z0-9]/).filter(Boolean);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
};

interface DeleteTagDialogProps {
  open: boolean;
  onClose: () => void;
  tag: Tag | null;
}

export const DeleteTagDialog = ({
  open,
  onClose,
  tag,
}: DeleteTagDialogProps) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirmText("");
    }
  }, [open]);

  const expectedConfirmText = useMemo(() => {
    return tag ? generateConfirmText(tag.name) : "";
  }, [tag]);

  const { mutate: deleteTagMutation, isPending } = useDeleteTag();

  const handleSubmit = useCallback(() => {
    if (!tag) return;

    deleteTagMutation(tag.id, {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Xóa thẻ thành công",
          severity: "success",
        });
        setTimeout(() => {
          onClose();
        }, 800);
      },
      onError: (error: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiError = error as any;
        const data = apiError?.response?.data || apiError;
        const message =
          data?.message || "Có lỗi xảy ra khi xóa thẻ. Vui lòng thử lại.";
        setSnackbar({
          open: true,
          message,
          severity: "error",
        });
      },
    });
  }, [tag, deleteTagMutation, onClose]);

  const handleClose = useCallback(() => {
    if (isPending) return;
    onClose();
  }, [isPending, onClose]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            color: "error.main",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MdWarning size={24} />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Xác nhận xóa thẻ
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            disabled={isPending}
            sx={{ color: "text.secondary" }}
          >
            <MdClose size={20} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Bạn có chắc chắn muốn xóa thẻ{" "}
            <Typography component="span" fontWeight={700} color="text.primary">
              &quot;{tag?.name}&quot;
            </Typography>
            ?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 1, mb: 2 }}>
            Hành động này không thể hoàn tác.
          </Typography>

          {tag && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Vui lòng nhập <strong>{expectedConfirmText}</strong> để xác nhận xóa:
              </Typography>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={expectedConfirmText}
                disabled={isPending}
                className="w-full h-10 rounded-xl px-3 border-app-border/80 focus-visible:border-brand focus-visible:ring-brand/20 bg-white text-sm"
              />
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isPending}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={isPending || !tag || confirmText !== expectedConfirmText}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              minWidth: 100,
            }}
          >
            {isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Xóa thẻ"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
