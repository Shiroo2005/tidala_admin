import { REPORT_REASONS as TEACHER_REASONS } from "@/features/admin/user-management/constants/report-reasons";

export const POST_REPORT_REASONS = [
  {
    id: "spam",
    label: "Thư rác / Quảng cáo",
    description: "Bài viết này là quảng cáo hoặc thư rác",
    color: { bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb" },
  },
  {
    id: "misinformation",
    label: "Thông tin sai lệch",
    description: "Bài viết chứa thông tin không chính xác",
    color: { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  },
  {
    id: "offensive",
    label: "Nội dung phản cảm",
    description: "Chứa từ ngữ hoặc hình ảnh không phù hợp",
    color: { bg: "#fefce8", text: "#ca8a04", border: "#fef08a" },
  },
  {
    id: "dangerous",
    label: "Nội dung nguy hiểm",
    description: "Khuyến khích hành vi nguy hiểm hoặc bất hợp pháp",
    color: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  },
  {
    id: "other",
    label: "Khác",
    description: "Vấn đề khác không nằm trong các mục trên",
    color: { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
  },
] as const;

export const REVIEW_REPORT_REASONS = [
  {
    id: "spam",
    label: "Thư rác / Quảng cáo",
    description: "Bình luận này là quảng cáo hoặc thư rác",
    color: { bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb" },
  },
  {
    id: "offensive",
    label: "Nội dung xúc phạm",
    description: "Chứa từ ngữ không lịch sự hoặc xúc phạm",
    color: { bg: "#fefce8", text: "#ca8a04", border: "#fef08a" },
  },
  {
    id: "misinformation",
    label: "Thông tin sai lệch",
    description: "Bình luận chứa thông tin không chính xác",
    color: { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  },
  {
    id: "dangerous",
    label: "Nội dung nguy hiểm",
    description: "Khuyến khích hành vi nguy hiểm hoặc bất hợp pháp",
    color: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  },
  {
    id: "irrelevant",
    label: "Không liên quan",
    description: "Bình luận không liên quan đến chủ đề",
    color: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  },
  {
    id: "other",
    label: "Khác",
    description: "Vấn đề khác không nằm trong các mục trên",
    color: { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
  },
] as const;

export { TEACHER_REASONS as TEACHER_REPORT_REASONS };

export type ReportReasonId = string;

export const getReportReasonByIdAndType = (id: string, targetType: string) => {
  if (targetType === "TEACHER") {
    return TEACHER_REASONS.find((r) => r.id === id);
  }
  if (targetType === "POST") {
    return POST_REPORT_REASONS.find((r) => r.id === id);
  }
  if (targetType === "REVIEW") {
    return REVIEW_REPORT_REASONS.find((r) => r.id === id);
  }
  return TEACHER_REASONS.find((r) => r.id === id);
};

export const getReportReasonsByType = (targetType: "teacher" | "post" | "review") => {
  if (targetType === "teacher") return TEACHER_REASONS;
  if (targetType === "post") return POST_REPORT_REASONS;
  if (targetType === "review") return REVIEW_REPORT_REASONS;
  return TEACHER_REASONS;
};
