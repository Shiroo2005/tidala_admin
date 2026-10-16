import { useQuery } from "@tanstack/react-query";
import { getTeacherReviews } from "../services/get-teacher-review";

export const useGetTeacherReviews = (
  id: string,
  page = 0,
  size = 5,
  sort?: string[],
) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["teacherReviews", id, page, size, sort],
    queryFn: () => getTeacherReviews(id, page, size, sort),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,

    placeholderData: (previousData) => previousData,
  });

  return {
    reviewsData: data,
    isLoadingReviews: isLoading,
    isFetchingReviews: isFetching,
    isErrorReviews: isError,
    errorReviews: error,
    refetchReviews: refetch,
  };
};
