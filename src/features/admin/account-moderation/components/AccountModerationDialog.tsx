import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getStorageUrl } from "@/shared/utils/url";
import { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import { AccountSanctionType, type SanctionUserRequest } from "../types";

type AccountModerationMode = "sanction" | "revoke";

export interface AccountModerationTarget {
  userId: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
}

export interface AccountModerationDialogState {
  mode: AccountModerationMode;
  target: AccountModerationTarget;
  sanctionType?: AccountSanctionType;
  availableSanctionTypes?: AccountSanctionType[];
}

interface AccountModerationDialogProps {
  state: AccountModerationDialogState | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSanction: (
    target: AccountModerationTarget,
    payload: SanctionUserRequest,
  ) => Promise<void>;
  onRevoke: (target: AccountModerationTarget, reason: string) => Promise<void>;
}

interface AccountModerationDialogFormProps
  extends Omit<AccountModerationDialogProps, "state"> {
  state: AccountModerationDialogState;
}

const SANCTION_TYPE_OPTIONS = [
  {
    value: AccountSanctionType.WARNING,
    label: "Cảnh báo",
  },
  {
    value: AccountSanctionType.SUSPENSION,
    label: "Chặn tạm thời",
  },
  {
    value: AccountSanctionType.BAN,
    label: "Chặn vĩnh viễn",
  },
] as const;

const LOCK_DURATION_OPTIONS = [
  {
    value: 1,
    label: "1 ngày",
    hours: "24h",
  },
  {
    value: 3,
    label: "3 ngày",
    hours: "72h",
  },
  {
    value: 7,
    label: "7 ngày",
    hours: "168h",
  },
] as const;

const PERMANENT_LOCK_DURATION = "PERMANENT" as const;

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === "object") {
    const maybeError = error as { message?: unknown; code?: unknown };

    if (typeof maybeError.message === "string" && maybeError.message) {
      return maybeError.message;
    }

    if (typeof maybeError.code === "string" && maybeError.code) {
      return maybeError.code;
    }
  }

  return "Thao tác thất bại, vui lòng thử lại";
};

export const AccountModerationDialog = ({
  state,
  isSubmitting = false,
  onClose,
  onSanction,
  onRevoke,
}: AccountModerationDialogProps) => {
  return (
    <Dialog
      open={Boolean(state)}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {state && (
        <AccountModerationDialogForm
          key={`${state.mode}-${state.target.userId}`}
          state={state}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSanction={onSanction}
          onRevoke={onRevoke}
        />
      )}
    </Dialog>
  );
};

