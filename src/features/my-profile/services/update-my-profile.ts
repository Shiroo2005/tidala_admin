import { axiosInstance } from "@/config/axios";
import { API_PATHS } from "@/shared/constants/apiPaths";
import type { UpdateMyProfilePayloadType } from "../utils/buildPayload";

export const updateMyProfile = async (payload: UpdateMyProfilePayloadType) => {
  const response = await axiosInstance.put(
    API_PATHS.PROFILE.UPDATE_MY_PROFILE,
    payload,
  );

  return response.data;
};
