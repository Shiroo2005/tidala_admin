import { useQuery } from "@tanstack/react-query";
import { getAdminReportDetail } from "../services/get-admin-report-detail";

export const useGetAdminReportDetail = (
  reportId?: string | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["admin", "reports", "detail", reportId],
    queryFn: () => getAdminReportDetail(reportId as string),
    enabled: Boolean(reportId) && enabled,
  });
};
