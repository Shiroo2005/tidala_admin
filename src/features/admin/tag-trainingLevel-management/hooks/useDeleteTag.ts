import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag } from "../services/delete-tag.api";

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
};
