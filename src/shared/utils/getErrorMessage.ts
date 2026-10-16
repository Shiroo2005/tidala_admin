// src/utils/get-error-message.ts
import { type ErrorCode } from "@/shared/types/errorCode.type";
import { ERROR_MESSAGE_VI } from "@shared/constants/error-messages.vi";

export function getErrorMessage(
  errorCode?: string,
  fallback = "Đã xảy ra lỗi, vui lòng thử lại",
): string {
  if (!errorCode) return fallback;

  // Handle specific raw messages from backend if they are passed as errorCode
  if (errorCode === "You cannot review your own profile") {
    return (
      ERROR_MESSAGE_VI["YOU_CANNOT_REVIEW_YOUR_OWN_PROFILE"] ||
      "Bạn không thể đánh giá hồ sơ của chính mình"
    );
  }

  return ERROR_MESSAGE_VI[errorCode as ErrorCode] ?? fallback;
}
