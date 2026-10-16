/**
 * Utility functions for generating share URLs
 * Uses VITE_SHARE_DOMAIN environment variable for proper domain
 */
import { APP_PATHS } from "@/shared/constants/appPaths";

/**
 * Generate a teacher share URL with the correct domain
 * Pattern: {VITE_SHARE_DOMAIN}/teacher-detail/{teacherId}
 */
export const generateTeacherShareUrl = (teacherId?: string): string => {
  const domain = import.meta.env.VITE_SHARE_DOMAIN || window.location.origin;

  if (!teacherId) {
    return domain;
  }

  return `${domain}${APP_PATHS.TEACHER_DETAIL_WITH_ID(teacherId)}`;
};

/**
 * Generate a review share URL with query parameter
 * Pattern: {currentUrl}?review={reviewId}
 */
export const generateReviewShareUrl = (reviewId: string): string => {
  const domain = import.meta.env.VITE_SHARE_DOMAIN || window.location.origin;

  if (!reviewId) {
    return domain;
  }

  return `${domain}${APP_PATHS.SHARE_TEACHER_REVIEW(reviewId)}`;
};

/**
 * Generate a post share URL
 * Pattern: {VITE_SHARE_DOMAIN}/post/{postId}
 */
export const generatePostShareUrl = (postId?: string | number): string => {
  const domain = import.meta.env.VITE_SHARE_DOMAIN || window.location.origin;

  if (!postId) {
    return domain;
  }

  return `${domain}${APP_PATHS.POST_DETAIL(String(postId))}`;
};

/**
 * Generate a generic share text for teacher
 */
export const generateTeacherShareText = (teacherName?: string): string => {
  return `${teacherName ? `Xem thông tin giáo viên ${teacherName}` : "Xem hồ sơ giáo viên"} trên Tidala`;
};

/**
 * Generate a generic share text for review
 */
export const generateReviewShareText = (reviewContent?: string): string => {
  const preview = reviewContent
    ? reviewContent.substring(0, 100) + "..."
    : "Check out this review";
  return `${preview} - Tidala`;
};
