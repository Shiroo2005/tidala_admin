import { useQuery } from "@tanstack/react-query";
import { getUserReportsReceived } from "../services/get-user-reports-received";

export const useGetUserReportsReceived = (
  userId?: string | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["admin", "users", userId, "reports", "received"],
    queryFn: () => getUserReportsReceived(userId as string),
    enabled: Boolean(userId) && enabled,
  });
};
