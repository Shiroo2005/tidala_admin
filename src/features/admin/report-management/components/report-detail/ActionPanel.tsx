import {
  FiAlertTriangle,
  FiEyeOff,
  FiShield,
  FiSlash,
  FiX,
} from "react-icons/fi";
import type {
  BanDuration,
  ReportActionData,
  ReportData,
} from "../../types/report.type";
import type { ModerationSuggestion } from "../../utils/report-history";
import { ActionButton, SectionLabel } from "./primitives";
import { ResolutionHistoryPanel } from "./ResolutionHistoryPanel";
import { runAndClose } from "./utils";

interface ActionPanelProps {
  report: ReportData;
  isPostReport: boolean;
  canHideTarget: boolean;
  canWarnTarget: boolean;
  canBanTarget: boolean;
  hasAvailableActions: boolean;
  actionTargetName?: string | null;
  actionSubject: string;
  suggestedBanDuration?: BanDuration | null;
  moderationSuggestion: ModerationSuggestion;
  onClose: () => void;
  onHide: (report: ReportData) => void;
  onWarn: (report: ReportData) => void;
  onBan: (report: ReportData, suggestedDuration?: BanDuration | null) => void;
}

export const ActionPanel = ({
  report,
  isPostReport,
  canHideTarget,
  canWarnTarget,
  canBanTarget,
  hasAvailableActions,
  actionTargetName,
  actionSubject,
  suggestedBanDuration,
  moderationSuggestion,
  onClose,
  onHide,
  onWarn,
  onBan,
}: ActionPanelProps) => (
  !hasAvailableActions ? (
    (report as ReportData & { history?: ReportActionData[] }).history
      ?.length ? (
      <ResolutionHistoryPanel
        history={
          (report as ReportData & { history: ReportActionData[] }).history
        }
      />
    ) : (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <SectionLabel icon={<FiShield size={14} />}>
          Hình thức xử lý
        </SectionLabel>
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold leading-relaxed text-slate-500">
          Chưa có dữ liệu hình thức xử lý.
        </div>
      </div>
    )
  ) : (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <SectionLabel icon={<FiShield size={14} />}>Xử lý đối tượng</SectionLabel>

      <div className="mt-3 space-y-2.5">
        {canHideTarget && (
          <ActionButton
            icon={<FiEyeOff size={15} />}
            iconClassName="text-red-500"
            variant="neutral"
            onClick={() => runAndClose(() => onHide(report), onClose)}
          >
            {isPostReport
              ? "Ẩn bài viết"
              : report.targetType === "COMMENT"
                ? "Ẩn bình luận"
                : "Ẩn đánh giá"}
          </ActionButton>
        )}

        {canWarnTarget && (
          <ActionButton
            icon={<FiAlertTriangle size={15} />}
            iconClassName="text-amber-500"
            variant="warning"
            description={actionTargetName}
            onClick={() => runAndClose(() => onWarn(report), onClose)}
          >
            Cảnh báo {actionSubject}
          </ActionButton>
        )}

        {canBanTarget && (
          <ActionButton
            icon={<FiSlash size={15} />}
            iconClassName="text-red-500"
            variant="danger"
            description={
              suggestedBanDuration
                ? `Gợi ý: ${moderationSuggestion.label}`
                : actionTargetName
            }
            onClick={() =>
              runAndClose(() => onBan(report, suggestedBanDuration), onClose)
            }
          >
            Chặn {actionSubject}
          </ActionButton>
        )}
      </div>
    </div>
  )
);

export const IgnoreReportButton = ({
  report,
  onClose,
  onIgnore,
}: {
  report: ReportData;
  onClose: () => void;
  onIgnore: (report: ReportData) => void;
}) => (
  <ActionButton
    icon={<FiX size={15} />}
    iconClassName="text-slate-400"
    variant="ghost"
    onClick={() => runAndClose(() => onIgnore(report), onClose)}
  >
    Bỏ qua báo cáo
  </ActionButton>
);
