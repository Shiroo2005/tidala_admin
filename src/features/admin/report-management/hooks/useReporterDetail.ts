import { useQuery } from "@tanstack/react-query";
import { getReporterDetail } from "../services/get-reporter-detail";

export const useReporterDetail = (reporterId: string, enabled: boolean) =>
  useQuery({
    queryKey: ["admin", "reporter", reporterId],
    queryFn: () => getReporterDetail(reporterId),
    enabled: enabled && Boolean(reporterId),
  });
