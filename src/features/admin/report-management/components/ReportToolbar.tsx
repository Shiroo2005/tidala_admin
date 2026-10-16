import { FiGrid, FiList } from "react-icons/fi";
import { getReportReasonsByType, type ReportReasonId } from "../constants/report-reasons";
import type { StatusFilter } from "../hooks/useReportFilters";
import { SearchInput } from "@/shared/components/ui/app-input";
import SingleSelect from "@/shared/components/ui/single-select";

export type ViewMode = "table" | "card";

interface ReportToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  reasonFilter: ReportReasonId | "all";
  onReasonFilterChange: (value: ReportReasonId | "all") => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  activeTab: "teacher" | "post" | "review";
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "reviewing", label: "Đang xem xét" },
  { value: "resolved", label: "Đã xử lý" },
  { value: "rejected", label: "Đã bỏ qua" },
];

export const ReportToolbar = ({
  searchQuery,
  onSearchChange,
  reasonFilter,
  onReasonFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
  activeTab,
}: ReportToolbarProps) => {
  const currentReasons = getReportReasonsByType(activeTab);
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
      {/* Left: Search + Filter */}
      <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
        {/* Search */}
        <SearchInput
          value={searchQuery}
          onSearch={onSearchChange}
          placeholder="Tìm theo tên giáo viên, người báo cáo..."
          containerClassName="flex-1 max-w-sm"
          variant="default"
          inputSize="md"
        />

        {/* Reason Filter */}
        <SingleSelect
          value={reasonFilter}
          onChange={(val) => onReasonFilterChange(val as ReportReasonId | "all")}
          options={[
            { value: "all", label: "Tất cả lý do" },
            ...currentReasons.map((reason) => ({
              value: reason.id,
              label: reason.label,
            })),
          ]}
          containerClassName="w-48 shrink-0"
        />

        {/* Status Filter */}
        <SingleSelect
          value={statusFilter}
          onChange={(val) => onStatusFilterChange(val as StatusFilter)}
          options={STATUS_OPTIONS}
          containerClassName="w-48 shrink-0"
        />
      </div>

      {/* Right: Count + View Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {totalCount} báo cáo
        </span>

        {/* View Toggle */}
        <div className="inline-flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => onViewModeChange("table")}
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
              viewMode === "table"
                ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/60"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Dạng bảng"
          >
            <FiList size={16} />
          </button>
          <button
            onClick={() => onViewModeChange("card")}
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
              viewMode === "card"
                ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/60"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Dạng thẻ"
          >
            <FiGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
