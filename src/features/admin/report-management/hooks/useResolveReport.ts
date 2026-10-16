import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveReport } from "../services/resolve-report";
import type { ResolveReportRequest } from "../types/report.type";

interface ResolveReportVariables {
  reportId: string;
  payload: ResolveReportRequest;
}

export const useResolveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, payload }: ResolveReportVariables) =>
      resolveReport({ reportId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats", "reports"] });
    },
  });
};
