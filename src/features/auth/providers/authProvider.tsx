import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./authContext";
import { authService } from "@/services/auth/auth.service";
import { AUTH_FORCE_LOGOUT_EVENT, tokenService } from "@/services/auth/token.service";
import type { AdminUser } from "@/features/account/types/type";

// Dev-only switch (see .env.development): skips sign-in and treats every visitor as an admin.
const AUTH_DISABLED = import.meta.env.VITE_DISABLE_AUTH === "true";
const OPEN_ACCESS_ADMIN: AdminUser = { id: "open-access", fullName: "Quản trị viên", email: "", role: "ADMIN", phoneNumber: null, avatarUrl: null, createdAt: "" };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<AdminUser | null>(AUTH_DISABLED ? OPEN_ACCESS_ADMIN : null);
    // Only wait on the network when a stored session might still be valid.
    const [loading, setLoading] = useState(() => !AUTH_DISABLED && !!tokenService.getAccessToken());
    const [loginPending, setLoginPending] = useState(false);
    const [logoutPending, setLogoutPending] = useState(false);

    useEffect(() => {
        if (AUTH_DISABLED) return;
        let active = true;
        authService.me()
            .then(admin => { if (active) setUser(admin); })
            .catch(() => { if (active) setUser(null); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    // Raised by the API client when a refresh fails: drop the session without another network call.
    useEffect(() => {
        const onForceLogout = () => { if (AUTH_DISABLED) return; setUser(null); queryClient.clear(); };
        window.addEventListener(AUTH_FORCE_LOGOUT_EVENT, onForceLogout);
        return () => window.removeEventListener(AUTH_FORCE_LOGOUT_EVENT, onForceLogout);
    }, [queryClient]);

    const login = useCallback(async (email: string, password: string) => {
        setLoginPending(true);
        try {
            setUser(await authService.login(email, password));
        }
        finally {
            setLoginPending(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLogoutPending(true);
        await authService.logout();
        setUser(AUTH_DISABLED ? OPEN_ACCESS_ADMIN : null);
        queryClient.clear();
        window.location.assign("/dang-nhap");
    }, [queryClient]);

    const refetchUser = useCallback(async () => {
        if (!AUTH_DISABLED) setUser(await authService.me());
        await queryClient.invalidateQueries();
    }, [queryClient]);

    return <AuthContext.Provider value={{ user: user ? { appUser: user } : null, loading, loginPending, logoutPending, login, logout, refetchUser }}>{children}</AuthContext.Provider>;
};
