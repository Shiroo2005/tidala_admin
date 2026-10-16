import { FiBarChart2, FiStar, FiUser, FiUsers } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/appPaths";

type NavTab = {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
};

const NAV_TABS: NavTab[] = [
  {
    key: "stats",
    label: "Thống kê",
    icon: FiBarChart2,
    path: APP_PATHS.ADMIN_DASHBOARD,
  },
  {
    key: "users",
    label: "Người dùng",
    icon: FiUsers,
    path: APP_PATHS.ADMIN_USERS,
  },
  {
    key: "reviews",
    label: "Đánh giá",
    icon: FiStar,
    path: APP_PATHS.ADMIN_REVIEWS,
  },
  {
    key: "profile",
    label: "Cá nhân",
    icon: FiUser,
    path: APP_PATHS.ADMIN_PROFILE,
  },
];

export const AdminMobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabPress = (tab: NavTab) => {
    // Don't navigate if already on this tab's path
    if (location.pathname === tab.path) return;
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/60 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.key}
              onClick={() => handleTabPress(tab)}
              className={`
                flex flex-col items-center justify-center gap-0.5 flex-1 h-full
                transition-colors duration-200 relative
                ${isActive ? "text-blue-600" : "text-slate-400"}
              `}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-blue-600" />
              )}

              <Icon
                size={22}
                className={`transition-transform duration-200 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span
                className={`text-[11px] leading-tight ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export { NAV_TABS };
export type { NavTab };
