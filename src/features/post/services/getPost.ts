import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { Post } from "@/shared/types/post.type";

/**
 * Fetch a single post by ID via API
 * @param id - Post ID
 * @returns Post object
 */
export const getPost = async (id: string): Promise<Post> => {
  const response = await axiosInstance.get<Post>(
    API_PATHS.POST.GET_POST_DETAIL(id),
  );
  return response as unknown as Promise<Post>;
};
