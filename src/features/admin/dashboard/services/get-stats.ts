import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { ApiResponse } from "@/shared/types/common.type";
import type { PostStats, ReportStats, TeacherStats, UserStats } from "../types";

export const getUserStats = async (period?: string): Promise<UserStats> => {
  const response = await axiosInstance.get<ApiResponse<UserStats>>(
    API_PATHS.ADMIN.STATS.GET_USER_STATS,
    { params: period ? { period } : {} }
  );
  const data = (
    response.data?.data ? response.data.data : response
  ) as UserStats;
  return data;
};

export const getTeacherStats = async (period?: string): Promise<TeacherStats> => {
  const response = await axiosInstance.get<ApiResponse<TeacherStats>>(
    API_PATHS.ADMIN.STATS.GET_TEACHER_STATS,
    { params: period ? { period } : {} }
  );
  const data = (
    response.data?.data ? response.data.data : response
  ) as TeacherStats;
  return data;
};

export const getReportStats = async (period?: string): Promise<ReportStats> => {
  const response = await axiosInstance.get<ApiResponse<ReportStats>>(
    API_PATHS.ADMIN.STATS.GET_REPORT_STATS,
    { params: period ? { period } : {} }
  );
  const data = (
    response.data?.data ? response.data.data : response
  ) as ReportStats;
  return data;
};

export const getPostStats = async (period?: string): Promise<PostStats> => {
  const response = await axiosInstance.get<ApiResponse<PostStats>>(
    API_PATHS.ADMIN.STATS.GET_POST_STATS,
    { params: period ? { period } : {} }
  );
  const data = (
    response.data?.data ? response.data.data : response
  ) as PostStats;
  return data;
};


