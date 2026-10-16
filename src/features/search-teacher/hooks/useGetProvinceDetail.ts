import { useQuery } from "@tanstack/react-query";
import { getProvinceDetail } from "../services/get-province-detail";

export const useGetProvinceDetail = (provinceId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["provinceDetails", provinceId],
    queryFn: () => getProvinceDetail(provinceId),
    enabled: !!provinceId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    select: (data) => data,
  });

  return {
    provinceDetails: data,
    isLoadingProvinceDetail: isLoading,
    isErrorFetchProvinceDetail: isError,
    errorOfFetchProvinceDetail: error,
  };
};
