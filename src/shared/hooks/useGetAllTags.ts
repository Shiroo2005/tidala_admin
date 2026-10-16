import { useQuery } from "@tanstack/react-query";
import { tagApi } from "../api/tag.api";
import type { Tag } from "../types/tag.type";

export const useGetAllTags = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagApi.getAllTags(),
    select: (response) => response as Tag[],
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });

  return {
    tags: data ?? [],
    isLoadingTags: isLoading,
    isErrorFetchTags: isError,
    errorOfFetchTags: error,
  };
};
