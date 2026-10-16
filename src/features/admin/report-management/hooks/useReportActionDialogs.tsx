import { useToast } from "@/shared/ui/overlay";
import type { ApiErrorResponse } from "@/shared/types/api.type";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";
import { Box, Typography } from "@mui/material";
import { useState, type ReactNode } from "react";
import type { ReportActionConfirmDialogState } from "../components/ReportActionConfirmDialog";
import { useResolveReport } from "./useResolveReport";
import type {
  BanDuration,
  ReportData,
  ResolveReportRequest,
} from "../types/report.type";

interface BanDialogState {
  open: boolean;
  report: ReportData | null;
  suggestedDuration?: BanDuration | null;
}

interface UseReportActionDialogsParams {
  onDismissFromDetail: () => void;
  onActionComplete: () => void;
}

const INITIAL_CONFIRM_DIALOG: ReportActionConfirmDialogState = {
  open: false,
  title: "",
  content: null,
  confirmText: "Xác nhận",
  cancelText: "Hủy",
  onConfirm: () => {},
};

const getIgnoreTargetName = (report: ReportData): ReactNode => {
  if (report.targetType === "TEACHER") {
    const target = report.target as { fullName?: string } | null;
    return (
      <>
        báo cáo về giáo viên{" "}
        <strong>{target?.fullName || "Giáo viên"}</strong>
      </>
    );
  }

  if (report.targetType === "REVIEW") {
    return "báo cáo về đánh giá này";
  }

  const target = report.target as {
    title?: string | null;
    authorName?: string | null;
  } | null;

  if (target?.title) {
    return (
      <>
        báo cáo về bài viết <strong>"{target.title}"</strong>
      </>
    );
  }

  if (target?.authorName) {
    return (
      <>
        báo cáo về bài viết của{" "}
        <span style={{ color: "#6366f1", fontWeight: 600 }}>
          {target.authorName}
        </span>
      </>
    );
  }

  return "báo cáo về bài viết";
};

const getWarnTargetDescription = (report: ReportData): ReactNode => {
  if (report.targetType === "TEACHER") {
    const target = report.target as { fullName?: string } | null;
    return (
      <>
        giáo viên <strong>{target?.fullName || "Giáo viên"}</strong>
      </>
    );
  }

  if (report.targetType === "REVIEW") {
    return "tác giả của đánh giá này";
  }

  const target = report.target as {
    title?: string | null;
    authorName?: string | null;
  } | null;

  if (target?.title) {
    return (
      <>
        tác giả của bài viết <strong>"{target.title}"</strong>
      </>
    );
  }

  if (target?.authorName) {
    return (
      <>
        tác giả bài viết của{" "}
        <span style={{ color: "#6366f1", fontWeight: 600 }}>
          {target.authorName}
        </span>
      </>
    );
  }

  return "tác giả của bài viết";
};

const getPostTargetText = (report: ReportData): ReactNode => {
  const target = report.target as {
    title?: string | null;
    authorName?: string | null;
  } | null;

  if (target?.title) {
    return (
      <>
        bài viết <strong>"{target.title}"</strong>
      </>
    );
  }

  if (target?.authorName) {
    return (
      <>
        bài viết của{" "}
        <span style={{ color: "#6366f1", fontWeight: 600 }}>
          {target.authorName}
        </span>
      </>
    );
  }

  return "bài viết này";
};

const getBanSuccessCopy = (report: ReportData, duration: BanDuration) => {
  const targetLabel =
    report.targetType === "TEACHER"
      ? "giáo viên"
      : report.targetType === "REVIEW" || report.targetType === "COMMENT"
        ? "người bình luận"
        : "người đăng bài";
  const durationText =
    duration === "1"
      ? "1 ngày"
      : duration === "3"
        ? "3 ngày"
        : duration === "7"
          ? "7 ngày"
          : "vĩnh viễn";

  return { targetLabel, durationText };
};

