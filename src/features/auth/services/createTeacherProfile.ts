import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { ITeacherProfileSetupPayload } from "@/features/auth/types";

export const createTeacherProfile = async (
  payload: ITeacherProfileSetupPayload,
) => {
  const response = await axiosInstance.post(
    API_PATHS.PROFILE.TEACHER_SETUP,
    payload,
  );

  return response.data;
};
