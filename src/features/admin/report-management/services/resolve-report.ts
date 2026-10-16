import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { ResolveReportRequest } from "../types/report.type";

export const resolveReport = ({
  reportId,
  payload,
}: {
  reportId: string;
  payload: ResolveReportRequest;
}): Promise<void> => {
  return axiosInstance.post<void>(
    API_PATHS.ADMIN.RESOLVE_REPORT(reportId),
    payload,
  ) as unknown as Promise<void>;
};
