import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { Province } from "@/shared/types/common.type";

export const getProvincesListV2 = (params?: {
  page?: number;
  size?: number;
  sort?: string[];
}): Promise<Province[]> => {
  return axiosInstance.get<Province[]>(API_PATHS.LOCATION.GET_PROVINCES_V2, {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 200,
      sort: params?.sort ?? ["string"],
    },
  }) as unknown as Promise<Province[]>;
};
