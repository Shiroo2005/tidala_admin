import { useQuery } from "@tanstack/react-query";
import { getAdminTeacherDetail } from "../services/get-admin-teacher-detail.api";

export const useGetAdminTeacherDetail = (teacherId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminTeacherDetail", teacherId],
    queryFn: () => getAdminTeacherDetail(teacherId),
    enabled: !!teacherId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: (data) => data,
  });

  return {
    teacherDetail: data,
    isLoadingTeacherDetail: isLoading,
    isErrorFetchTeacherDetail: isError,
    errorOfFetchTeacherDetail: error,
  };
};
