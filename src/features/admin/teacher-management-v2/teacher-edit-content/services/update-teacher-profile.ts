import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { TeacherProfileUpdatePayload } from "../../types";

export const updateTeacherProfile = (
  teacherId: string,
  payload: TeacherProfileUpdatePayload,
): Promise<void> => {
  return axiosInstance.put(
    API_PATHS.ADMIN.UPDATE_TEACHER_PROFILE(teacherId),
    payload,
  ) as unknown as Promise<void>;
};
