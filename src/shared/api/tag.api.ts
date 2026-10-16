import { axiosInstance } from "@/config/axios";
import type { Tag } from "../types/tag.type";
import { API_PATHS } from "../constants/apiPaths";

export const tagApi = {
  getAllTags: (): Promise<Tag[]> => {
    return axiosInstance.get<boolean>(
      `${API_PATHS.TAG.GET_ALL}`,
    ) as unknown as Promise<Tag[]>;
  },
};
