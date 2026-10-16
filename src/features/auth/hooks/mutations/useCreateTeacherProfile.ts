import { useMutation } from "@tanstack/react-query";
import { createTeacherProfile } from "@/features/auth/services/createTeacherProfile";
import { queryClient } from "@/config/react-query/queryClient";
import { AUTH_QUERY_KEY } from "../queries/useGetMe";

export const useCreateTeacherProfile = () => {
  return useMutation({
    mutationFn: createTeacherProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
    },
  });
};
