import { imageUrls } from "@/shared/constants/imageUrls";
import { getStorageUrl } from "@/shared/utils/url";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FiAlertOctagon } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import type {
  BanDuration,
  CommentTarget,
  PersonResponse,
  PostTarget,
  ReportData,
  ReviewTarget,
  TeacherTarget,
} from "../types/report.type";

type BanAccountPreview = Partial<PersonResponse> & { fullName: string };

interface ReportBanDialogProps {
  open: boolean;
  report: ReportData | null;
  selectedDuration: BanDuration;
  suggestedDuration?: BanDuration | null;
  onDurationChange: (duration: BanDuration) => void;
  onDismiss: () => void;
  onConfirm: (report: ReportData, duration: BanDuration) => void | Promise<void>;
}

const DURATION_OPTIONS: {
  value: BanDuration;
  label: string;
  description: string;
}[] = [
  {
    value: "1",
    label: "1 ngày",
    description: "Tạm khóa trong 24 giờ",
  },
  {
    value: "3",
    label: "3 ngày",
    description: "Tạm khóa trong 72 giờ",
  },
  {
    value: "7",
    label: "7 ngày",
    description: "Tạm khóa trong 168 giờ",
  },
  {
    value: "permanent",
    label: "Vĩnh viễn",
    description: "Khóa tài khoản vô thời hạn",
  },
];

const getBanDialogCopy = (report: ReportData) => {
  if (report.targetType === "TEACHER") {
    return {
      title: "Khóa tài khoản giáo viên",
      targetTypeLabel: "giáo viên",
    };
  }

  if (report.targetType === "REVIEW") {
    return {
      title: "Khóa tài khoản người bình luận",
      targetTypeLabel: "người bình luận",
    };
  }

  if (report.targetType === "COMMENT") {
    return {
      title: "Khóa tài khoản người bình luận",
      targetTypeLabel: "người bình luận",
    };
  }

  return {
    title: "Khóa tài khoản người đăng bài",
    targetTypeLabel: "người đăng bài",
  };
};

const getReportedAuthor = (
  report: ReportData,
): BanAccountPreview | null => {
  if (report.targetType === "REVIEW") {
    const target = report.target as ReviewTarget | null | undefined;
    const fullName = target?.author?.fullName || target?.authorName;

    return fullName ? { ...target?.author, fullName } : null;
  }

  if (report.targetType === "COMMENT") {
    const target = report.target as CommentTarget | null | undefined;
    const fullName = target?.author?.fullName || target?.authorName;

    return fullName ? { ...target?.author, fullName } : null;
  }

  if (report.targetType === "POST") {
    const target = report.target as PostTarget | null | undefined;
    const fullName = target?.author?.fullName || target?.authorName;

    return fullName ? { ...target?.author, fullName } : null;
  }

  return null;
};

