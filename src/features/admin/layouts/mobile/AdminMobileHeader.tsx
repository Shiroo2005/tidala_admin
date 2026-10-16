import { useLocation } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/appPaths";

const ROUTE_TITLES: Record<string, string> = {
  [APP_PATHS.ADMIN_DASHBOARD]: "Thống kê",
  [APP_PATHS.ADMIN_USERS]: "Quản lí người dùng",
  [APP_PATHS.ADMIN_REVIEWS]: "Đánh giá",
  [APP_PATHS.ADMIN_PROFILE]: "Cá nhân",
};

/**
 * Resolves the header title from the current pathname.
 * Uses startsWith matching so nested routes (e.g. /admin/users/123) inherit the parent title.
 */
const getTitleFromPath = (pathname: string): string => {
  const match = Object.entries(ROUTE_TITLES)
    .sort(([a], [b]) => b.length - a.length) // longest prefix first
    .find(([path]) => pathname.startsWith(path));

  return match?.[1] ?? "Admin";
};

type AdminMobileHeaderProps = {
  title?: string;
};

export const AdminMobileHeader = ({ title }: AdminMobileHeaderProps) => {
  const location = useLocation();
  const displayTitle = title ?? getTitleFromPath(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/60 safe-area-top">
      <div className="flex items-center justify-center h-14 px-4">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          {displayTitle}
        </h1>
      </div>
    </header>
  );
};
