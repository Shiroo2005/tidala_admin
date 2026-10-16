import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import {
  ReportDetailModal,
  type ReportDetailReturnState,
} from "./report-detail";
import { ReportTabs, type ReportTabType } from "./ReportTabs";
import type { ViewMode } from "./ReportToolbar";
import { ReportListSection } from "./ReportListSection";
import { ReportActionConfirmDialog } from "./ReportActionConfirmDialog";
import { ReportBanDialog } from "./ReportBanDialog";
import { useReportFilters } from "../hooks/useReportFilters";
import { useReportActionDialogs } from "../hooks/useReportActionDialogs";
import { useResolveReport } from "../hooks/useResolveReport";
import type { ReportData } from "../types/report.type";

const getReportWithReviewingStatus = (report: ReportData) => {
  if (report.status !== "PENDING") return report;

  return {
    ...report,
    status: "REVIEWING",
  };
};

export const ReportManagement = ({ initialTab = "teacher" }: { initialTab?: ReportTabType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState =
    location.state && typeof location.state === "object"
      ? (location.state as ReportDetailReturnState & Record<string, unknown>)
      : null;
  const reportDetailReturn = locationState?.reportDetailReturn;
  const [activeTab, setActiveTab] = useState<ReportTabType>(
    reportDetailReturn?.tab ?? initialTab,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const initialSelectedReport = reportDetailReturn?.report
    ? getReportWithReviewingStatus(reportDetailReturn.report)
    : null;
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(
    initialSelectedReport,
  );
  const [detailOpen, setDetailOpen] = useState(Boolean(reportDetailReturn));
  const [detailReportToRestore, setDetailReportToRestore] =
    useState<ReportData | null>(null);
  const { mutateAsync: markReportReviewing } = useResolveReport();

  const {
    searchQuery,
    setSearchQuery,
    reasonFilter,
    setReasonFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    filteredReports,
    totalCount,
    totalPages,
    isLoading,
  } = useReportFilters(
    activeTab === "post"
      ? "post"
      : activeTab === "review"
        ? "review"
        : "teacher",
  );

  const reopenDetailAfterDismiss = () => {
    if (!detailReportToRestore) return;

    setSelectedReport(detailReportToRestore);
    setDetailOpen(true);
    setDetailReportToRestore(null);
  };

  const {
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
  } = useReportActionDialogs({
    onDismissFromDetail: reopenDetailAfterDismiss,
    onActionComplete: () => setDetailReportToRestore(null),
  });

  const syncReportReviewingStatus = useCallback((report: ReportData) => {
    if (report.status !== "PENDING") return report;

    void markReportReviewing({
      reportId: report.id,
      payload: {
        status: "REVIEWING",
        reason: "Đang xem xét báo cáo",
      },
    }).catch(() => {
      setSelectedReport((currentReport) =>
        currentReport?.id === report.id ? report : currentReport,
      );
    });

    return getReportWithReviewingStatus(report);
  }, [markReportReviewing]);

  useEffect(() => {
    const report = reportDetailReturn?.report;
    if (!report || report.status !== "PENDING") return;

    void markReportReviewing({
      reportId: report.id,
      payload: {
        status: "REVIEWING",
        reason: "Đang xem xét báo cáo",
      },
    }).catch(() => {
      setSelectedReport((currentReport) =>
        currentReport?.id === report.id ? report : currentReport,
      );
    });
  }, [
    markReportReviewing,
    reportDetailReturn?.report,
  ]);

  const handleViewDetail = (report: ReportData) => {
    const nextReport = syncReportReviewingStatus(report);
    setSelectedReport(nextReport);
    setDetailOpen(true);
  };

  useEffect(() => {
    if (!reportDetailReturn) return;

    const nextState = { ...(locationState || {}) };
    delete nextState.reportDetailReturn;

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: Object.keys(nextState).length ? nextState : null,
    });
  }, [
    location.hash,
    location.pathname,
    location.search,
    locationState,
    navigate,
    reportDetailReturn,
  ]);

  const handleDetailAction = (
    report: ReportData,
    action: (report: ReportData) => void,
  ) => {
    setDetailReportToRestore(report);
    action(report);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="-mb-2">
        <AdminBreadcrumbs />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý báo cáo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem và xử lý các báo cáo từ người dùng
          </p>
        </div>
        <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <ReportListSection
        activeTab={activeTab}
        viewMode={viewMode}
        searchQuery={searchQuery}
        reasonFilter={reasonFilter}
        statusFilter={statusFilter}
        page={page}
        reports={filteredReports}
        totalCount={totalCount}
        totalPages={totalPages}
        isLoading={isLoading}
        onSearchChange={setSearchQuery}
        onReasonFilterChange={setReasonFilter}
        onStatusFilterChange={setStatusFilter}
        onViewModeChange={setViewMode}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
        onIgnore={handleIgnore}
        onWarn={handleWarn}
        onBan={handleBan}
        onHide={handleHide}
      />

      <ReportDetailModal
        report={selectedReport}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onIgnore={(report) => handleDetailAction(report, handleIgnore)}
        onWarn={(report) => handleDetailAction(report, handleWarn)}
        onBan={(report, suggestedDuration) => {
          setDetailReportToRestore(report);
          handleBan(report, suggestedDuration);
        }}
        onHide={(report) => handleDetailAction(report, handleHide)}
      />

      <ReportActionConfirmDialog
        dialog={confirmDialog}
        onDismiss={() => closeConfirmDialog(true)}
        onConfirmComplete={() => closeConfirmDialog()}
      />

      <ReportBanDialog
        open={banDialog.open}
        report={banDialog.report}
        selectedDuration={selectedDuration}
        suggestedDuration={banDialog.suggestedDuration}
        onDurationChange={setSelectedDuration}
        onDismiss={() => closeBanDialog(true)}
        onConfirm={confirmBan}
      />
    </div>
  );
};

export default ReportManagement;
