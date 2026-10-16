import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { ReviewSummaryResponse } from "@/shared/types/common.type";

export const getReviewSummary = (
  teacherId: string,
): Promise<ReviewSummaryResponse> => {
  return axiosInstance.get<ReviewSummaryResponse>(
    API_PATHS.REVIEW.REVIEW_SUMMARY(teacherId),
  ) as unknown as Promise<ReviewSummaryResponse>;
};
