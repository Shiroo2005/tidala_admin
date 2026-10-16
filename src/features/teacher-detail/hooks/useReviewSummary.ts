import { useQuery } from "@tanstack/react-query";
import { getReviewSummary } from "../services/get-review-summary";

export const useReviewSummary = (id: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reviewSummary", id],
    queryFn: () => getReviewSummary(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    summary: data,
    isLoadingSummary: isLoading,
    isErrorSummary: isError,
    errorSummary: error,
  };
};
