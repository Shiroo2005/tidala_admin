import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTrainingLevel,
  type UpdateTrainingLevelRequest,
} from "../services/update-training-level.api";

export const useUpdateTrainingLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateTrainingLevelRequest }) =>
      updateTrainingLevel(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ref", "traningLevel"],
      });
    },
  });
};
