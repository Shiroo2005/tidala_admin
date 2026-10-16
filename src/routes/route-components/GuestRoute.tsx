import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/providers";
import { APP_PATHS } from "@/shared/constants/appPaths";
import type { ReactNode } from "react";

export function GuestRoute({ children }: { children?: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user?.appUser) {
    return <Navigate to={APP_PATHS.ADMIN_DASHBOARD} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
