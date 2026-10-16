import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateTrainingLevels,
  type BulkCreateTrainingLevelItem,
} from "../services/bulk-create-training-levels.api";

export const useBulkCreateTrainingLevels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkCreateTrainingLevelItem[]) =>
      bulkCreateTrainingLevels(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ref", "traningLevel"],
      });
    },
  });
};
