import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { PageResponse } from "@/shared/types/api.type";
import type { ReportData } from "../types/report.type";
import {
  normalizeAdminReport,
  type AdminReportApiResponse,
} from "../utils/report-normalizers";

const USER_REPORT_HISTORY_PAGE_SIZE = 50;

const getUserReportsReceivedPage = async ({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) => {
  const response = await axiosInstance.get<PageResponse<AdminReportApiResponse>>(
    API_PATHS.ADMIN.GET_USER_REPORTS_RECEIVED(userId),
    {
      params: {
        page,
        size: USER_REPORT_HISTORY_PAGE_SIZE,
        sort: ["createdAt,desc"],
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  );

  return response as unknown as PageResponse<AdminReportApiResponse>;
};

export const getUserReportsReceived = async (
  userId: string,
): Promise<ReportData[]> => {
  const firstPage = await getUserReportsReceivedPage({ userId, page: 0 });
  const totalPages = Math.max(1, firstPage.totalPages || 1);

  if (totalPages === 1) {
    return firstPage.content.map(normalizeAdminReport);
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getUserReportsReceivedPage({ userId, page: index + 1 }),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) =>
    page.content.map(normalizeAdminReport),
  );
};
