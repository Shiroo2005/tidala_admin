import type { TrainingLevel } from "@/shared/types/common.type";
import { useQuery } from "@tanstack/react-query";
import { getTraningLevelList } from "../services/get-training-level-list";

export const useGetTraininLevelList = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ref", "traningLevel"],
    queryFn: () => getTraningLevelList(),
    select: (response) => response.content as TrainingLevel[],
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });

  return {
    traningLevels: data ?? [],
    isLoadingTraningLevel: isLoading,
    isErrorFetchTraningLevel: isError,
    errorOfFetchTraningLevel: error,
  };
};
