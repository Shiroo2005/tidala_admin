import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";

export interface UpdateTrainingLevelRequest {
  id: string | number;
  name: string;
  description: string;
}

export const updateTrainingLevel = (
  id: number | string,
  payload: UpdateTrainingLevelRequest,
): Promise<unknown> => {
  return axiosInstance.put(API_PATHS.TRAING_LEVEL.UPDATE(id), payload);
};
