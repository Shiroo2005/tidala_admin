import { realRequest } from "@/config/realApi";
import { tokenService } from "./token.service";
import type { AdminUser } from "@/features/account/types/type";

interface BackendUser {
  id: string;
  email?: string | null;
  fullName: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  avatarUrl?: string;
}

interface LoginResult {
  user: BackendUser;
  tokens: { accessToken: string; refreshToken: string };
}

export const ADMIN_ONLY_ERROR = { code: "ADMIN_ONLY", message: "Tài khoản này không có quyền quản trị" };

const toAdmin = (user: BackendUser): AdminUser => ({
  id: user.id,
  email: user.email ?? "",
  fullName: user.fullName,
  role: "ADMIN",
  phoneNumber: null,
  avatarUrl: user.avatarUrl ?? null,
  createdAt: "",
});

export const authService = {
  async login(email: string, password: string): Promise<AdminUser> {
    let result: LoginResult;
    try {
      result = await realRequest<LoginResult>({
        method: "post",
        url: "/api/v1/auth/login",
        data: { email, password },
        auth: false,
      });
    } catch (error) {
      const code = (error as { response?: { data?: { code?: string } } }).response?.data?.code;
      // useLoginForm shows its inline "wrong email or password" message for this code.
      if (code === "LOGIN_FAILED") throw { code: "INVALID_CREDENTIALS", message: "Email hoặc mật khẩu không đúng" };
      throw (error as { response?: { data?: unknown } }).response?.data ?? error;
    }
    if (result.user.role !== "ADMIN") {
      // Never keep a non-admin session: the backend would issue tokens that open nothing here.
      await realRequest({ method: "post", url: "/api/v1/auth/logout", data: { refreshToken: result.tokens.refreshToken }, auth: false }).catch(() => undefined);
      throw ADMIN_ONLY_ERROR;
    }
    tokenService.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
    return toAdmin(result.user);
  },

  /** Returns the signed-in admin, or null when there is no valid admin session. */
  async me(): Promise<AdminUser | null> {
    if (!tokenService.getAccessToken()) return null;
    try {
      const user = await realRequest<BackendUser>({ method: "get", url: "/api/v1/auth/me" });
      return user.role === "ADMIN" ? toAdmin(user) : null;
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 401 || status === 403) return null;
      throw error;
    }
  },

  async logout(): Promise<void> {
    const refreshToken = tokenService.getRefreshToken();
    try {
      if (refreshToken) {
        await realRequest({ method: "post", url: "/api/v1/auth/logout", data: { refreshToken }, auth: false });
      }
    } catch {
      // The session is dropped locally either way.
    } finally {
      tokenService.clear();
    }
  },
};
