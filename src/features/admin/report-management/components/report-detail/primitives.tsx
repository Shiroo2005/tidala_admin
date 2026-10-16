import type { ReactNode } from "react";
import { FiShield } from "react-icons/fi";
import { actionVariantClasses, STATUS_MAP } from "./constants";
import type { ReportData } from "../../types/report.type";
import type { ActionVariant } from "./types";
import type {
  ModerationSuggestion,
  ReportedUserInfo,
} from "../../utils/report-history";

export const SectionLabel = ({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-slate-400">{icon}</span>
    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
      {children}
    </span>
  </div>
);

export const InfoPill = ({
  icon,
  children,
  onClick,
  title,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  title?: string;
}) => {
  const className = `inline-flex min-w-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-all duration-200 ${
    onClick
      ? "cursor-pointer hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700 active:scale-[0.98]"
      : ""
  }`;
  const content = (
    <>
      <span className="shrink-0 text-slate-400">{icon}</span>
      <span className="truncate">{children}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} title={title} className={className}>
        {content}
      </button>
    );
  }

  return (
    <span title={title} className={className}>
      {content}
    </span>
  );
};

export const RatingStars = ({ rating }: { rating: number }) => {
  const activeStars = Math.max(0, Math.min(5, Math.round(rating || 0)));

  return (
    <span
      className="inline-flex items-center gap-0.5 text-sm font-bold text-amber-500"
      aria-label={`${activeStars}/5 sao`}
    >
      {Array.from({ length: activeStars }, (_, index) => (
        <span key={index}>★</span>
      ))}
    </span>
  );
};

export const ActionButton = ({
  icon,
  children,
  description,
  iconClassName = "",
  variant = "neutral",
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  iconClassName?: string;
  variant?: ActionVariant;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex min-h-10 w-full items-start justify-start gap-2.5 rounded-lg border px-3 py-2 text-left shadow-3xs transition-all active:scale-[0.99] ${actionVariantClasses[variant]}`}
  >
    <span className={`mt-0.5 shrink-0 opacity-80 ${iconClassName}`}>
      {icon}
    </span>
    <span className="min-w-0">
      <span className="block truncate text-sm font-semibold">{children}</span>
      {description && (
        <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
          {description}
        </span>
      )}
    </span>
  </button>
);

export const SuggestionPanel = ({
  suggestion,
}: {
  suggestion: ModerationSuggestion;
  reportedUser: ReportedUserInfo | null;
}) => {
  const isWarning = suggestion.action === "warning";
  const isBan = suggestion.action === "ban";
  const toneClass = isWarning
    ? "border-amber-200 bg-amber-50/70 text-amber-800"
    : isBan
      ? "border-red-200 bg-red-50/70 text-red-800"
      : "border-orange-200 bg-orange-50/70 text-orange-800";

  return (
    <div className={`rounded-xl border p-3.5 ${toneClass}`}>
      <div className="flex items-start gap-2.5">
        <FiShield size={16} className="mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-extrabold">
            Gợi ý lần {suggestion.step}: {suggestion.label}
          </p>
          <p className="mt-1 text-xs font-semibold leading-relaxed opacity-90">
            {suggestion.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const HistoryStatusBadge = ({
  status,
}: {
  status: ReportData["status"];
}) => {
  const statusInfo =
    STATUS_MAP[status as keyof typeof STATUS_MAP] || STATUS_MAP.PENDING;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusInfo.className}`}
    >
      <span className={`h-1 w-1 rounded-full ${statusInfo.dotClass}`} />
      {statusInfo.label}
    </span>
  );
};

export const ReportDetailTabButton = ({
  active,
  icon,
  children,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold transition-colors sm:flex-none ${
      active
        ? "bg-white text-slate-950 shadow-xs ring-1 ring-slate-200"
        : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span className="max-w-45 truncate sm:max-w-65 lg:max-w-85">
      {children}
    </span>
  </button>
);
