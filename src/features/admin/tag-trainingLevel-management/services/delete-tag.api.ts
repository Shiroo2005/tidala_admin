import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";

export const deleteTag = (id: number | string): Promise<unknown> => {
  return axiosInstance.delete(API_PATHS.TAG.DELETE(id));
};
