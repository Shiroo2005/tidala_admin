import { imageUrls } from "@/shared/constants/imageUrls";
import { FiAlertTriangle, FiClock, FiSlash } from "react-icons/fi";
import { MdCheck } from "react-icons/md";
import { getReportReasonById } from "../constants/report-reasons";
import type { MockReport } from "../mocks/mock-reports";
import { getStorageUrl } from "@/shared/utils/url";

type ReportItemProps = {
  report: MockReport;
  onWarnTeacher?: (report: MockReport) => void;
  onBlockTeacher?: (report: MockReport) => void;
  onDismiss?: (report: MockReport) => void;
};

const STATUS_MAP = {
  pending: {
    label: "Chờ xử lý",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  resolved: {
    label: "Đã xử lý",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  dismissed: {
    label: "Đã bỏ qua",
    className: "bg-slate-50 text-slate-500 border-slate-200",
  },
} as const;

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Vừa xong";
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

export const ReportItem = ({
  report,
  onWarnTeacher,
  onBlockTeacher,
  onDismiss,
}: ReportItemProps) => {
  const reasonInfo = getReportReasonById(report.reason);
  const statusInfo = STATUS_MAP[report.status];
  const targetUser =
    report.type === "teacher"
      ? report.reportedTeacher
      : report.reportedPost.owner;
  const teacherAvatar =
    getStorageUrl(targetUser.avatarUrl) || imageUrls.fallback.avatar;
  const reporterAvatar =
    getStorageUrl(report.reporter.avatarUrl) || imageUrls.fallback.avatar;

  const isPending = report.status === "pending";

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
      {/* Top: Teacher avatar + info */}
      <div className="flex items-start gap-3">
        {/* Teacher avatar only */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100 shrink-0">
          <img
            src={teacherAvatar}
            alt={targetUser.fullName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {targetUser.fullName}
            </h3>
            <span
              className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusInfo.className}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Reason badge */}
          {reasonInfo && (
            <span
              className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1.5"
              style={{
                backgroundColor: reasonInfo.color.bg,
                color: reasonInfo.color.text,
                border: `1px solid ${reasonInfo.color.border}`,
              }}
            >
              {reasonInfo.label}
            </span>
          )}

          {/* Reporter info */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-100 shrink-0">
              <img
                src={reporterAvatar}
                alt={report.reporter.fullName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="text-xs text-slate-500 truncate">
              {report.reporter.fullName}
            </span>
            <span
              className={`text-[9px] font-medium px-1.5 py-px rounded-full shrink-0 ${
                report.reporter.role === "student"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              {report.reporter.role === "student" ? "Học viên" : "Giáo viên"}
            </span>
          </div>

          {/* Description (Full text) */}
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {report.description}
          </p>

          {/* Time */}
          <div className="flex items-center gap-1 mt-1.5">
            <FiClock size={11} className="text-slate-400" />
            <span className="text-[11px] text-slate-400">
              {formatTimeAgo(report.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons — only show for pending reports */}
      {isPending && (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onWarnTeacher?.(report)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg border border-amber-200 transition-colors hover:bg-amber-100 active:bg-amber-200"
          >
            <FiAlertTriangle size={13} />
            Cảnh báo
          </button>
          <button
            onClick={() => onBlockTeacher?.(report)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg border border-red-200 transition-colors hover:bg-red-100 active:bg-red-200"
          >
            <FiSlash size={13} />
            Chặn GV
          </button>
          <button
            onClick={() => onDismiss?.(report)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 bg-slate-50 rounded-lg border border-slate-200 transition-colors hover:bg-slate-100 active:bg-slate-200"
          >
            <MdCheck size={14} />
            Bỏ qua
          </button>
        </div>
      )}
    </div>
  );
};

/** Skeleton placeholder shown during initial load */
export const ReportItemSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-14 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="mt-2 h-4 w-24 bg-slate-100 rounded-full animate-pulse" />
        <div className="mt-2 h-3 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="mt-1.5 h-3 w-full bg-slate-100 rounded animate-pulse" />
        <div className="mt-1 h-3 w-3/4 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
    <div className="flex gap-2 mt-3">
      <div className="flex-1 h-8 bg-slate-100 rounded-lg animate-pulse" />
      <div className="flex-1 h-8 bg-slate-100 rounded-lg animate-pulse" />
      <div className="flex-1 h-8 bg-slate-100 rounded-lg animate-pulse" />
    </div>
  </div>
);
