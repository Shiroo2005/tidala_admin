import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { TeacherDetail, ApiResponse } from "@/shared/types/common.type";

export const getAdminTeacherDetail = async (
  teacherId: string,
): Promise<TeacherDetail> => {
  const response = await axiosInstance.get<ApiResponse<Record<string, unknown>>>(
    API_PATHS.ADMIN.GET_TEACHER_DETAIL(teacherId),
  );
  
  // Interceptor might have unwrapped data, but let's handle both cases just to be safe
  const data = (response.data?.data ? response.data.data : response) as Record<string, unknown>;

  // Map Admin specific API fields back to standard TeacherDetail interface
  // so existing UI components don't break.
  return {
    ...data,
    avatarUrl: data.avatar || data.avatarUrl,
    contactEmail: data.email || data.contactEmail,
    contactPhoneNumber: data.phone || data.contactPhoneNumber,
    // Add any other specific mappings if needed. 
    // The rest of the payload matches the TeacherDetail structure nicely.
  } as TeacherDetail;
};
