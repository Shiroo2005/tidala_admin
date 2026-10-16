import type { ReportDetailModalProps, ReportReturnTab, TargetType } from "./types";

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const runAndClose = (
  callback: () => void,
  onClose: ReportDetailModalProps["onClose"],
) => {
  callback();
  onClose();
};

export const getReportReturnTab = (targetType: TargetType): ReportReturnTab => {
  if (targetType === "POST") return "post";
  if (targetType === "REVIEW") return "review";
  if (targetType === "COMMENT") return "post";
  return "teacher";
};

export const getLocationStateRecord = (state: unknown): Record<string, unknown> => {
  return state && typeof state === "object"
    ? (state as Record<string, unknown>)
    : {};
};
