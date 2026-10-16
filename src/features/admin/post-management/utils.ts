export type PostStatus = "PUBLISHED" | "PENDING" | "REPORTED";

export const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; bgClass: string; textClass: string; dotClass: string }
> = {
  PUBLISHED: {
    label: "Đã đăng",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  PENDING: {
    label: "Chờ duyệt",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    dotClass: "bg-amber-500",
  },
  REPORTED: {
    label: "Bị báo cáo",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    dotClass: "bg-red-500",
  },
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatAbsoluteDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
//
