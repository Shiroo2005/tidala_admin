import { getMe } from "@/features/auth/services/getMe";
import { tokenService } from "@/services/auth/token.service";
import { useQuery } from "@tanstack/react-query";

export const AUTH_QUERY_KEY = ["auth", "user"] as const;

export const useGetMe = () => {
  const token = tokenService.getAccessToken();

  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
