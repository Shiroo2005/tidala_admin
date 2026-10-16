import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MobileReportList } from "./components/MobileReportList";
import { MobileStudentList } from "./components/MobileStudentList";
import { MobileTeacherList } from "./components/MobileTeacherList";

type UserTab = "students" | "teachers" | "reports";

const TABS: { key: UserTab; label: string }[] = [
  { key: "students", label: "Học viên" },
  { key: "teachers", label: "Giáo viên" },
  { key: "reports", label: "Báo cáo" },
];

/**
 * Mobile-only unified user management page.
 * Combines students, teachers, and pending approvals into one view with tabs.
 */
export const MobileUserManagementPage = () => {
  const [activeTab, setActiveTab] = useState<UserTab>("students");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col w-full">
      {/* Tab Switcher */}
      <div className="flex items-center gap-0 bg-white border-b border-slate-200/60 px-4">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative flex-1 py-3 text-sm font-medium text-center transition-colors duration-200
                ${isActive ? "text-blue-600" : "text-slate-500"}
              `}
            >
              {tab.label}
              {/* Active underline */}
              {isActive && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FiSearch size={18} />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Tìm kiếm theo tên, email"
            className="block w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "students" && (
        <MobileStudentList searchQuery={searchQuery} />
      )}
      {activeTab === "teachers" && (
        <MobileTeacherList searchQuery={searchQuery} />
      )}
      {activeTab === "reports" && (
        <MobileReportList searchQuery={searchQuery} />
      )}
    </div>
  );
};