const AccountProfilePreview = ({
  account,
}: {
  account: BanAccountPreview | null;
}) => {
  const avatar = getStorageUrl(account?.avatarUrl) || imageUrls.fallback.avatar;

  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex items-center gap-3.5">
      <img
        src={avatar}
        alt={account?.fullName || "Người dùng"}
        className="w-12 h-12 rounded-full object-cover border-2 border-red-100 shadow-2xs bg-white"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-slate-900 truncate">
          {account?.fullName || "Người dùng"}
        </p>
        {account?.email && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Email:{" "}
            <span className="font-semibold text-slate-700">
              {account.email}
            </span>
          </p>
        )}
        {account?.phoneNumber && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Số điện thoại:{" "}
            <span className="font-semibold text-slate-700">
              {account.phoneNumber}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

const TargetPreview = ({ report }: { report: ReportData }) => {
  if (report.targetType === "TEACHER") {
    const target = report.target as TeacherTarget | null | undefined;
    if (!target) return null;

    return <AccountProfilePreview account={target} />;
  }

  if (report.targetType === "REVIEW") {
    const target = report.target as ReviewTarget | null | undefined;
    if (!target) return null;
    const author = getReportedAuthor(report);

    return <AccountProfilePreview account={author} />;
  }

  if (report.targetType === "COMMENT") {
    const target = report.target as CommentTarget | null | undefined;
    if (!target) return null;
    const author = getReportedAuthor(report);

    return (
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-3">
        <AccountProfilePreview account={author} />

        <div className="bg-white border border-slate-200/60 rounded-lg p-3 shadow-3xs">
          <p className="text-xs text-slate-600 font-medium italic line-clamp-2 leading-relaxed">
            "{target.content || "Không có nội dung"}"
          </p>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold font-mono select-all">
          ID Bình luận: {target.id}
        </p>
      </div>
    );
  }

  const target = report.target as PostTarget | null | undefined;
  if (!target) return null;
  const author = getReportedAuthor(report);

  return <AccountProfilePreview account={author} />;
};

export const ReportBanDialog = ({
  open,
  report,
  selectedDuration,
  suggestedDuration,
  onDurationChange,
  onDismiss,
  onConfirm,
}: ReportBanDialogProps) => {
  const dialogCopy = report ? getBanDialogCopy(report) : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!report || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(report, selectedDuration);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onDismiss}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          maxHeight: "90vh",
          overflow: "hidden",
        },
      }}
    >
      {report && dialogCopy && (
        <>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 1.5,
              pt: 2.5,
              px: 3,
              background: "linear-gradient(to right, #fef2f2, #ffffff)",
            }}
          >
            <Box>
              <div className="flex items-center gap-2">
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ color: "slate.900" }}
                >
                  {dialogCopy.title}
                </Typography>
              </div>
            </Box>
            <IconButton
              size="small"
              onClick={onDismiss}
              sx={{
                color: "text.secondary",
                bgcolor: "slate.100",
                "&:hover": { bgcolor: "slate.200" },
                borderRadius: "8px",
              }}
            >
              <MdClose size={20} />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent
            sx={{
              py: 2.5,
              px: 3,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <TargetPreview report={report} />

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Thời gian khóa
              </span>
              {suggestedDuration && (
                <span className="text-xs font-semibold text-slate-500">
                  Gợi ý từ lịch sử xử lý, admin có thể đổi tùy mức độ vi phạm.
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DURATION_OPTIONS.map((option) => {
                const isSelected = selectedDuration === option.value;
                const isSuggested = suggestedDuration === option.value;

                return (
                  <div
                    key={option.value}
                    onClick={() => onDurationChange(option.value)}
                    className={`relative flex flex-col justify-between border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer select-none text-left ${
                      isSelected
                        ? "border-red-500 bg-red-50/20 text-red-900 shadow-xs ring-1 ring-red-500/20"
                        : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-sm font-bold ${isSelected ? "text-red-700" : "text-slate-800"}`}
                      >
                        {option.label}
                      </span>
                      {isSuggested && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">
                          Gợi ý
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold ${isSelected ? "text-red-600" : "text-slate-500"}`}
                    >
                      {option.description}
                    </span>

                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>

            {selectedDuration === "permanent" && (
              <div className="rounded-xl p-4 border flex gap-3 items-start transition-all duration-200 bg-red-50/50 border-red-100 text-red-800">
                <span className="p-1 rounded-lg shrink-0 mt-0.5 bg-red-100 text-red-600">
                  <FiAlertOctagon size={16} />
                </span>
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold block">
                    Lưu ý quan trọng!
                  </span>
                  <p className="text-xs leading-relaxed opacity-90 font-medium">
                    {`Tài khoản của ${dialogCopy.targetTypeLabel} này sẽ bị vô hiệu hóa vô thời hạn. Họ sẽ KHÔNG THỂ đăng nhập hay thực hiện bất kỳ hoạt động nào trên hệ thống.`}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2, gap: 1, bgcolor: "slate-50/20" }}>
            <Button
              variant="outlined"
              onClick={onDismiss}
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2.5,
                px: 3,
                borderColor: "slate.300",
                color: "slate.600",
                "&:hover": {
                  borderColor: "slate.400",
                  bgcolor: "slate.50",
                },
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirm}
              disabled={isSubmitting}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                px: 4.5,
                minWidth: 120,
                boxShadow: "none",
                bgcolor: "#ef4444",
                "&:hover": {
                  bgcolor: "#dc2626",
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận chặn"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
