import { useQuery } from "@tanstack/react-query";
import { getAdminTeachers } from "../services/get-admin-teachers";

interface UseGetAdminTeachersParams {
  filter?: string;
  trainingLevelIds?: string[];
  provinceId?: string;
  districtIds?: string[];
  statuses?: string[];
  page?: number;
  size?: number;
  sort?: string[];
}

export const useGetAdminTeachers = (params: UseGetAdminTeachersParams) => {
  const {
    filter,
    trainingLevelIds,
    provinceId,
    districtIds,
    statuses,
    page = 1,
    size = 10,
    sort,
  } = params;

  return useQuery({
    queryKey: [
      "admin",
      "teachers",
      filter,
      trainingLevelIds,
      provinceId,
      districtIds,
      statuses,
      page,
      size,
      sort,
    ],
    queryFn: () =>
      getAdminTeachers({
        filter,
        trainingLevelIds:
          trainingLevelIds && trainingLevelIds.length > 0
            ? trainingLevelIds
            : undefined,
        provinceIds:
          provinceId && provinceId !== "ALL" ? [provinceId] : undefined,
        districtIds:
          districtIds && districtIds.length > 0 ? districtIds : undefined,
        status:
          statuses && statuses.length > 0 ? statuses : undefined,
        page: page - 1,
        size,
        sort,
      }),
  });
};
