import { useQuery } from "@tanstack/react-query";
import { getAdminReports } from "../services/get-admin-reports";

interface UseGetAdminReportsParams {
  filter?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export const useGetAdminReports = (params: UseGetAdminReportsParams) => {
  const { filter, page = 1, size = 20, sort } = params;

  return useQuery({
    queryKey: ["admin", "reports", filter, page, size, sort],
    queryFn: () =>
      getAdminReports({
        filter,
        page: page - 1,
        size,
        sort: sort || ["createdAt,desc"],
      }),
  });
};
