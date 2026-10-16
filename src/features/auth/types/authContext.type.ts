import type { User as AppUser } from "@/features/account/types/type";

export type AuthUser = {
  appUser: AppUser;
};

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginPending: boolean;
  logout: () => Promise<void>;
  logoutPending: boolean;
  refetchUser: () => Promise<void>;
}

