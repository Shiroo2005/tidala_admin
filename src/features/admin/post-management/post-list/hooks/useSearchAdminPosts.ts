import { useQuery } from "@tanstack/react-query";
import { getSearchPostAdmin } from "../services/getSearchPostAdmin";

interface UseSearchAdminPostsParams {
  keyword?: string;
  postTypes?: string;
  page?: number;
  size?: number;
  sort?: string[];
  enabled?: boolean;
}

export const useSearchAdminPosts = ({
  keyword = "",
  postTypes = "",
  page = 1,
  size = 10,
  sort,
  enabled = true,
}: UseSearchAdminPostsParams) => {
  return useQuery({
    queryKey: ["admin", "posts", "search", keyword, postTypes, page, size, sort],
    queryFn: () =>
      getSearchPostAdmin({
        keyword,
        postTypes,
        page: page - 1, // API is 0-based
        size,
        sort,
      }),
    enabled,
  });
};
