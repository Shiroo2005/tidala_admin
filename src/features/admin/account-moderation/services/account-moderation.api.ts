import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type {
  RevokeSanctionVariables,
  SanctionUserRequest,
} from "../types";

export const sanctionUser = (
  userId: string,
  payload: SanctionUserRequest,
): Promise<void> => {
  return axiosInstance.post<void>(
    API_PATHS.ADMIN.ACCOUNT_MODERATION.SANCTION(userId),
    payload,
  ) as unknown as Promise<void>;
};

export const revokeSanction = ({
  userId,
  reason,
}: RevokeSanctionVariables): Promise<void> => {
  return axiosInstance.post<void>(
    API_PATHS.ADMIN.ACCOUNT_MODERATION.REVOKE_SANCTION(userId),
    undefined,
    {
      params: { reason },
    },
  ) as unknown as Promise<void>;
};

