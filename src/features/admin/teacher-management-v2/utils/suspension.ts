import type { UserSuspensionResponse } from "@/shared/types/common.type";

export const isSuspensionActive = (
  suspension?: UserSuspensionResponse | null,
) => {
  if (!suspension) return false;

  const now = Date.now();
  const startAt = suspension.startAt ? new Date(suspension.startAt).getTime() : 0;
  const endAt = suspension.endAt
    ? new Date(suspension.endAt).getTime()
    : Number.POSITIVE_INFINITY;

  return startAt <= now && now <= endAt;
};

export const formatSuspensionDateTime = (dateStr?: string) => {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getSuspensionDurationDays = (
  suspension?: UserSuspensionResponse | null,
) => {
  const durationDays = suspension?.metadata?.duration_days;
  return typeof durationDays === "number" ? durationDays : null;
};

export const getSuspensionReason = (
  suspension?: UserSuspensionResponse | null,
) => {
  const metadataReason = suspension?.metadata?.reason;

  if (typeof metadataReason === "string" && metadataReason.trim()) {
    return metadataReason.trim();
  }

  return suspension?.reason || "Không có lý do cụ thể";
};
