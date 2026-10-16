import type { AdminTeacherDetail } from "../types";

export const getAdminTeacherId = (teacher: AdminTeacherDetail) =>
  teacher.id || teacher.userId || "";

export const formatExperience = (exp: string) => {
  switch (exp) {
    case "LESS_THAN_1_YEAR":
      return "Dưới 1 năm";
    case "ONE_TO_THREE":
      return "1-3 năm";
    case "THREE_TO_FIVE":
      return "3-5 năm";
    case "FIVE_TO_TEN":
      return "5-10 năm";
    case "TEN_PLUS":
      return "Trên 10 năm";
    case "FIVE_PLUS_YEARS":
      return "Trên 5 năm";
    default:
      return exp || "-";
  }
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getStatusStyle = (status: string) => {
  const normalizedStatus = status?.toUpperCase();

  switch (normalizedStatus) {
    case "ACTIVE":
    case "APPROVED":
      return {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-100/50",
        dot: "bg-green-500",
        label: "Hoạt động",
      };
    case "INACTIVE":
      return {
        bg: "bg-slate-50",
        text: "text-slate-500",
        border: "border-slate-200/60",
        dot: "bg-slate-400",
        label: "Chưa kích hoạt",
      };
    case "PENDING":
      return {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-100/50",
        dot: "bg-amber-500",
        label: "Chờ duyệt",
      };
    case "REJECTED":
    case "BLOCKED":
    case "BANNED":
      return {
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-100/50",
        dot: "bg-rose-500",
        label: normalizedStatus === "REJECTED" ? "Từ chối" : "Bị khóa",
      };
    case "DELETED":
      return {
        bg: "bg-zinc-100",
        text: "text-zinc-600",
        border: "border-zinc-200/70",
        dot: "bg-zinc-400",
        label: "Đã xóa",
      };
    case "DRAFT":
      return {
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200/60",
        dot: "bg-slate-400",
        label: "Bản nháp",
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-500",
        border: "border-slate-200/50",
        dot: "bg-slate-300",
        label: status || "N/A",
      };
  }
};
