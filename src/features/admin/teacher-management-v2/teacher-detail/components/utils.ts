import type { ExperienceYears, StudentsTrained } from "@/shared/types/common.type";

export const formatExperience = (exp: ExperienceYears | string) => {
  switch (exp) {
    case "ONE_TO_THREE":
      return "1-3 năm";
    case "THREE_TO_FIVE":
      return "3-5 năm";
    case "FIVE_TO_TEN":
      return "5-10 năm";
    case "TEN_PLUS":
      return "Trên 10 năm";
    default:
      return exp || "-";
  }
};

export const formatStudentsTrained = (val: StudentsTrained | string) => {
  switch (val) {
    case "LOWER_THAN_100":
      return "Dưới 100";
    case "FROM_100":
      return "Từ 100";
    case "FROM_300":
      return "Từ 300";
    case "FROM_500":
      return "Từ 500";
    case "FROM_1000":
      return "Trên 1000";
    default:
      return val || "-";
  }
};

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === null || amount === undefined) return "0 ₫";
  return amount.toLocaleString("vi-VN") + " ₫";
};

export const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toUpperCase();

  switch (normalizedStatus) {
    case "ACTIVE":
    case "APPROVED":
      return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "Hoạt động" };
    case "INACTIVE":
      return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", label: "Chưa kích hoạt" };
    case "PENDING":
      return { bg: "#fefce8", color: "#ca8a04", border: "#fef08a", label: "Chờ duyệt" };
    case "DRAFT":
      return { bg: "#f8fafc", color: "#475569", border: "#cbd5e1", label: "Bản nháp" };
    case "REJECTED":
      return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Từ chối" };
    case "BLOCKED":
    case "BANNED":
      return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "Bị khóa" };
    case "DELETED":
      return { bg: "#f4f4f5", color: "#52525b", border: "#d4d4d8", label: "Đã xóa" };
    default:
      return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", label: status || "N/A" };
  }
};
