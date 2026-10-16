import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";
import type { ReviewResponse } from "@/shared/types/common.type";

export const getTeacherReviews = (
  teacherId: string,
  page: number = 0,
  size: number = 5,
  sort: string[] = ["-createdAt"],
): Promise<PageResponse<ReviewResponse>> => {
  return axiosInstance.get<PageResponse<ReviewResponse>>(
    API_PATHS.REVIEW.GET_TEACHER_REVIEWS(teacherId, page, size, sort),
  ) as unknown as Promise<PageResponse<ReviewResponse>>;
};
