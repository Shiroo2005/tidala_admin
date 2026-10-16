import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTag,
  type UpdateTagRequest,
} from "../services/update-tag.api";

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateTagRequest }) =>
      updateTag(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
};