const AccountModerationDialogForm = ({
  state,
  isSubmitting = false,
  onClose,
  onSanction,
  onRevoke,
}: AccountModerationDialogFormProps) => {
  const fixedSanctionType =
    state.mode === "sanction" ? state.sanctionType : undefined;
  const availableSanctionTypes = state.availableSanctionTypes;
  const availableSanctionOptions = useMemo(() => {
    if (!availableSanctionTypes?.length) return SANCTION_TYPE_OPTIONS;

    return SANCTION_TYPE_OPTIONS.filter((option) =>
      availableSanctionTypes.includes(option.value),
    );
  }, [availableSanctionTypes]);
  const [sanctionType, setSanctionType] = useState<AccountSanctionType>(
    fixedSanctionType ??
      availableSanctionOptions[0]?.value ??
      AccountSanctionType.SUSPENSION,
  );
  const [lockDuration, setLockDuration] = useState<
    number | typeof PERMANENT_LOCK_DURATION
  >(1);
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const trimmedReason = reason.trim();
  const isSanctionMode = state.mode === "sanction";
  const isBlockDialog =
    state.mode === "sanction" &&
    !fixedSanctionType &&
    Boolean(availableSanctionTypes?.length) &&
    !availableSanctionTypes?.includes(AccountSanctionType.WARNING);
  const selectedSanctionType =
    fixedSanctionType ??
    (isBlockDialog
      ? lockDuration === PERMANENT_LOCK_DURATION
        ? AccountSanctionType.BAN
        : AccountSanctionType.SUSPENSION
      : sanctionType);
  const isSuspension = selectedSanctionType === AccountSanctionType.SUSPENSION;
  const lockDurationOptions = isBlockDialog
    ? [
        ...LOCK_DURATION_OPTIONS,
        {
          value: PERMANENT_LOCK_DURATION,
          label: "Vĩnh viễn",
          hours: "",
        },
      ]
    : LOCK_DURATION_OPTIONS;
  const isValid = useMemo(() => {
    if (!trimmedReason) return false;
    if (
      isSanctionMode &&
      isSuspension &&
      (typeof lockDuration !== "number" || lockDuration < 1)
    ) {
      return false;
    }

    return true;
  }, [isSanctionMode, isSuspension, lockDuration, trimmedReason]);

  const handleConfirm = async () => {
    if (!isValid || isSubmitting) return;

    setErrorMessage("");

    try {
      if (state.mode === "revoke") {
        await onRevoke(state.target, trimmedReason);
      } else {
        const payload: SanctionUserRequest = {
          type: selectedSanctionType,
          reason: {
            message: trimmedReason,
          },
          metadata: {
            reason: trimmedReason,
          },
        };

        if (selectedSanctionType === AccountSanctionType.SUSPENSION) {
          const durationDays =
            typeof lockDuration === "number" ? lockDuration : 1;
          payload.durationDays = durationDays;
          payload.metadata = {
            ...payload.metadata,
            duration_days: durationDays,
          };
        }

        await onSanction(state.target, payload);
      }

      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const title =
    state.mode === "revoke"
      ? "Gỡ chặn tài khoản"
      : fixedSanctionType === AccountSanctionType.WARNING
        ? "Cảnh báo người dùng"
        : fixedSanctionType === AccountSanctionType.SUSPENSION
          ? "Chặn người dùng"
          : fixedSanctionType === AccountSanctionType.BAN
            ? "Chặn vĩnh viễn"
            : isBlockDialog
              ? "Chặn người dùng"
              : "Áp dụng hình thức xử lý";
  const confirmText =
    state.mode === "revoke"
      ? "Gỡ chặn"
      : fixedSanctionType === AccountSanctionType.WARNING
        ? "Gửi cảnh báo"
        : fixedSanctionType === AccountSanctionType.SUSPENSION ||
            (isBlockDialog &&
              selectedSanctionType === AccountSanctionType.SUSPENSION)
          ? "Chặn người dùng"
          : fixedSanctionType === AccountSanctionType.BAN ||
              (isBlockDialog && selectedSanctionType === AccountSanctionType.BAN)
            ? "Chặn vĩnh viễn"
            : "Áp dụng";
  const confirmColor =
    state.mode === "revoke"
      ? "primary"
      : selectedSanctionType === AccountSanctionType.WARNING
        ? "warning"
        : "error";
  const avatarSrc = getStorageUrl(state.target.avatarUrl || "");
  const fallbackInitial = state.target.fullName?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ color: "text.secondary" }}
        >
          <MdClose size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={state.target.fullName}
                className="h-11 w-11 shrink-0 rounded-full bg-white object-cover ring-1 ring-slate-200"
                onError={(event) => {
                  (event.target as HTMLImageElement).style.display = "none";
                  const fallback = (event.target as HTMLImageElement)
                    .nextElementSibling;
                  if (fallback) {
                    (fallback as HTMLElement).style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand ring-1 ring-brand/15"
              style={{ display: avatarSrc ? "none" : "flex" }}
            >
              {fallbackInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-slate-900">
                {state.target.fullName}
              </p>
              {state.target.email && (
                <p className="truncate text-xs font-medium text-slate-500">
                  <span className="font-bold text-slate-600">Email: </span>
                  {state.target.email}
                </p>
              )}
              {state.target.phoneNumber && (
                <p className="truncate text-xs font-medium text-slate-500">
                  <span className="font-bold text-slate-600">
                    Số điện thoại:{" "}
                  </span>
                  {state.target.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {state.mode === "sanction" && !fixedSanctionType && !isBlockDialog && (
            <FormControl fullWidth size="small">
              <InputLabel id="account-sanction-type-label">
                Hình thức xử lý
              </InputLabel>
              <Select
                labelId="account-sanction-type-label"
                value={sanctionType}
                label="Hình thức xử lý"
                onChange={(event) =>
                  setSanctionType(event.target.value as AccountSanctionType)
                }
                disabled={isSubmitting}
              >
                {availableSanctionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {state.mode === "sanction" && (isSuspension || isBlockDialog) && (
            <FormControl fullWidth size="small">
              <InputLabel id="account-lock-duration-label">
                Thời hạn khóa tài khoản
              </InputLabel>
              <Select
                labelId="account-lock-duration-label"
                value={lockDuration}
                label="Thời hạn khóa tài khoản"
                onChange={(event) => {
                  const value = event.target.value;
                  setLockDuration(
                    value === PERMANENT_LOCK_DURATION
                      ? PERMANENT_LOCK_DURATION
                      : Number(value),
                  );
                }}
                disabled={isSubmitting}
              >
                {lockDurationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <span className="text-sm font-semibold">
                      {option.label}
                      {option.hours && (
                        <>
                          {" "}
                          <span className="font-medium text-slate-500">
                            ({option.hours})
                          </span>
                        </>
                      )}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            label="Lý do"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            multiline
            minRows={3}
            fullWidth
            disabled={isSubmitting}
            placeholder="Nhập lý do để lưu vào lịch sử kiểm duyệt"
          />

          {errorMessage && (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
              {errorMessage}
            </p>
          )}
        </div>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={handleConfirm}
          disabled={!isValid || isSubmitting}
          sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
        >
          {isSubmitting ? "Đang xử lý..." : confirmText}
        </Button>
      </DialogActions>
    </>
  );
};
