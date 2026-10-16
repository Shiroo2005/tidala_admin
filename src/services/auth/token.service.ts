const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_CHANGED_EVENT = "tidala:auth-token-changed";

export const AUTH_FORCE_LOGOUT_EVENT = "tidala:auth-force-logout";

const emitTokenChanged = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(TOKEN_CHANGED_EVENT));
};

export const emitForceLogout = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_FORCE_LOGOUT_EVENT));
};

export const tokenService = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    emitTokenChanged();
  },
  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    emitTokenChanged();
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    emitTokenChanged();
  },
};
