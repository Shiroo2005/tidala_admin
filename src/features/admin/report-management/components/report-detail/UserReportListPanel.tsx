import type { ReactNode } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getReportReasonByIdAndType } from "../../constants/report-reasons";
import type { ReportData } from "../../types/report.type";
import { RELATED_REPORTS_PAGE_SIZE, TARGET_TYPE_LABELS } from "./constants";
import { HistoryStatusBadge, SectionLabel } from "./primitives";
import { formatDate } from "./utils";

interface UserReportListPanelProps {
  title: string;
  icon: ReactNode;
  reports: ReportData[];
  page: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  hasTargetUser: boolean;
  emptyMessage: string;
  missingUserMessage: string;
  errorMessage: string;
  onPageChange: (page: number) => void;
}

export const UserReportListPanel = ({
  title,
  icon,
  reports,
  page,
  totalPages,
  totalCount,
  isLoading,
  isError,
  hasTargetUser,
  emptyMessage,
  missingUserMessage,
  errorMessage,
  onPageChange,
}: UserReportListPanelProps) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
    <div className="flex items-center justify-between gap-3">
      <SectionLabel icon={icon}>{title}</SectionLabel>
      {totalCount > 0 && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
          {totalCount} báo cáo
        </span>
      )}
    </div>

    <div className="mt-3">
      {!hasTargetUser ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold leading-relaxed text-slate-500">
          {missingUserMessage}
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: RELATED_REPORTS_PAGE_SIZE }, (_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-xs font-semibold leading-relaxed text-red-600">
          {errorMessage}
        </div>
      ) : reports.length === 0 ? (
        <p className="px-1 py-2 text-xs font-medium italic leading-relaxed text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-2">
          {reports.map((historyReport) => {
            const reasonInfo = getReportReasonByIdAndType(
              historyReport.reason,
              historyReport.targetType,
            );

            return (
              <div
                key={historyReport.id}
                className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-extrabold text-slate-800">
                      {reasonInfo?.label || historyReport.reason}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                      {TARGET_TYPE_LABELS[historyReport.targetType]} ·{" "}
                      {formatDate(
                        historyReport.resolvedAt ||
                          historyReport.updatedAt ||
                          historyReport.createdAt,
                      )}
                    </p>
                  </div>
                  <HistoryStatusBadge status={historyReport.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {totalPages > 1 && (
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Trang lịch sử trước"
        >
          <FiChevronLeft size={15} />
        </button>
        <span className="text-xs font-bold text-slate-500">
          {page}/{totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Trang lịch sử sau"
        >
          <FiChevronRight size={15} />
        </button>
      </div>
    )}
  </section>
);
