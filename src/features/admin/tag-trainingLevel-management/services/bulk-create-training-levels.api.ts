import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";

export interface BulkCreateTrainingLevelItem {
  name: string;
  description: string;
}

export const bulkCreateTrainingLevels = (
  payload: BulkCreateTrainingLevelItem[],
): Promise<unknown> => {
  return axiosInstance.post(API_PATHS.TRAING_LEVEL.BULK_CREATE, payload);
};
