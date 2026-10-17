import { APP_PATHS } from "@/shared/constants/appPaths";
import { imageUrls } from "@/shared/constants/imageUrls";
import { getStorageUrl } from "@/shared/utils/url";
import { Dialog } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiClock, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { getReportReasonByIdAndType } from "../../constants/report-reasons";
import { useGetAdminReportDetail } from "../../hooks/useGetAdminReportDetail";
import { useGetUserReportsReceived } from "../../hooks/useGetUserReportsReceived";
import type {
  CommentTarget,
  PostTarget,
  ReviewTarget,
  TeacherTarget,
} from "../../types/report.type";
import {
  getModerationSuggestion,
  getReportedUserInfo,
  sortReportsByLatestActivity,
} from "../../utils/report-history";
import { ActionPanel, IgnoreReportButton } from "./ActionPanel";
import {
  DETAIL_TABS,
  RELATED_REPORTS_PAGE_SIZE,
  STATUS_MAP,
} from "./constants";
import { LoadingReportDetailDialog } from "./LoadingReportDetailDialog";
import { OverviewPanel } from "./OverviewPanel";
import { ReportDetailTabButton, SuggestionPanel } from "./primitives";
import type {
  DetailTab,
  ReportDetailModalProps,
  ReportDetailReturnState,
} from "./types";
import { UserReportListPanel } from "./UserReportListPanel";
import {
  formatDate,
  getLocationStateRecord,
  getReportReturnTab,
} from "./utils";

export type { ReportDetailReturnState } from "./types";

