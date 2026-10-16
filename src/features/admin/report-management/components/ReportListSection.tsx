import type { ReportReasonId } from "../constants/report-reasons";
import type { StatusFilter } from "../hooks/useReportFilters";
import type { ReportData } from "../types/report.type";
import { PostReportCard } from "./PostReportCard";
import { PostReportTable } from "./PostReportTable";
import type { ReportTabType } from "./ReportTabs";
import { ReportToolbar, type ViewMode } from "./ReportToolbar";
import { ReviewReportCard } from "./ReviewReportCard";
import { ReviewReportTable } from "./ReviewReportTable";
import { TeacherReportCard } from "./TeacherReportCard";
import { TeacherReportTable } from "./TeacherReportTable";

interface ReportListSectionProps {
  activeTab: ReportTabType;
  viewMode: ViewMode;
  searchQuery: string;
  reasonFilter: ReportReasonId | "all";
  statusFilter: StatusFilter;
  page: number;
  reports: ReportData[];
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onReasonFilterChange: (value: ReportReasonId | "all") => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onPageChange: (page: number) => void;
  onViewDetail: (report: ReportData) => void;
  onIgnore: (report: ReportData) => void;
  onWarn: (report: ReportData) => void;
  onBan: (report: ReportData) => void;
  onHide: (report: ReportData) => void;
}

const ReportListToolbar = ({
  activeTab,
  searchQuery,
  onSearchChange,
  reasonFilter,
  onReasonFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
}: Pick<
  ReportListSectionProps,
  | "activeTab"
  | "searchQuery"
  | "onSearchChange"
  | "reasonFilter"
  | "onReasonFilterChange"
  | "statusFilter"
  | "onStatusFilterChange"
  | "viewMode"
  | "onViewModeChange"
  | "totalCount"
>) => (
  <ReportToolbar
    activeTab={activeTab}
    searchQuery={searchQuery}
    onSearchChange={onSearchChange}
    reasonFilter={reasonFilter}
    onReasonFilterChange={onReasonFilterChange}
    statusFilter={statusFilter}
    onStatusFilterChange={onStatusFilterChange}
    viewMode={viewMode}
    onViewModeChange={onViewModeChange}
    totalCount={totalCount}
  />
);

export const ReportListSection = ({
  activeTab,
  viewMode,
  searchQuery,
  reasonFilter,
  statusFilter,
  page,
  reports,
  totalCount,
  totalPages,
  isLoading,
  onSearchChange,
  onReasonFilterChange,
  onStatusFilterChange,
  onViewModeChange,
  onPageChange,
  onViewDetail,
  onIgnore,
  onWarn,
  onBan,
  onHide,
}: ReportListSectionProps) => {
  return (
    <>
      <ReportListToolbar
        activeTab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        reasonFilter={reasonFilter}
        onReasonFilterChange={onReasonFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        totalCount={totalCount}
      />

      {activeTab === "teacher" &&
        (viewMode === "table" ? (
          <TeacherReportTable
            reports={reports}
            page={page}
            totalRows={totalCount}
            isLoading={isLoading}
            onPageChange={onPageChange}
            onViewDetail={onViewDetail}
            onIgnore={onIgnore}
            onWarn={onWarn}
            onBan={onBan}
          />
        ) : (
          <TeacherReportCard
            reports={reports}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onViewDetail={onViewDetail}
          />
        ))}

      {activeTab === "post" &&
        (viewMode === "table" ? (
          <PostReportTable
            reports={reports}
            page={page}
            totalRows={totalCount}
            isLoading={isLoading}
            onPageChange={onPageChange}
            onViewDetail={onViewDetail}
            onIgnore={onIgnore}
            onWarn={onWarn}
            onBan={onBan}
            onHide={onHide}
          />
        ) : (
          <PostReportCard
            reports={reports}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onViewDetail={onViewDetail}
          />
        ))}

      {activeTab === "review" &&
        (viewMode === "table" ? (
          <ReviewReportTable
            reports={reports}
            page={page}
            totalRows={totalCount}
            isLoading={isLoading}
            onPageChange={onPageChange}
            onViewDetail={onViewDetail}
            onIgnore={onIgnore}
            onWarn={onWarn}
            onBan={onBan}
            onHide={onHide}
          />
        ) : (
          <ReviewReportCard
            reports={reports}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onViewDetail={onViewDetail}
          />
        ))}
    </>
  );
};

export type { ReportTabType };
