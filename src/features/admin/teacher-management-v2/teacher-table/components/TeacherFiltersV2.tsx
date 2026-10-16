import { useState, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { SearchInput } from "@/shared/components/ui/app-input";
import SearchableSelect from "@/shared/components/ui/searchable-select";
import SingleSelect from "@/shared/components/ui/single-select";
import SearchableMultiSelect from "@/shared/components/ui/searchable-multi-select";
import type { SelectOption } from "@/shared/components/ui/searchable-select";
import type { TeacherFilterValues } from "../hooks/useTeacherFilters";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

interface TeacherFiltersV2Props {
  filters: TeacherFilterValues;
  onFilterChange: <K extends keyof TeacherFilterValues>(
    key: K,
    value: TeacherFilterValues[K],
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  /** Training level options from API */
  trainingLevelOptions: SelectOption[];
  /** Province options from API */
  provinceOptions: SelectOption[];
  /** District options from API (filtered by selected province) */
  districtOptions: SelectOption[];
  /** Whether province data is still loading */
  isLoadingProvinces?: boolean;
  /** Whether district data is still loading */
  isLoadingDistricts?: boolean;
}

/* ═══════════════════════════════════════════════════
   STATIC OPTIONS
   ═══════════════════════════════════════════════════ */

const EXPERIENCE_OPTIONS: SelectOption[] = [
  { value: "ONE_TO_THREE", label: "1 – 3 năm" },
  { value: "THREE_TO_FIVE", label: "3 – 5 năm" },
  { value: "FIVE_TO_TEN", label: "5 – 10 năm" },
  { value: "TEN_PLUS", label: "Trên 10 năm" },
];

const CURRENT_STUDENTS_OPTIONS: SelectOption[] = [
  { value: "true", label: "Có" },
  { value: "false", label: "Không" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "INACTIVE", label: "Chưa kích hoạt" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "BANNED", label: "Bị khóa" },
  { value: "DELETED", label: "Đã xóa" },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const TeacherFiltersV2 = ({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  activeFilterCount,
  trainingLevelOptions,
  provinceOptions,
  districtOptions,
}: TeacherFiltersV2Props) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleToggleAdvanced = useCallback(() => {
    setIsAdvancedOpen((prev) => !prev);
  }, []);

  const isDistrictDisabled =
    filters.provinceId === "ALL" || !filters.provinceId;

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


        {/* Province (single) */}
        <div className="w-48">
          <SearchableSelect
            options={provinceOptions}
            value={filters.provinceId === "ALL" ? "" : filters.provinceId}
            onChange={(val) => onFilterChange("provinceId", val || "ALL")}
            placeholder="Tỉnh/Thành phố"
            searchPlaceholder="Tìm tỉnh/thành..."
            clearable
            fullWidth
          />
        </div>

        {/* District (multi, dependent on province) */}
        <div className="w-52">
          <SearchableMultiSelect
            options={districtOptions}
            value={filters.districtIds}
            onChange={(ids) => onFilterChange("districtIds", ids)}
            placeholder={isDistrictDisabled ? "Chọn tỉnh trước" : "Quận/Huyện"}
            searchPlaceholder="Tìm quận/huyện..."
            disabled={isDistrictDisabled}
            clearable
            fullWidth
            maxDisplayTags={1}
          />
        </div>

        {/* Status (multi) */}
        <div className="w-52">
          <SearchableMultiSelect
            options={STATUS_OPTIONS}
            value={filters.statuses}
            onChange={(vals) => onFilterChange("statuses", vals)}
            placeholder="Trạng thái"
            searchPlaceholder="Tìm trạng thái..."
            clearable
            fullWidth
            maxDisplayTags={1}
          />
        </div>

        {/* Advanced toggle button */}
        <button
          type="button"
          onClick={handleToggleAdvanced}
          className={cn(
            "inline-flex h-10 items-center gap-1.5 rounded-xl px-3",
            "text-sm font-medium transition-all duration-200",
            "border",
            isAdvancedOpen
              ? "border-brand/30 bg-brand/5 text-brand"
              : "border-app-border bg-white text-app-text-muted hover:border-app-border-strong hover:text-app-text",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Thêm</span>
          {activeFilterCount > 0 && (
            <span
              className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1",
                "text-[10px] font-bold leading-none",
                "bg-brand text-white",
              )}
            >
              {activeFilterCount}
            </span>
          )}
          {isAdvancedOpen ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* ─── Advanced filters (collapsible) ─── */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isAdvancedOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className={cn(isAdvancedOpen ? "overflow-visible" : "overflow-hidden")}>
          <div className="border-t border-dashed border-app-border/50 px-4 py-3">
            <div className="flex flex-wrap items-end gap-3">
              {/* Training levels (multi) */}
              <div className="w-56">
                <SearchableMultiSelect
                  options={trainingLevelOptions}
                  value={filters.trainingLevelIds}
                  onChange={(ids) => onFilterChange("trainingLevelIds", ids)}
                  placeholder="Hạng xe"
                  searchPlaceholder="Tìm hạng xe..."
                  clearable
                  fullWidth
                  maxDisplayTags={2}
                />
              </div>

              {/* Experience */}
              <div className="w-48">
                <SingleSelect
                  options={EXPERIENCE_OPTIONS}
                  value={filters.experience}
                  onChange={(val) => onFilterChange("experience", val)}
                  placeholder="Kinh nghiệm"
                  label="Kinh nghiệm"
                  clearable
                  fullWidth
                />
              </div>

              {/* Has current students */}
              <div className="w-52">
                <SingleSelect
                  options={CURRENT_STUDENTS_OPTIONS}
                  value={filters.hasCurrentStudents}
                  onChange={(val) => onFilterChange("hasCurrentStudents", val)}
                  placeholder="Đang nhận học viên"
                  label="Đang nhận học viên"
                  clearable
                  fullWidth
                />
              </div>
            </div>
          </div>
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

export default TeacherFiltersV2;
