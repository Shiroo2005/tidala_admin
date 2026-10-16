import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TeacherProfileUpdatePayload } from "../../types";
import { updateTeacherProfile } from "../services/update-teacher-profile";

export const useUpdateTeacherProfile = (teacherId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TeacherProfileUpdatePayload) =>
      updateTeacherProfile(teacherId, payload),
    onSuccess: () => {
      // Invalidate teacher detail cache so the detail page shows updated data
      queryClient.invalidateQueries({
        queryKey: ["teacherDetail", teacherId],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminTeacherDetail", teacherId],
      });
      // Also invalidate the admin teachers list
      queryClient.invalidateQueries({
        queryKey: ["admin", "teachers"],
      });
    },
  });
};
