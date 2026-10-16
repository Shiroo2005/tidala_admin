import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";

export const deleteTrainingLevel = (id: number | string): Promise<unknown> => {
  return axiosInstance.delete(API_PATHS.TRAING_LEVEL.DELETE(id));
};
