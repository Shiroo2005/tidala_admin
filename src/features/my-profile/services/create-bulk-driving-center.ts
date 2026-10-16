import { axiosInstance } from "@/config/axios";
import type { DrivingCenterType } from "@/features/account/types/type";
import { API_PATHS } from "@/shared/constants/apiPaths";

export interface CreateBulkDrivingCenterRequest {
  name: string;
  type: DrivingCenterType;
  address: string;
  placeId: string;
}

export interface DrivingCenterResponse {
  id: string;
  name: string;
  type: string;
  address: string;
  placeId: string;
}
export const createBulkDrivingCenter = async (
  payload: CreateBulkDrivingCenterRequest[],
): Promise<DrivingCenterResponse[]> => {
  return axiosInstance.post<DrivingCenterResponse[]>(
    API_PATHS.DRIVING_CENTER.CREATE_BULK_DRIVING_CENTER,
    payload,
  ) as unknown as Promise<DrivingCenterResponse[]>;
};
