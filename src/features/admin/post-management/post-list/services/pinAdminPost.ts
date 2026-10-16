import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";

export const pinAdminPost = async (id: string): Promise<void> => {
  await axiosInstance.post(API_PATHS.POST.PIN_POST(id));
};

export const unpinAdminPost = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_PATHS.POST.UNPIN_POST(id));
};
