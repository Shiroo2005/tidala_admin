import { imageUrls } from "@/shared/constants/imageUrls";
import { getStorageUrl } from "@/shared/utils/url";
import { Pagination } from "@mui/material";
import { FiClock, FiEye } from "react-icons/fi";
import { getReportReasonByIdAndType } from "../constants/report-reasons";
import type { ReportData } from "../types/report.type";

interface ReviewReportCardProps {
  reports: ReportData[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (report: ReportData) => void;
}

const STATUS_MAP = {
  PENDING: {
    label: "Chờ xử lý",
    dotClass: "bg-amber-400",
    textClass: "text-amber-600",
  },
  REVIEWING: {
    label: "Đang xem xét",
    dotClass: "bg-blue-400",
    textClass: "text-blue-600",
  },
  RESOLVED: {
    label: "Đã xử lý",
    dotClass: "bg-emerald-400",
    textClass: "text-emerald-600",
  },
  REJECTED: {
    label: "Đã bỏ qua",
    dotClass: "bg-slate-400",
    textClass: "text-slate-500",
  },
} as const;

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const ReviewReportCard = ({
  reports,
  page,
  totalPages,
  onPageChange,
  onViewDetail,
}: ReviewReportCardProps) => {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200/80">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-sm font-medium text-slate-600">
          Không có báo cáo nào
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Chưa có báo cáo phù hợp với bộ lọc hiện tại
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((report) => {
          const reasonInfo = getReportReasonByIdAndType(
            report.reason as string,
            report.targetType,
          );
          const statusInfo =
            STATUS_MAP[report.status as keyof typeof STATUS_MAP] ||
            STATUS_MAP.PENDING;
          const reporterAvatar =
            getStorageUrl(report.reporterAvatarUrl) || imageUrls.fallback.avatar;

          const target =
            report.target?.type === "REVIEW" ? report.target : null;
          const reviewer = target?.author;
          const reviewerName =
            reviewer?.fullName || target?.authorName || "Người dùng";

          return (
            <div
              key={report.id}
              className="group bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all duration-300 cursor-pointer flex flex-col h-full"
              onClick={() => onViewDetail(report)}
            >
              {/* Reported Review — prominent section */}
              <div className="flex items-start gap-3.5">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <h3
                        className="text-sm font-bold text-slate-900 truncate"
                        title={target?.content || reviewerName || report.targetId}
                      >
                        {target ? (
                          <>
                            Bình luận của{" "}
                            <span className="text-indigo-500 font-semibold">
                              {reviewerName}
                            </span>
                          </>
                        ) : report.targetId
                            ? `ID: ${report.targetId.substring(0, 8)}...`
                            : "Không rõ đối tượng"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                      />
                      <span
                        className={`text-[11px] font-medium ${statusInfo.textClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Reason Text */}
                  {reasonInfo && (
                    <div className="text-[11px] font-semibold text-slate-500 mt-2">
                      Lý do:{" "}
                      <span className="text-slate-700 font-bold">
                        {reasonInfo.label}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {report.description ||
                      reasonInfo?.description ||
                      "Không có mô tả"}
                  </p>

                  {/* Reporter info */}
                  <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100/80">
                    <span className="text-[10px] text-slate-400 font-medium mr-0.5">
                      Báo cáo bởi:
                    </span>
                    <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-100 shrink-0 opacity-80">
                      <img
                        src={reporterAvatar}
                        alt={report.reporterName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 truncate">
                      {report.reporterName}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <FiClock size={11} className="text-slate-300" />
                    <span className="text-[11px] text-slate-300">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onViewDetail(report)}
                  className="flex-1 min-w-25 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200/60 transition-colors hover:bg-blue-100 active:bg-blue-200"
                >
                  <FiEye size={13} />
                  Chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
};
