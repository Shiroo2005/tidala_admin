import { useQuery } from "@tanstack/react-query";
import { getProvincesList } from "../services/get-provinces-list";
import type { Province } from "../types";

export const useGetProvincesList = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ref", "province"],
    queryFn: () => getProvincesList(),
    select: (response) => response.content as Province[],
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });

  return {
    listProvinces: data ?? [],
    isLoadingListProvinces: isLoading,
    isErrorFetchListProvince: isError,
    errorOfFetchListProvince: error,
  };
};
