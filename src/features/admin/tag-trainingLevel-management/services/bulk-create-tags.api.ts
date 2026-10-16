import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { TagType } from "@/shared/types/tag.type";

export interface BulkCreateTagItem {
  name: string;
  type: TagType;
}

export const bulkCreateTags = (
  payload: BulkCreateTagItem[],
): Promise<unknown> => {
  return axiosInstance.post(API_PATHS.TAG.BULK_CREATE, payload);
};
