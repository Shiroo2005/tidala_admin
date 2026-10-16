import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateTags,
  type BulkCreateTagItem,
} from "../services/bulk-create-tags.api";

export const useBulkCreateTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkCreateTagItem[]) => bulkCreateTags(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
};
