import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";
import type { TrainingLevel } from "@/shared/types/common.type";

export const getTraningLevelList = (params?: {
  page?: number;
  size?: number;
  sort?: string[];
}): Promise<PageResponse<TrainingLevel>> => {
  return axiosInstance.get<PageResponse<TrainingLevel>>(
    API_PATHS.TRAING_LEVEL.GET_TRANING_LEVELS,
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 200,
        sort: params?.sort ?? ["string"],
      },
    },
  ) as unknown as Promise<PageResponse<TrainingLevel>>;
};
