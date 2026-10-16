import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { MdClose } from "react-icons/md";

interface ReportActionReasonInputConfig {
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  initialValue?: string;
  minRows?: number;
}

export interface ReportActionConfirmDialogState {
  open: boolean;
  title: string;
  subtitle?: string;
  content: ReactNode;
  confirmText: string;
  cancelText: string;
  isWarning?: boolean;
  reasonInput?: ReportActionReasonInputConfig;
  onConfirm: (reason?: string) => void | Promise<void>;
}

interface ReportActionConfirmDialogProps {
  dialog: ReportActionConfirmDialogState;
  onDismiss: () => void;
  onConfirmComplete: () => void;
}

export const ReportActionConfirmDialog = ({
  dialog,
  onDismiss,
  onConfirmComplete,
}: ReportActionConfirmDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonTouched, setReasonTouched] = useState(false);
  const trimmedReason = reason.trim();
  const reasonInput = dialog.reasonInput;
  const isReasonInvalid = Boolean(reasonInput?.required && !trimmedReason);
  const showReasonError = reasonTouched && isReasonInvalid;

  useEffect(() => {
    if (dialog.open) {
      setReason(dialog.reasonInput?.initialValue ?? "");
      setReasonTouched(false);
    }
  }, [dialog.open, dialog.reasonInput?.initialValue, dialog.title]);

  const handleConfirm = async () => {
    if (isSubmitting || isReasonInvalid) return;

    setIsSubmitting(true);
    try {
      await dialog.onConfirm(reasonInput ? trimmedReason : undefined);
      onConfirmComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={dialog.open}
      onClose={onDismiss}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
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
          pt: 2.5,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {dialog.title}
          </Typography>
          {dialog.subtitle && (
            <Typography variant="body2" color="text.secondary">
              {dialog.subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={onDismiss}
          sx={{ color: "text.secondary" }}
        >
          <MdClose size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2.5, px: 3, overflow: "visible" }}>
        {dialog.content}
        {reasonInput && (
          <TextField
            label={reasonInput.label || "Lý do"}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setReasonTouched(true)}
            multiline
            minRows={reasonInput.minRows ?? 3}
            fullWidth
            required={reasonInput.required}
            disabled={isSubmitting}
            placeholder={reasonInput.placeholder}
            helperText={
              showReasonError
                ? "Vui lòng nhập lý do cảnh báo"
                : reasonInput.helperText
            }
            error={showReasonError}
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onDismiss}
          disabled={isSubmitting}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
          }}
        >
          {dialog.cancelText}
        </Button>
        <Button
          variant="contained"
          color={dialog.isWarning ? "error" : "primary"}
          onClick={handleConfirm}
          disabled={isSubmitting || isReasonInvalid}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            minWidth: 100,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {isSubmitting ? "Đang xử lý..." : dialog.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
