import { FiAlertTriangle, FiMail, FiMessageSquare, FiShield, FiUser } from "react-icons/fi";
import type {
  PostTarget,
  ReportData,
  TeacherTarget,
} from "../../types/report.type";
import { TARGET_TYPE_LABELS } from "./constants";
import { SectionLabel } from "./primitives";
import { ReportTargetContent } from "./TargetViews";

interface OverviewPanelProps {
  report: ReportData;
  reporterAvatar: string;
  reasonLabel: string;
  reasonDescription?: string;
  onViewTeacherDetail: (target: TeacherTarget) => void;
  onViewPostDetail: (target: PostTarget) => void;
}

export const OverviewPanel = ({
  report,
  reporterAvatar,
  reasonLabel,
  reasonDescription,
  onViewTeacherDetail,
  onViewPostDetail,
}: OverviewPanelProps) => (
  <div className="space-y-5">
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel icon={<FiAlertTriangle size={14} />}>
          Đối tượng bị báo cáo
        </SectionLabel>
        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600">
          {TARGET_TYPE_LABELS[report.targetType]}
        </span>
      </div>
      <ReportTargetContent report={report} onViewTeacherDetail={onViewTeacherDetail} onViewPostDetail={onViewPostDetail} />
    </section>

    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <SectionLabel icon={<FiUser size={14} />}>Người báo cáo</SectionLabel>
        <div className="mt-3 flex items-center gap-3">
          <img
            src={reporterAvatar}
            alt={report.reporterName}
            className="h-11 w-11 rounded-full border border-slate-200 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">
              {report.reporterName}
            </p>
            <p className="mt-0.5 flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-slate-500">
              <FiMail size={12} className="shrink-0 text-slate-400" />
              <span className="truncate">{report.reporterEmail}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <SectionLabel icon={<FiShield size={14} />}>Lý do báo cáo</SectionLabel>
        <div className="mt-3">
          <p className="text-sm font-bold text-slate-800">{reasonLabel}</p>
        </div>
      </div>
    </section>

    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <SectionLabel icon={<FiMessageSquare size={14} />}>
        Mô tả từ người báo cáo
      </SectionLabel>
      <div className="mt-3 rounded-lg bg-slate-50/70 p-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {report.description || reasonDescription || "Không có mô tả chi tiết"}
        </p>
      </div>
    </section>
  </div>
);
