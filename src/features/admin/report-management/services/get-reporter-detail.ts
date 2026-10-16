import { axiosInstance } from "@/config/axios";
import type { ReporterDetail } from "../types/report.type";

/** Resolved by the live adapter from the admin user list (no get-by-id endpoint exists). */
export const getReporterDetail = async (reporterId: string): Promise<ReporterDetail> => {
  const response = await axiosInstance.get(`/admin/reporters/${reporterId}`);
  return response as unknown as ReporterDetail;
};
