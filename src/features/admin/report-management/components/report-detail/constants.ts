import type { ActionVariant, TargetType } from "./types";

export const TARGET_TYPE_LABELS: Record<TargetType, string> = {
  TEACHER: "Giáo viên",
  REVIEW: "Đánh giá",
  POST: "Bài viết",
  COMMENT: "Bình luận",
};

export const STATUS_MAP = {
  PENDING: {
    label: "Chờ xử lý",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-400",
  },
  REVIEWING: {
    label: "Đang xem xét",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-400",
  },
  RESOLVED: {
    label: "Đã xử lý",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-400",
  },
  REJECTED: {
    label: "Đã bỏ qua",
    className: "bg-slate-50 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
} as const;

export const RELATED_REPORTS_PAGE_SIZE = 4;

export const actionVariantClasses: Record<ActionVariant, string> = {
  neutral:
    "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800",
  primary:
    "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-700",
  warning:
    "border-slate-200 bg-white text-slate-700 hover:border-amber-200 hover:bg-amber-50/60 hover:text-amber-700",
  danger:
    "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50/70 hover:text-red-700",
  ghost:
    "border-slate-200 bg-slate-50/70 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
};

export { DETAIL_TABS } from "./detail-tabs";
