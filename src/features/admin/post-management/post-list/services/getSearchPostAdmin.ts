import { axiosInstance } from "@/config/axios";
import type { Post } from "@/shared/types/post.type";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";

export const getSearchPostAdmin = async (params?: {
  keyword?: string;
  postTypes?: string;
  page?: number;
  size?: number;
  sort?: string[];
}): Promise<PageResponse<Post>> => {
  const res = await axiosInstance.get<PageResponse<Post>>(
    API_PATHS.POST.GET_SEARCH_POSTS(
      params?.keyword ?? "",
      params?.postTypes ?? "",
    ),
    {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        sort: params?.sort,
      },
    },
  );
  return res as unknown as PageResponse<Post>;
};
