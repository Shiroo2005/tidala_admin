import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";
import type { Province } from "@/shared/types/common.type";

export const getProvincesList = (params?: {
  page?: number;
  size?: number;
  sort?: string[];
}): Promise<PageResponse<Province>> => {
  return axiosInstance.get<PageResponse<Province>>(
    API_PATHS.LOCATION.GET_PROVINCES,
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 200,
        sort: params?.sort ?? ["string"],
      },
    },
  ) as unknown as Promise<PageResponse<Province>>;
};
