import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { ReportDetailData } from "../types/report.type";
import {
  normalizeAdminReport,
  type AdminReportApiResponse,
} from "../utils/report-normalizers";

type AdminReportDetailApiResponse = AdminReportApiResponse &
  Partial<ReportDetailData> & {
  history?: ReportDetailData["history"];
};

const normalizeAdminReportDetail = (
  report: AdminReportDetailApiResponse,
): ReportDetailData => {
  return {
    ...normalizeAdminReport(report),
    history: report.history || [],
  } as ReportDetailData;
};

export const getAdminReportDetail = async (
  reportId: string,
): Promise<ReportDetailData> => {
  const response = await axiosInstance.get<AdminReportDetailApiResponse>(
    API_PATHS.ADMIN.GET_REPORT_DETAIL(reportId),
  );

  return normalizeAdminReportDetail(
    response as unknown as AdminReportDetailApiResponse,
  );
};
