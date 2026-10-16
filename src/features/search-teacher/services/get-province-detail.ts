import { axiosInstance } from "@/config/axios";
import type { ProvinceDetails } from "@/features/home/types";
import { API_PATHS } from "@/shared/constants/apiPaths";

export const getProvinceDetail = (
  provinceId: string,
): Promise<ProvinceDetails> => {
  return axiosInstance.get<ProvinceDetails>(
    API_PATHS.LOCATION.GET_PROVINCE_DETAIL(provinceId),
  ) as unknown as Promise<ProvinceDetails>;
};
