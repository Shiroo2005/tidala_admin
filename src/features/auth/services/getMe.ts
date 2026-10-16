import { axiosInstance } from "@/config/axios";
import type { User } from "@/features/account/types/type";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { AxiosError } from "axios";

export const getMe = async (): Promise<User | null> => {
  try {
    console.log("Fetching user information...");
    return (await axiosInstance.get<User>(
      API_PATHS.AUTH.GET_ACCOUNT_INFORMATION,
    )) as unknown as User;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      return null;
    }
    throw error;
  }
};
