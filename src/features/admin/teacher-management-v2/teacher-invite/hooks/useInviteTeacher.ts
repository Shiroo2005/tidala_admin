import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  inviteTeacher,
  type InviteTeacherRequest,
} from "../services/invite-teacher.api";

export const useInviteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteTeacherRequest) => inviteTeacher(payload),
    onSuccess: () => {
      // Invalidate the admin teachers list so it reflects the new teacher
      queryClient.invalidateQueries({
        queryKey: ["admin", "teachers"],
      });
    },
  });
};
