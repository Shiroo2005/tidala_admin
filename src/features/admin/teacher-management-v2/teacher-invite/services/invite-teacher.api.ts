import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";

export interface InviteTeacherRequest {
  email: string;
  fullName: string;
}

export interface InviteTeacherResponse {
  userId: string;
  email: string;
  fullName: string;
}

export const inviteTeacher = (
  payload: InviteTeacherRequest,
): Promise<InviteTeacherResponse> => {
  return axiosInstance.post<InviteTeacherResponse>(
    API_PATHS.ADMIN.INVITE_TEACHER,
    payload,
  ) as unknown as Promise<InviteTeacherResponse>;
};
