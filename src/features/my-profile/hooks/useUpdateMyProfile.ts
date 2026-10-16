import { useMutation } from "@tanstack/react-query";
import { updateMyProfile } from "../services/update-my-profile";

export const useUpdateMyProfile = () => {
  return useMutation({
    mutationFn: updateMyProfile,
  });
};
