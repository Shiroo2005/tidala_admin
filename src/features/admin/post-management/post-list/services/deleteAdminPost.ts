import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";

export const deleteAdminPost = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_PATHS.POST.DELETE_POST(id));
};
