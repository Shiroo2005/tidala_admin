import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";
import type { AdminTeacherDetail } from "../../types";

export const getAdminTeachers = (params?: {
  filter?: string;
  trainingLevelIds?: string[];
  provinceIds?: string[];
  districtIds?: string[];
  status?: string[];
  page?: number;
  size?: number;
  sort?: string[];
}): Promise<PageResponse<AdminTeacherDetail>> => {
  return axiosInstance.get<PageResponse<AdminTeacherDetail>>(
    API_PATHS.ADMIN.GET_TEACHERS,
    {
      params,
      paramsSerializer: {
        indexes: null,
      },
    },
  ) as unknown as Promise<PageResponse<AdminTeacherDetail>>;
};
