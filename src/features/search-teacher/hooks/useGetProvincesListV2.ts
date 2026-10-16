import type { Province } from "@/shared/types/common.type";
import { useQuery } from "@tanstack/react-query";
import { getProvincesListV2 } from "../services/get-provinces-list-v2";

export const useGetProvincesListV2 = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ref", "province", "v2"],
    queryFn: () => getProvincesListV2(),
    select: (response) => response as Province[],
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
