import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";
import type { ReportData } from "../types/report.type";
import {
  normalizeAdminReport,
  type AdminReportApiResponse,
} from "../utils/report-normalizers";

export const getAdminReports = (params?: {
  filter?: string;
  page?: number;
  size?: number;
  sort?: string[];
}): Promise<PageResponse<ReportData>> => {
  return axiosInstance
    .get<PageResponse<AdminReportApiResponse>>(
    API_PATHS.ADMIN.GET_REPORTS,
    {
      params,
      paramsSerializer: {
        indexes: null,
      },
    },
    )
    .then((response) => {
      const page = response as unknown as PageResponse<AdminReportApiResponse>;

      return {
        ...page,
        content: page.content.map(normalizeAdminReport),
      };
    });
};
