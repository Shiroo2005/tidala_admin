import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminPost } from "../services/deleteAdminPost";

export const useDeleteAdminPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminPost(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["adminPostDetail", id] });
    },
  });
};
