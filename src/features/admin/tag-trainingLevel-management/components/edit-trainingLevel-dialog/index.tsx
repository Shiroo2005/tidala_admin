import type { TrainingLevel } from "@/shared/types/common.type";
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
import { useUpdateTrainingLevel } from "../../hooks/useUpdateTrainingLevel";
import { Input } from "@/shared/components/ui/input";

interface EditTrainingLevelDialogProps {
  open: boolean;
  onClose: () => void;
  level: TrainingLevel | null;
}

const parseDescription = (desc: string) => {
  let taiTrong = "";
  let soCho = "";
  if (desc) {
    const taiTrongMatch = desc.match(/Tải trọng:\s*([^,]*)/i);
    if (taiTrongMatch) {
      taiTrong = taiTrongMatch[1].trim();
    }
    const soChoMatch = desc.match(/Số chỗ:\s*([^,]*)/i);
    if (soChoMatch) {
      soCho = soChoMatch[1].trim();
    }
    if (!taiTrong && !soCho) {
      taiTrong = desc.trim();
    }
  }
  return { taiTrong, soCho };
};

export const EditTrainingLevelDialog = ({
  open,
  onClose,
  level,
}: EditTrainingLevelDialogProps) => {
  const [name, setName] = useState("");
  const [taiTrong, setTaiTrong] = useState("");
  const [soCho, setSoCho] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { mutate: update, isPending } = useUpdateTrainingLevel();

  // Sync state with props directly during render to avoid cascading updates from useEffect
  const [prevLevelId, setPrevLevelId] = useState<string | number | undefined>(
    undefined,
  );

  if (level?.id !== prevLevelId) {
    setPrevLevelId(level?.id);
    setName(level?.name || "");
    const parsed = parseDescription(level?.description || "");
    setTaiTrong(parsed.taiTrong);
    setSoCho(parsed.soCho);
  }

  const canSubmit = name.trim() !== "" && level !== null && !isPending;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !level) return;

    const parts: string[] = [];
    if (taiTrong.trim()) {
      parts.push(`Tải trọng: ${taiTrong.trim()}`);
    }
    if (soCho.trim()) {
      parts.push(`Số chỗ: ${soCho.trim()}`);
    }
    const mergedDescription = parts.join(", ");

    update(
      {
        id: level.id,
        payload: {
          id: level.id,
          name: name.trim(),
          description: mergedDescription,
        },
      },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: "Cập nhật hạng đào tạo thành công",
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
            "Có lỗi xảy ra khi cập nhật hạng đào tạo. Vui lòng thử lại.";
          setSnackbar({
            open: true,
            message,
            severity: "error",
          });
        },
      },
    );
  }, [canSubmit, level, name, taiTrong, soCho, update, onClose]);

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
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Chỉnh sửa hạng đào tạo
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
          }}
        >
          <Box>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              TÊN HẠNG <span style={{ color: "red" }}>*</span>
            </Typography>
            <Input
              placeholder="Nhập tên hạng đào tạo"
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
              TẢI TRỌNG
            </Typography>
            <Input
              placeholder="Ví dụ: Tất cả xe mô tô"
              value={taiTrong}
              onChange={(e) => setTaiTrong(e.target.value)}
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
              SỐ CHỐ
            </Typography>
            <Input
              placeholder="Ví dụ: 2 chỗ"
              value={soCho}
              onChange={(e) => setSoCho(e.target.value)}
              disabled={isPending}
              className="w-full h-10 rounded-xl px-3 border-app-border/80 focus-visible:border-brand focus-visible:ring-brand/20 bg-white text-sm"
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
