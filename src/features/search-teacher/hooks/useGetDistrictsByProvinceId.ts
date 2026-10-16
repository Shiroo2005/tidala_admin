import { useGetProvinceDetail } from "./useGetProvinceDetail";

export const useGetDistricstByProvinceId = (provinceId: string) => {
  const {
    provinceDetails,
    isLoadingProvinceDetail,
    isErrorFetchProvinceDetail,
  } = useGetProvinceDetail(provinceId);
  return {
    listDistricts: provinceDetails?.districts,
    isLoadingListDistricts: isLoadingProvinceDetail,
    isErrorFetchListDistricts: isErrorFetchProvinceDetail,
  };
};
