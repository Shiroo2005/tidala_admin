export const REPORT_REASONS = [
  {
    id: "fake",
    label: "Thông tin giả mạo",
    description: "Giáo viên sử dụng thông tin không chính xác hoặc mạo danh.",
    color: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  },
  {
    id: "scam",
    label: "Lừa đảo / gian lận",
    description: "Có dấu hiệu yêu cầu chuyển tiền bất thường hoặc lừa đảo.",
    color: { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa" },
  },
  {
    id: "inappropriate",
    label: "Hành vi không phù hợp",
    description: "Có hành vi thiếu chuyên nghiệp hoặc gây khó chịu.",
    color: { bg: "#fefce8", text: "#ca8a04", border: "#fef08a" },
  },
  {
    id: "price",
    label: "Giá không đúng mô tả",
    description: "Mức học phí không giống như đã công khai trên hồ sơ.",
    color: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  },
  {
    id: "other",
    label: "Khác",
    description: "Vấn đề khác không nằm trong các mục trên.",
    color: { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
  },
] as const;

export type ReportReasonId = (typeof REPORT_REASONS)[number]["id"];

export const getReportReasonById = (id: string) =>
  REPORT_REASONS.find((r) => r.id === id);