const getResolveReportErrorMessage = (error: unknown) => {
  const apiError = error as ApiErrorResponse | undefined;

  return getErrorMessage(
    apiError?.code,
    apiError?.message || "Không thể xử lý báo cáo. Vui lòng thử lại.",
  );
};

const getReportTargetReasonLabel = (report: ReportData) => {
  if (report.targetType === "TEACHER") return "giáo viên";
  if (report.targetType === "REVIEW") return "đánh giá";
  return "bài viết";
};

const getBanResolvePayload = (
  report: ReportData,
  duration: BanDuration,
): ResolveReportRequest => {
  const { targetLabel } = getBanSuccessCopy(report, duration);

  if (duration === "permanent") {
    return {
      action: "USER_BANNED",
      status: "RESOLVED",
      reason: `Khóa tài khoản ${targetLabel} vĩnh viễn`,
      metadata: {},
    };
  }

  return {
    action: "USER_SUSPENDED",
    status: "RESOLVED",
    reason: `Khóa tài khoản ${targetLabel} trong ${duration} ngày`,
    metadata: {
      duration_days: Number(duration),
    },
  };
};

export const useReportActionDialogs = ({
  onDismissFromDetail,
  onActionComplete,
}: UseReportActionDialogsParams) => {
  const { showToast } = useToast();
  const resolveReportMutation = useResolveReport();
  const [confirmDialog, setConfirmDialog] =
    useState<ReportActionConfirmDialogState>(INITIAL_CONFIRM_DIALOG);
  const [banDialog, setBanDialog] = useState<BanDialogState>({
    open: false,
    report: null,
    suggestedDuration: null,
  });
  const [selectedDuration, setSelectedDuration] =
    useState<BanDuration>("1");

  const resolveReportAction = async (
    report: ReportData,
    payload: ResolveReportRequest,
    successMessage: string,
  ) => {
    try {
      await resolveReportMutation.mutateAsync({
        reportId: report.id,
        payload,
      });

      showToast({
        message: successMessage,
        toastType: "success",
        position: "top",
      });
    } catch (error) {
      showToast({
        message: getResolveReportErrorMessage(error),
        toastType: "error",
        position: "top",
      });
      throw error;
    }
  };

  const closeConfirmDialog = (restoreDetail = false) => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));

    if (restoreDetail) {
      onDismissFromDetail();
    } else {
      onActionComplete();
    }
  };

  const closeBanDialog = (restoreDetail = false) => {
    setBanDialog({ open: false, report: null, suggestedDuration: null });

    if (restoreDetail) {
      onDismissFromDetail();
    } else {
      onActionComplete();
    }
  };

  const handleIgnore = (report: ReportData) => {
    const targetName = getIgnoreTargetName(report);

    setConfirmDialog({
      open: true,
      title: "Bỏ qua báo cáo",
      subtitle: "Bỏ qua các phản hồi từ người dùng",
      content: (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.6 }}
        >
          Bạn có chắc chắn muốn bỏ qua {targetName}? Trạng thái báo cáo sẽ được
          cập nhật thành <strong style={{ color: "#334155" }}>Đã bỏ qua</strong>
          .
        </Typography>
      ),
      confirmText: "Bỏ qua",
      cancelText: "Hủy",
      isWarning: false,
      onConfirm: async () => {
        await resolveReportAction(
          report,
          {
            action: "CONTENT_RESTORED",
            status: "REJECTED",
            reason: `Bỏ qua báo cáo ${getReportTargetReasonLabel(report)}`,
            metadata: {},
          },
          "Đã bỏ qua báo cáo thành công!",
        );
      },
    });
  };

  const handleWarn = (report: ReportData) => {
    const targetDesc = getWarnTargetDescription(report);
    const requiresReason = report.targetType === "TEACHER";

    setConfirmDialog({
      open: true,
      title: "Gửi cảnh báo",
      subtitle: "Gửi thông báo nhắc nhở đến đối tượng bị báo cáo",
      content: (
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.6 }}
          >
            Hệ thống sẽ gửi thông báo cảnh báo đến {targetDesc}. Bạn có chắc
            chắn muốn tiếp tục?
          </Typography>
        </Box>
      ),
      confirmText: "Gửi cảnh báo",
      cancelText: "Hủy",
      isWarning: true,
      reasonInput: requiresReason
        ? {
            label: "Lý do cảnh báo",
            placeholder: "Nhập lý do cảnh báo gửi đến giáo viên",
            helperText: "Nội dung này sẽ được lưu vào lịch sử xử lý báo cáo.",
            required: true,
            minRows: 3,
          }
        : undefined,
      onConfirm: async (reason) => {
        const warningReason =
          requiresReason && reason
            ? reason
            : `Gửi cảnh báo cho ${getReportTargetReasonLabel(report)}`;

        await resolveReportAction(
          report,
          {
            action: "WARNING_SENT",
            status: "RESOLVED",
            reason: warningReason,
            metadata: requiresReason
              ? {
                  reason: warningReason,
                }
              : {},
          },
          "Đã gửi cảnh báo thành công!",
        );
      },
    });
  };

  const handleBan = (
    report: ReportData,
    suggestedDuration?: BanDuration | null,
  ) => {
    setBanDialog({
      open: true,
      report,
      suggestedDuration: suggestedDuration || null,
    });
    setSelectedDuration(suggestedDuration || "1");
  };

  const handleHide = (report: ReportData) => {
    let title = "Xác nhận hành động";
    let subtitle = "Xử lý nghiêm ngặt đối tượng bị báo cáo";
    let contentNode = (
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", lineHeight: 1.6 }}
      >
        Bạn có chắc chắn muốn thực hiện hành động này?
      </Typography>
    );
    let confirmText = "Xác nhận";
    let successMessage = "Thao tác thành công!";

    if (report.targetType === "REVIEW") {
      title = "Ẩn đánh giá";
      subtitle = "Gỡ bỏ đánh giá không hợp lệ khỏi hệ thống";
      contentNode = (
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}
          >
            Bạn có chắc chắn muốn ẩn đánh giá này?
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "error.main", fontWeight: 600 }}
          >
            * Hành động này sẽ ẩn đánh giá khỏi hệ thống và không thể hoàn tác.
          </Typography>
        </Box>
      );
      confirmText = "Ẩn đánh giá";
      successMessage = "Đã ẩn đánh giá thành công!";
    } else if (report.targetType === "POST") {
      title = "Ẩn bài viết";
      subtitle = "Gỡ bỏ bài đăng vi phạm chính sách của hệ thống";
      const postText = getPostTargetText(report);

      contentNode = (
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}
          >
            Bạn có chắc chắn muốn ẩn {postText}?
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "error.main", fontWeight: 600 }}
          >
            * Hành động này sẽ ẩn bài đăng vi phạm khỏi hệ thống và không thể
            hoàn tác.
          </Typography>
        </Box>
      );
      confirmText = "Ẩn bài viết";
      successMessage = "Đã ẩn bài viết thành công!";
    }

    setConfirmDialog({
      open: true,
      title,
      subtitle,
      content: contentNode,
      confirmText,
      cancelText: "Hủy",
      isWarning: true,
      onConfirm: async () => {
        await resolveReportAction(
          report,
          {
            action: "CONTENT_HIDDEN",
            status: "RESOLVED",
            reason: `Ẩn ${getReportTargetReasonLabel(report)} bị báo cáo`,
            metadata: {},
          },
          successMessage,
        );
      },
    });
  };

  const confirmBan = async (report: ReportData, duration: BanDuration) => {
    const { targetLabel, durationText } = getBanSuccessCopy(
      report,
      duration,
    );

    await resolveReportAction(
      report,
      getBanResolvePayload(report, duration),
      `Đã chặn ${targetLabel} thành công trong ${durationText}!`,
    );

    closeBanDialog();
  };

  return {
    confirmDialog,
    banDialog,
    selectedDuration,
    setSelectedDuration,
    closeConfirmDialog,
    closeBanDialog,
    handleIgnore,
    handleWarn,
    handleBan,
    handleHide,
    confirmBan,
  };
};
