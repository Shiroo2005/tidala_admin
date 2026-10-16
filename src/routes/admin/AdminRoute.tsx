import { useAuth } from "@/features/auth/providers/useAuth";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { Navigate, Outlet } from "react-router-dom";
import NotFoundPage from "@/pages/error/NotFoundPage";

export const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={APP_PATHS.LOGIN} replace />;
  }

  if (user.appUser.role !== "ADMIN") {
    return <NotFoundPage />;
  }

  return children ? <>{children}</> : <Outlet />;
};
