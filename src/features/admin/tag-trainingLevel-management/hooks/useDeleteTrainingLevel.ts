import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrainingLevel } from "../services/delete-training-level.api";

export const useDeleteTrainingLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTrainingLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ref", "traningLevel"],
      });
    },
  });
};
