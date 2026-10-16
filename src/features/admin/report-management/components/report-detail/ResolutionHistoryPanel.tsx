import { FiArrowRight, FiClock } from "react-icons/fi";
import type {
  ReportActionData,
  ResolveReportAction,
} from "../../types/report.type";
import { formatDate } from "./utils";

const ACTION_LABELS: Partial<Record<ResolveReportAction, string>> = {
  WARNING_SENT: "Gửi cảnh báo",
  CONTENT_HIDDEN: "Ẩn nội dung",
  CONTENT_RESTORED: "Khôi phục nội dung",
  CONTENT_DELETED: "Xóa nội dung",
  COMMENTS_LOCKED: "Khóa bình luận",
  COMMENTS_UNLOCKED: "Mở khóa bình luận",
  USER_SUSPENDED: "Khóa tài khoản tạm thời",
  USER_UNSUSPENDED: "Mở khóa tài khoản",
  USER_BANNED: "Cấm tài khoản",
  USER_UNBANNED: "Gỡ cấm tài khoản",
};

const getActionLabel = (historyItem: ReportActionData) => {
  if (historyItem.action) {
    return ACTION_LABELS[historyItem.action] || historyItem.action;
  }

  if (historyItem.status === "REJECTED") return "Bỏ qua báo cáo";
  return "Cập nhật trạng thái";
};

const getDurationDays = (historyItem: ReportActionData) => {
  const rawDuration =
    historyItem.metadata?.duration_days ||
    historyItem.metadata?.durationDays ||
    historyItem.metadata?.duration;

  if (typeof rawDuration === "number") return rawDuration;
  if (typeof rawDuration === "string") {
    const parsedDuration = Number(rawDuration);

    if (Number.isFinite(parsedDuration)) return parsedDuration;
  }

  const reasonDuration = historyItem.reason?.match(/(\d+)\s*ngày/i)?.[1];

  return reasonDuration ? Number(reasonDuration) : null;
};

const getResolutionTitle = (historyItem: ReportActionData) => {
  const durationDays = getDurationDays(historyItem);

  if (historyItem.action === "USER_SUSPENDED") {
    return durationDays
      ? `Khóa tài khoản ${durationDays} ngày`
      : "Khóa tài khoản";
  }

  if (historyItem.action === "USER_BANNED") return "Khóa tài khoản vĩnh viễn";

  return historyItem.reason || getActionLabel(historyItem);
};

const getTimelineRange = (historyItem: ReportActionData) => {
  const durationDays = getDurationDays(historyItem);

  if (!durationDays) {
    return { start: formatDate(historyItem.createdAt), end: null };
  }

  const startDate = new Date(historyItem.createdAt);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);

  return {
    start: formatDate(historyItem.createdAt),
    end: formatDate(endDate.toISOString()),
  };
};

export const ResolutionHistoryPanel = ({
  history,
}: {
  history: ReportActionData[];
}) => {
  const sortedHistory = [...history].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  if (sortedHistory.length === 0) return null;

  return (
    <section className="rounded-xl border border-emerald-100 bg-emerald-50/45 p-4 shadow-xs">
      <div className="space-y-3">
        {sortedHistory.map((historyItem, index) => {
          const timelineRange = getTimelineRange(historyItem);

          return (
            <div
              key={historyItem.id}
              className={index > 0 ? "border-t border-emerald-100 pt-3" : ""}
            >
              <p className="text-sm font-extrabold leading-snug text-slate-900">
                {getResolutionTitle(historyItem)}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <FiClock size={12} className="shrink-0 text-slate-400" />
                <span>{timelineRange.start}</span>
                {timelineRange.end && (
                  <>
                    <FiArrowRight
                      size={13}
                      className="shrink-0 text-slate-500"
                    />
                    <span>{timelineRange.end}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
