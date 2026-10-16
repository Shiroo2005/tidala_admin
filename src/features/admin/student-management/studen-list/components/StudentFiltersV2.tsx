import {
  Search,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { SearchInput } from "@/shared/components/ui/app-input";
import SingleSelect from "@/shared/components/ui/single-select";
import type { SelectOption } from "@/shared/components/ui/searchable-select";
import type { StudentFilterValues } from "../hooks/useStudentFilters";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

interface StudentFiltersV2Props {
  filters: StudentFilterValues;
  onFilterChange: <K extends keyof StudentFilterValues>(
    key: K,
    value: StudentFilterValues[K],
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

/* ═══════════════════════════════════════════════════
   STATIC OPTIONS
   ═══════════════════════════════════════════════════ */

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Không hoạt động" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "BANNED", label: "Bị khóa" },
  { value: "DELETED", label: "Đã xóa" },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const StudentFiltersV2 = ({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  activeFilterCount,
}: StudentFiltersV2Props) => {
  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-app-border/60 bg-white shadow-sm">
      {/* ─── Primary filter bar ─── */}
      <div className="flex flex-wrap items-end gap-3 p-4 pb-3">
        {/* Search */}
        <div className="min-w-[260px] flex-1">
          <SearchInput
            placeholder="Tìm kiếm tên, email, SĐT..."
            value={filters.search}
            onSearch={(query) => onFilterChange("search", query)}
            inputSize="md"
            variant="default"
          />
        </div>

        {/* Status (single) */}
        <div className="w-52">
          <SingleSelect
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(val) => onFilterChange("status", (val || "all") as "all" | "ACTIVE" | "INACTIVE" | "DRAFT" | "BANNED" | "DELETED")}
            placeholder="Trạng thái"
            clearable={false}
            fullWidth
          />
        </div>
      </div>

      {/* ─── Active filters summary bar ─── */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between border-t border-app-border/40 px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-app-text-muted">
            <Search className="h-3.5 w-3.5" />
            <span>
              {filters.search && (
                <span>
                  Tìm: "
                  <span className="font-medium text-app-text">
                    {filters.search}
                  </span>
                  "
                </span>
              )}
              {filters.search && activeFilterCount > 0 && " · "}
              {activeFilterCount > 0 && (
                <span>{activeFilterCount} bộ lọc đang áp dụng</span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={onReset}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1",
              "text-xs font-medium text-app-text-muted",
              "transition-all duration-200",
              "hover:bg-app-surface hover:text-app-error",
            )}
          >
            <RotateCcw className="h-3 w-3" />
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentFiltersV2;
