import { useState } from "react";
import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import { FiSettings, FiShield, FiBell, FiLock } from "react-icons/fi";
import { GeneralSettings } from "./GeneralSettings";
import { RoleManagement } from "./RoleManagement";
import { NotificationSettings } from "./NotificationSettings";
import { SecuritySettings } from "./SecuritySettings";

const TABS = [
  {
    id: "general" as const,
    label: "Cài đặt chung",
    icon: FiSettings,
    description: "Thông tin cơ bản của hệ thống",
  },
  {
    id: "roles" as const,
    label: "Vai trò & Phân quyền",
    icon: FiShield,
    description: "Quản lý vai trò người dùng",
  },
  {
    id: "notifications" as const,
    label: "Thông báo",
    icon: FiBell,
    description: "Cấu hình thông báo hệ thống",
  },
  {
    id: "security" as const,
    label: "Bảo mật",
    icon: FiLock,
    description: "Chính sách bảo mật & xác thực",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const ActiveContent = (() => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "roles":
        return <RoleManagement />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
    }
  })();

  return (
    <div className="p-6">
      <AdminBreadcrumbs />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-app-text">Cài đặt & Vai trò</h1>
        <p className="text-sm text-app-text-muted mt-1">
          Quản lý cấu hình hệ thống, phân quyền và thiết lập bảo mật
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 whitespace-nowrap lg:whitespace-normal min-w-max lg:min-w-0 w-full cursor-pointer ${
                    isActive
                      ? "bg-brand/[0.08] text-brand shadow-sm shadow-brand/5"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-brand rounded-r-full hidden lg:block" />
                  )}
                  <div
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200/70 group-hover:text-slate-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="hidden lg:block overflow-hidden">
                    <span
                      className={`block text-sm font-semibold ${
                        isActive ? "text-brand" : "text-slate-700"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span className="block text-[11px] text-slate-400 truncate">
                      {tab.description}
                    </span>
                  </div>
                  {/* Mobile label */}
                  <span className="lg:hidden text-sm font-medium">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">{ActiveContent}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
