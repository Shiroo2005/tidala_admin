import type { TagType } from "@/shared/types/tag.type";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline } from "react-icons/md";
import { useBulkCreateTags } from "../../hooks/useBulkCreateTags";
import { Input } from "@/shared/components/ui/input";
import { SingleSelect } from "@/shared/components/ui/single-select";

interface CreateTagsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface TagDraft {
  id: number;
  name: string;
  type: TagType;
}

let nextId = 1;

const createEmptyDraft = (): TagDraft => ({
  id: nextId++,
  name: "",
  type: "specialty",
});

export const CreateTagsDialog = ({ open, onClose }: CreateTagsDialogProps) => {
  const [drafts, setDrafts] = useState<TagDraft[]>([createEmptyDraft()]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { mutate: bulkCreate, isPending } = useBulkCreateTags();

  const handleAddRow = useCallback(() => {
    setDrafts((prev) => [...prev, createEmptyDraft()]);
  }, []);

  const handleRemoveRow = useCallback((id: number) => {
    setDrafts((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const handleFieldChange = useCallback(
    (id: number, field: "name" | "type", value: string) => {
      setDrafts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
      );
    },
    [],
  );

  const validDrafts = drafts.filter((d) => d.name.trim() !== "");
  const canSubmit = validDrafts.length > 0 && !isPending;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const payload = validDrafts.map((d) => ({
      name: d.name.trim(),
      type: d.type,
    }));

    bulkCreate(payload, {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: `Đã tạo thành công ${payload.length} thẻ`,
          severity: "success",
        });
        // Reset form and close after brief delay
        setTimeout(() => {
          setDrafts([createEmptyDraft()]);
          onClose();
        }, 800);
      },
      onError: (error: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiError = error as any;
        const data = apiError?.response?.data || apiError;
        const message =
          data?.message || "Có lỗi xảy ra khi tạo thẻ. Vui lòng thử lại.";
        setSnackbar({
          open: true,
          message,
          severity: "error",
        });
      },
    });
  }, [canSubmit, validDrafts, bulkCreate, onClose]);

  const handleClose = useCallback(() => {
    if (isPending) return;
    setDrafts([createEmptyDraft()]);
    onClose();
  }, [isPending, onClose]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "80vh",
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
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Tạo thẻ mới
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thêm một hoặc nhiều thẻ cùng lúc
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

        <DialogContent sx={{ py: 2.5, px: 3, overflow: "visible" }}>
          {/* Column labels */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mb: 1.5,
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ flex: 1 }}
            >
              TÊN THẺ
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ width: 150, flexShrink: 0 }}
            >
              LOẠI
            </Typography>
            <Box sx={{ width: 36, flexShrink: 0 }} />
          </Box>

          {/* Draft rows */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {drafts.map((draft, index) => (
              <Box
                key={draft.id}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                  animation: "fadeIn 0.2s ease-in",
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0, transform: "translateY(-4px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Input
                  placeholder={`Thẻ ${index + 1}`}
                  value={draft.name}
                  onChange={(e) =>
                    handleFieldChange(draft.id, "name", e.target.value)
                  }
                  disabled={isPending}
                  className="flex-1 h-10 rounded-xl px-3 border-app-border/80 focus-visible:border-brand focus-visible:ring-brand/20 bg-white"
                  autoFocus={index === drafts.length - 1}
                />
                
                <SingleSelect
                  options={[
                    { value: "specialty", label: "Chuyên môn" },
                    { value: "style", label: "Phong cách" },
                  ]}
                  value={draft.type}
                  onChange={(val) =>
                    handleFieldChange(draft.id, "type", val)
                  }
                  disabled={isPending}
                  containerClassName="!w-[150px] shrink-0"
                  className="h-10 rounded-xl border-app-border/80"
                />

                <Tooltip title="Xóa" arrow>
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveRow(draft.id)}
                      disabled={isPending || drafts.length <= 1}
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "error.main" },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <MdDeleteOutline size={18} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            ))}
          </Box>

          {/* Add row button */}
          <Button
            startIcon={<MdAdd />}
            onClick={handleAddRow}
            disabled={isPending}
            size="small"
            sx={{
              mt: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "primary.main",
              "&:hover": { bgcolor: "primary.50" },
            }}
          >
            Thêm thẻ
          </Button>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mr: "auto" }}
          >
            {validDrafts.length} thẻ hợp lệ
          </Typography>
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
              minWidth: 120,
            }}
          >
            {isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              `Tạo ${validDrafts.length > 0 ? validDrafts.length : ""} thẻ`
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
