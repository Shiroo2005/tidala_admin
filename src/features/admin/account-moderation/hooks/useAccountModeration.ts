import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  revokeSanction,
  sanctionUser,
} from "../services/account-moderation.api";
import type {
  RevokeSanctionVariables,
  SanctionUserVariables,
} from "../types";

const invalidateAccountModerationQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string,
) => {
  queryClient.invalidateQueries({ queryKey: ["admin", "teachers"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
  queryClient.invalidateQueries({ queryKey: ["adminTeacherDetail", userId] });
  queryClient.invalidateQueries({ queryKey: ["teacherDetail", userId] });
  queryClient.invalidateQueries({ queryKey: ["admin", "stats", "users"] });
  queryClient.invalidateQueries({ queryKey: ["admin", "stats", "teachers"] });
};

export const useSanctionUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: SanctionUserVariables) =>
      sanctionUser(userId, payload),
    onSuccess: (_data, variables) => {
      invalidateAccountModerationQueries(queryClient, variables.userId);
    },
  });
};

export const useRevokeSanction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RevokeSanctionVariables) =>
      revokeSanction(variables),
    onSuccess: (_data, variables) => {
      invalidateAccountModerationQueries(queryClient, variables.userId);
    },
  });
};

