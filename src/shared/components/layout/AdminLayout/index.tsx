import { imageUrls } from "@/shared/constants/imageUrls";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useAuth } from "@/features/auth/providers/useAuth";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { getStorageUrl } from "@/shared/utils/url";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import {
  FiAlertTriangle,
  FiDatabase,
  FiGrid,
  FiMessageSquare,
  // FiSettings,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import Footer from "./Footer";
import Navbar from "./Navbar";

const navigation = [
  { name: "Tổng quan", path: APP_PATHS.ADMIN_DASHBOARD, icon: FiGrid },
  { name: "Quản lý Giáo viên", path: APP_PATHS.ADMIN_TEACHERS, icon: FiShield },
  { name: "Quản lý Học sinh", path: APP_PATHS.ADMIN_STUDENTS, icon: FiUsers },
  {
    name: "Thẻ & Hạng đào tạo",
    path: APP_PATHS.ADMIN_METADATA,
    icon: FiDatabase,
  },
  {
    name: "Quản lý Bài đăng",
    path: APP_PATHS.ADMIN_POSTS,
    icon: FiMessageSquare,
  },
  {
    name: "Xử lý Báo cáo",
    path: APP_PATHS.ADMIN_REPORTS,
    icon: FiAlertTriangle,
  },
  // { name: "Cài đặt & Vai trò", path: "/admin/settings", icon: FiSettings },
];

export const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationType = useNavigationType();

  // --- Scroll position restoration ---
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const currentPathname = useRef(location.pathname);

  // Continuously save scroll position on scroll so it's always up-to-date
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      scrollPositions.current.set(currentPathname.current, el.scrollTop);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle scroll on route change
  useEffect(() => {
    if (currentPathname.current !== location.pathname) {
      currentPathname.current = location.pathname;

      if (navigationType === "POP") {
        // Browser back/forward → restore saved scroll position
        const saved = scrollPositions.current.get(location.pathname);
        if (saved !== undefined && saved > 0) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (mainRef.current) {
                mainRef.current.scrollTo(0, saved);
              }
            });
          });
        }
      } else {
        // PUSH or REPLACE → always scroll to top (new page)
        if (mainRef.current) {
          mainRef.current.scrollTo(0, 0);
        }
      }
    }
  }, [location.pathname, navigationType]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const getIsMobile = () => window.innerWidth < 1024;

  const [isMobile, setIsMobile] = useState(getIsMobile());
  const [sidebarOpen, setSidebarOpen] = useState(!getIsMobile());

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const appUser = user?.appUser;

  return (
    <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden selection:bg-primary/20">
      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          onClick={closeSidebarOnMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200/70 transition-all duration-300 ease-in-out flex flex-col fixed lg:relative h-full z-50 overflow-hidden
        ${
          isMobile
            ? sidebarOpen
              ? "w-72"
              : "w-0"
            : sidebarOpen
              ? "w-72"
              : "w-[72px]"
        }
        ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
      `}
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <Link
            to={APP_PATHS.ADMIN_DASHBOARD}
            className={`flex items-center space-x-3 overflow-hidden transition-all duration-300 hover:opacity-90 ${!sidebarOpen && !isMobile ? "w-0 opacity-0" : "w-full opacity-100"}`}
          >
            <img
              src={imageUrls.logo.tidala}
              alt="TIDALA"
              className="w-10 h-10 object-contain shrink-0 drop-shadow-sm hover:scale-105 transition-transform duration-200"
            />
            <h3 className="font-extrabold text-xl bg-clip-text text-transparent bg-linear-to-br from-blue-700 via-blue-500 to-cyan-400 whitespace-nowrap tracking-wide">
              TIDALA Admin
            </h3>
          </Link>

          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all duration-200 flex items-center justify-center  lg:flex ${
              !sidebarOpen ? "w-full" : "shrink-0"
            }`}
          >
            {!sidebarOpen ? (
              <BiChevronRight size={20} />
            ) : (
              <BiChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-0.5 custom-scrollbar">
          {/* Section Label */}
          <div
            className={`mb-3 px-3 transition-all duration-300 ${
              sidebarOpen
                ? "opacity-100"
                : "opacity-0 lg:opacity-100 text-center"
            }`}
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em]">
              {sidebarOpen ? "Quản lý" : "•••"}
            </span>
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebarOnMobile}
                title={!sidebarOpen ? item.name : undefined}
                className={`group relative flex items-center rounded-xl transition-all duration-200 overflow-hidden
                ${
                  isActive
                    ? "bg-brand/[0.08] text-brand shadow-sm shadow-brand/5"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }
                ${sidebarOpen ? "px-3 py-2.5 gap-3" : "px-0 py-2.5 justify-center"}
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-brand rounded-r-full" />
                )}

                {/* Icon container */}
                <div
                  className={`shrink-0 flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "text-brand"
                      : "text-slate-400 group-hover:text-slate-700"
                  } ${sidebarOpen ? "" : "w-full"}`}
                >
                  <Icon
                    size={20}
                    className={`transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-105"
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`whitespace-nowrap text-[13.5px] font-medium transition-all duration-300 ${
                    !sidebarOpen
                      ? "w-0 opacity-0 hidden"
                      : "w-auto opacity-100 block"
                  }`}
                >
                  {item.name}
                </span>

                {/* Hover tooltip for collapsed sidebar */}
                {!sidebarOpen && !isMobile && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer — User Card */}
        <div className="p-3 border-t border-slate-100 mt-auto">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-50/50 rounded-xl border border-slate-100/80 hover:border-slate-200 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-slate-200 ring-2 ring-white shadow-sm shrink-0 overflow-hidden">
                <img
                  src={getStorageUrl(appUser?.avatarUrl) || imageUrls.fallback.avatar}
                  alt={appUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden flex-1">
                <p
                  className="text-sm font-semibold text-slate-800 truncate leading-tight"
                  title={appUser?.fullName}
                >
                  {appUser?.fullName}
                </p>
                <p
                  className="text-[11px] text-slate-400 truncate leading-tight mt-0.5"
                  title={appUser?.email}
                >
                  {appUser?.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="group relative flex justify-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-slate-200 ring-2 ring-white shadow-sm shrink-0 overflow-hidden cursor-pointer hover:ring-brand/30 transition-all duration-200">
                <img
                  src={getStorageUrl(appUser?.avatarUrl) || imageUrls.fallback.avatar}
                  alt={appUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Tooltip for collapsed */}
              {!isMobile && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {appUser?.fullName}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* The scrolling container */}
        <main
          ref={mainRef}
          id="admin-main-content"
          className="flex-1 overflow-x-hidden overflow-y-auto"
        >
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
