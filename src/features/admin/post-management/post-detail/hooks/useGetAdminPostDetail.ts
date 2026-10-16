import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/features/post/services/getPost";

export const useGetAdminPostDetail = (postId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminPostDetail", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    post: data,
    isLoadingPost: isLoading,
    isErrorPost: isError,
    errorPost: error,
  };
};
