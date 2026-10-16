import { useMutation } from "@tanstack/react-query";
import { pinAdminPost, unpinAdminPost } from "../services/pinAdminPost";

export const usePinAdminPost = () => {
  const pinMutation = useMutation({
    mutationFn: (id: string) => pinAdminPost(id),
  });

  const unpinMutation = useMutation({
    mutationFn: (id: string) => unpinAdminPost(id),
  });

  return { pinMutation, unpinMutation };
};
