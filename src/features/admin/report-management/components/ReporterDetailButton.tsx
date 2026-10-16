import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { FiCalendar, FiFlag, FiMail, FiPhone, FiShield, FiUser, FiUserCheck, FiX } from "react-icons/fi";
import { getStorageUrl } from "@/shared/utils/url";
import { imageUrls } from "@/shared/constants/imageUrls";
import { useReporterDetail } from "../hooks/useReporterDetail";
import type { ReporterDetail } from "../types/report.type";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Học sinh",
  TEACHER: "Giáo viên",
  ADMIN: "Quản trị viên",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
  BANNED: "Bị khóa",
  DRAFT: "Bản nháp",
  DELETED: "Đã xóa",
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Row = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <Box sx={{ display: "flex", gap: 1.5, py: 1 }}>
    <Box sx={{ color: "text.secondary", mt: 0.25 }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
        {children}
      </Typography>
    </Box>
  </Box>
);

const ReporterDetailDialog = ({
  reporterId,
  reporterEmail,
  open,
  onClose,
}: {
  reporterId: string;
  reporterEmail?: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { data, isLoading, isError, error } = useReporterDetail(reporterId, open);
  const detail = data as ReporterDetail | undefined;
  const avatar = (detail ? getStorageUrl(detail.avatarUrl) : "") || imageUrls.fallback.avatar;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
        <span>Chi tiết người báo cáo</span>
        <IconButton size="small" onClick={onClose} aria-label="Đóng">
          <FiX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : isError || !detail ? (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Không tìm thấy tài khoản trong hệ thống
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {(error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ??
                (error as { message?: string })?.message ??
                "Tài khoản có thể đã bị xóa."}
            </Typography>
            {reporterEmail ? (
              <Row icon={<FiMail size={16} />} label="Email từ báo cáo">
                {reporterEmail}
              </Row>
            ) : null}
            <Row icon={<FiUser size={16} />} label="ID người dùng">
              {reporterId}
            </Row>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1 }}>
              <img
                src={avatar}
                alt={detail.fullName}
                className="h-14 w-14 rounded-full border border-slate-200 object-cover"
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                  {detail.fullName || "—"}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.75, mt: 0.75, flexWrap: "wrap" }}>
                  <Chip size="small" label={ROLE_LABELS[detail.role] ?? detail.role} color="primary" variant="outlined" />
                  <Chip
                    size="small"
                    label={STATUS_LABELS[detail.status] ?? detail.status}
                    color={detail.banned ? "error" : detail.status === "ACTIVE" ? "success" : "default"}
                  />
                </Box>
              </Box>
            </Box>
            <Divider />
            <Row icon={<FiMail size={16} />} label="Email">
              {detail.email || "—"}
              {detail.email ? (
                <Typography component="span" variant="caption" color="text.secondary">
                  {" "}
                  ({detail.emailVerified ? "đã xác thực" : "chưa xác thực"})
                </Typography>
              ) : null}
            </Row>
            <Row icon={<FiPhone size={16} />} label="Số điện thoại">
              {detail.phoneNumber || "Chưa cập nhật"}
            </Row>
            <Row icon={<FiCalendar size={16} />} label="Ngày tham gia">
              {formatDate(detail.createdAt)}
            </Row>
            <Row icon={<FiFlag size={16} />} label="Báo cáo đã gửi">
              {detail.totalReports} báo cáo · {detail.pendingReports} đang chờ xử lý
            </Row>
            {detail.banned ? (
              <>
                <Divider />
                <Row icon={<FiShield size={16} />} label="Đang bị khóa">
                  {detail.bannedUntil ? `Đến ${formatDate(detail.bannedUntil)}` : "Không thời hạn"}
                </Row>
                {detail.banReason ? (
                  <Row icon={<FiUserCheck size={16} />} label="Lý do khóa">
                    {detail.banReason}
                  </Row>
                ) : null}
              </>
            ) : null}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

interface ReporterDetailButtonProps {
  reporterId: string;
  reporterEmail?: string;
  variant?: "icon" | "text";
}

/**
 * Opens the reporter account detail. Self-contained (own dialog state) so it can
 * sit inside table cells, mobile cards and the report detail overview.
 */
export const ReporterDetailButton = ({ reporterId, reporterEmail, variant = "icon" }: ReporterDetailButtonProps) => {
  const [open, setOpen] = useState(false);
  if (!reporterId) return null;
  return (
    <>
      {variant === "icon" ? (
        <IconButton
          size="small"
          title="Chi tiết người báo cáo"
          aria-label="Chi tiết người báo cáo"
          onClick={(event) => {
            event.stopPropagation();
            setOpen(true);
          }}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "primary.light" } }}
        >
          <FiUserCheck size={16} />
        </IconButton>
      ) : (
        <Button
          size="small"
          variant="outlined"
          startIcon={<FiUserCheck size={14} />}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(true);
          }}
        >
          Chi tiết
        </Button>
      )}
      <ReporterDetailDialog reporterId={reporterId} reporterEmail={reporterEmail} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ReporterDetailButton;
