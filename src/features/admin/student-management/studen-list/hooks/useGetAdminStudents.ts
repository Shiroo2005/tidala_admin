import { useQuery } from "@tanstack/react-query";
import { getAdminStudents } from "../services/get-admin-students";

interface UseGetAdminStudentsParams {
  filter?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export const useGetAdminStudents = (params: UseGetAdminStudentsParams) => {
  const {
    filter,
    page = 1,
    size = 10,
    sort,
  } = params;

  return useQuery({
    queryKey: [
      "admin",
      "students",
      filter,
      page,
      size,
      sort,
    ],
    queryFn: () =>
      getAdminStudents({
        filter,
        page: page - 1,
        size,
        sort,
      }),
  });
};
