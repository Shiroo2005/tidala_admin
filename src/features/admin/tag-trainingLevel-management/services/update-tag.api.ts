import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { TagType } from "@/shared/types/tag.type";

export interface UpdateTagRequest {
  name: string;
  type: TagType;
}

export const updateTag = (
  id: number | string,
  payload: UpdateTagRequest,
): Promise<unknown> => {
  return axiosInstance.put(API_PATHS.TAG.UPDATE(id), payload);
};