export const ReportDetailModal = ({
  report: selectedReport,
  open,
  onClose,
  onIgnore,
  onWarn,
  onBan,
  onHide,
}: ReportDetailModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: report,
    isLoading,
    isError,
    refetch,
  } = useGetAdminReportDetail(selectedReport?.id, open);
  const [historyPager, setHistoryPager] = useState({ key: "", page: 1 });
  const [activeReportsPager, setActiveReportsPager] = useState({
    key: "",
    page: 1,
  });
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("overview");
  const reportedUser = getReportedUserInfo(report || selectedReport);
  const {
    data: userReportsReceived = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetUserReportsReceived(
    reportedUser?.id,
    open && Boolean(reportedUser?.id),
  );
  const relatedReports = useMemo(() => {
    const currentReportId = report?.id || selectedReport?.id;

    return sortReportsByLatestActivity(
      userReportsReceived.filter(
        (historyReport) => historyReport.id !== currentReportId,
      ),
    );
  }, [report?.id, selectedReport?.id, userReportsReceived]);
  const activeRelatedReports = useMemo(
    () =>
      relatedReports.filter(
        (relatedReport) =>
          relatedReport.status === "PENDING" ||
          relatedReport.status === "REVIEWING",
      ),
    [relatedReports],
  );
  const previousReports = useMemo(
    () =>
      relatedReports.filter(
        (relatedReport) =>
          relatedReport.status !== "PENDING" &&
          relatedReport.status !== "REVIEWING",
      ),
    [relatedReports],
  );
  const moderationSuggestion = useMemo(
    () => getModerationSuggestion(previousReports),
    [previousReports],
  );
  const activeReportsTotalPages = Math.max(
    1,
    Math.ceil(activeRelatedReports.length / RELATED_REPORTS_PAGE_SIZE),
  );
  const historyTotalPages = Math.max(
    1,
    Math.ceil(previousReports.length / RELATED_REPORTS_PAGE_SIZE),
  );
  const historyKey = `${report?.id || selectedReport?.id || ""}:${
    reportedUser?.id || ""
  }`;
  const activeReportsKey = `active:${historyKey}`;
  const activeReportsPage = Math.min(
    activeReportsPager.key === activeReportsKey ? activeReportsPager.page : 1,
    activeReportsTotalPages,
  );
  const historyPage = Math.min(
    historyPager.key === historyKey ? historyPager.page : 1,
    historyTotalPages,
  );
  const visibleActiveReports = activeRelatedReports.slice(
    (activeReportsPage - 1) * RELATED_REPORTS_PAGE_SIZE,
    activeReportsPage * RELATED_REPORTS_PAGE_SIZE,
  );
  const visibleHistoryReports = previousReports.slice(
    (historyPage - 1) * RELATED_REPORTS_PAGE_SIZE,
    historyPage * RELATED_REPORTS_PAGE_SIZE,
  );

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveDetailTab("overview");
  }, [open, selectedReport?.id]);

  if (!selectedReport) return null;

  if (isLoading || isError || !report) {
    return (
      <LoadingReportDetailDialog
        open={open}
        isError={isError}
        onClose={onClose}
        onRetry={() => void refetch()}
      />
    );
  }

  const navigateToTargetDetail = (targetPath: string) => {
    const currentState = getLocationStateRecord(location.state);
    const nextState = {
      ...currentState,
      reportDetailReturn: {
        report,
        tab: getReportReturnTab(report.targetType),
      },
    } satisfies ReportDetailReturnState;

    onClose();

    const currentUrl = `${location.pathname}${location.search}${location.hash}`;
    const browserHistoryState = window.history.state;

    window.history.replaceState(
      browserHistoryState && typeof browserHistoryState === "object"
        ? { ...browserHistoryState, usr: nextState }
        : { usr: nextState },
      "",
      currentUrl,
    );
    navigate(targetPath);
  };

  const reasonInfo = getReportReasonByIdAndType(
    report.reason as string,
    report.targetType,
  );
  const statusInfo =
    STATUS_MAP[report.status as keyof typeof STATUS_MAP] || STATUS_MAP.PENDING;
  const reporterAvatar =
    getStorageUrl(report.reporterAvatarUrl) || imageUrls.fallback.avatar;

  const isTeacherReport = report.targetType === "TEACHER";
  const isPostReport = report.targetType === "POST";
  const hasTarget = Boolean(report.target);
  const teacherTarget =
    isTeacherReport && report.target ? (report.target as TeacherTarget) : null;
  const reviewTarget =
    report.targetType === "REVIEW" && report.target
      ? (report.target as ReviewTarget)
      : null;
  const postTarget =
    report.targetType === "POST" && report.target
      ? (report.target as PostTarget)
      : null;
  const commentTarget =
    report.targetType === "COMMENT" && report.target
      ? (report.target as CommentTarget)
      : null;
  const actionTargetName =
    teacherTarget?.fullName ||
    reviewTarget?.authorName ||
    postTarget?.authorName ||
    commentTarget?.authorName;

  const actionSubject =
    report.targetType === "TEACHER"
      ? "giáo viên"
      : report.targetType === "REVIEW"
        ? "người dùng"
        : "người dùng";
  const isReportLocked =
    report.status === "RESOLVED" || report.status === "REJECTED";
  const canHideTarget = hasTarget && !isTeacherReport && !isReportLocked;
  const canWarnTarget = hasTarget && !isReportLocked;
  const canBanTarget = hasTarget && !isReportLocked;
  const canIgnoreReport = !isReportLocked;
  const hasAvailableActions =
    canHideTarget || canWarnTarget || canBanTarget || canIgnoreReport;
  const canShowSuggestion =
    Boolean(reportedUser?.id) &&
    !isReportLocked &&
    !isHistoryLoading &&
    !isHistoryError;
  const suggestedBanDuration =
    canShowSuggestion &&
    (moderationSuggestion.action === "suspend" ||
      moderationSuggestion.action === "ban")
      ? moderationSuggestion.duration
      : null;
  const userReportsTabLabel = reportedUser?.name
    ? `Báo cáo người dùng ${reportedUser.name}`
    : "Báo cáo người dùng";
  const userReportsCount =
    activeRelatedReports.length + previousReports.length;
  const renderActionPanel = () => (
    <ActionPanel
      report={report}
      isPostReport={isPostReport}
      canHideTarget={canHideTarget}
      canWarnTarget={canWarnTarget}
      canBanTarget={canBanTarget}
      hasAvailableActions={hasAvailableActions}
      actionTargetName={actionTargetName}
      actionSubject={actionSubject}
      suggestedBanDuration={suggestedBanDuration}
      moderationSuggestion={moderationSuggestion}
      onClose={onClose}
      onHide={onHide}
      onWarn={onWarn}
      onBan={onBan}
    />
  );
  const renderIgnoreActionPanel = () =>
    canIgnoreReport ? (
      <IgnoreReportButton
        report={report}
        onClose={onClose}
        onIgnore={onIgnore}
      />
    ) : null;
  const reportsPanel = (
    <div className="grid gap-4 xl:grid-cols-2">
      <UserReportListPanel
        title="Chưa xử lý"
        icon={<FiActivity size={14} />}
        reports={visibleActiveReports}
        page={activeReportsPage}
        totalPages={activeReportsTotalPages}
        totalCount={activeRelatedReports.length}
        isLoading={isHistoryLoading}
        isError={isHistoryError}
        hasTargetUser={Boolean(reportedUser?.id)}
        emptyMessage="Hiện đang không có báo cáo khác"
        missingUserMessage="Chưa xác định được người dùng bị báo cáo để lấy danh sách chưa xử lý."
        errorMessage="Không thể tải danh sách báo cáo chưa xử lý của người dùng này."
        onPageChange={(page) =>
          setActiveReportsPager({ key: activeReportsKey, page })
        }
      />

      <UserReportListPanel
        title="Đã xử lý"
        icon={<FiClock size={14} />}
        reports={visibleHistoryReports}
        page={historyPage}
        totalPages={historyTotalPages}
        totalCount={previousReports.length}
        isLoading={isHistoryLoading}
        isError={isHistoryError}
        hasTargetUser={Boolean(reportedUser?.id)}
        emptyMessage="Chưa có lịch sử báo cáo"
        missingUserMessage="Chưa xác định được người dùng bị báo cáo để lấy lịch sử."
        errorMessage="Không thể tải lịch sử báo cáo của người dùng này."
        onPageChange={(page) => setHistoryPager({ key: historyKey, page })}
      />
    </div>
  );
  const overviewPanel = (
    <OverviewPanel
      report={report}
      reporterAvatar={reporterAvatar}
      reasonLabel={reasonInfo?.label || report.reason}
      reasonDescription={reasonInfo?.description}
      onViewTeacherDetail={(target) => {
        navigateToTargetDetail(APP_PATHS.ADMIN_TEACHER_DETAIL_WITH_ID(target.id));
      }}
      onViewPostDetail={(target) => {
        navigateToTargetDetail(APP_PATHS.ADMIN_POST_DETAIL_WITH_ID(target.id));
      }}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: "18px",
          overflow: "hidden",
          width: "min(1180px, calc(100vw - 32px))",
          maxHeight: "92vh",
        },
      }}
    >
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-950">
                Chi tiết báo cáo
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusInfo.className}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`}
                />
                {statusInfo.label}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2 sm:px-5">
          <div className="flex gap-2 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {DETAIL_TABS.map((tab) => (
              <ReportDetailTabButton
                key={tab.key}
                active={activeDetailTab === tab.key}
                icon={tab.icon}
                onClick={() => setActiveDetailTab(tab.key)}
              >
                {tab.key === "reports"
                  ? `${userReportsTabLabel} (${userReportsCount})`
                  : tab.label}
              </ReportDetailTabButton>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-y-auto bg-slate-50 px-5 py-5 sm:px-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0">
            {activeDetailTab === "overview" && (
              <div className="space-y-4">
                {overviewPanel}
                <div className="space-y-3 xl:hidden">
                  {canShowSuggestion && (
                    <SuggestionPanel
                      suggestion={moderationSuggestion}
                      reportedUser={reportedUser}
                    />
                  )}
                  {renderActionPanel()}
                  {renderIgnoreActionPanel()}
                </div>
              </div>
            )}
            {activeDetailTab === "reports" && reportsPanel}
          </main>

          <aside className="hidden space-y-3 xl:block">
            {canShowSuggestion && (
              <SuggestionPanel
                suggestion={moderationSuggestion}
                reportedUser={reportedUser}
              />
            )}
            {renderActionPanel()}
            {renderIgnoreActionPanel()}
          </aside>
        </div>
      </div>
    </Dialog>
  );
};
