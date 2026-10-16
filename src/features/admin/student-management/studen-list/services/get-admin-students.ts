import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";
import type { AdminStudentDetail } from "../../types";

export const getAdminStudents = async (params?: {
  filter?: string;
  page?: number;
  size?: number;
  sort?: string[];
}): Promise<PageResponse<AdminStudentDetail>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axiosInstance.get<any>(API_PATHS.ADMIN.GET_STUDENTS, {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });

  // Interceptor might have unwrapped data, but let's handle both cases just to be safe
  const data = (
    response?.data?.data ? response.data.data : response?.data || response
  ) as PageResponse<AdminStudentDetail>;

  return data;
};
