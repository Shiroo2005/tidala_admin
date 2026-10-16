import type { Tag, TagType } from "@/shared/types/tag.type";
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
import { useCallback, useState } from "react";
import { MdClose } from "react-icons/md";
import { useUpdateTag } from "../../hooks/useUpdateTag";
import { Input } from "@/shared/components/ui/input";
import { SingleSelect } from "@/shared/components/ui/single-select";

interface EditTagDialogProps {
  open: boolean;
  onClose: () => void;
  tag: Tag | null;
}

export const EditTagDialog = ({ open, onClose, tag }: EditTagDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<TagType>("specialty");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { mutate: update, isPending } = useUpdateTag();

  // Sync state with props directly during render to avoid cascading updates from useEffect
  const [prevTagId, setPrevTagId] = useState<string | number | undefined>(
    undefined,
  );

  if (tag?.id !== prevTagId) {
    setPrevTagId(tag?.id);
    setName(tag?.name || "");
    setType(tag?.type || "specialty");
  }

  const canSubmit = name.trim() !== "" && tag !== null && !isPending;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !tag) return;

    update(
      { id: tag.id, payload: { name: name.trim(), type } },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Cập nhật thẻ thành công",
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
            data?.message ||
            "Có lỗi xảy ra khi cập nhật thẻ. Vui lòng thử lại.";
          setSnackbar({
            open: true,
            message,
            severity: "error",
          });
        },
      },
    );
  }, [canSubmit, tag, name, type, update, onClose]);

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
            overflow: "visible",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Chỉnh sửa thẻ
          </Typography>
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

        <DialogContent
          sx={{
            py: 2.5,
            px: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            overflow: "visible",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              TÊN THẺ <span style={{ color: "red" }}>*</span>
            </Typography>
            <Input
              placeholder="Nhập tên thẻ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full h-10 rounded-xl px-3 border-app-border/80 focus-visible:border-brand focus-visible:ring-brand/20 bg-white text-sm"
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              LOẠI <span style={{ color: "red" }}>*</span>
            </Typography>
            <SingleSelect
              options={[
                { value: "specialty", label: "Chuyên môn" },
                { value: "style", label: "Phong cách" },
              ]}
              value={type}
              onChange={(val) => setType(val as TagType)}
              disabled={isPending}
              fullWidth
              className="h-10 rounded-xl border-app-border/80"
            />
          </Box>
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
            onClick={handleSubmit}
            disabled={!canSubmit}
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
              "Cập nhật"
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
