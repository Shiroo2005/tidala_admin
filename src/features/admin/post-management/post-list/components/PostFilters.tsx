import { Search, RotateCcw } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { SearchInput } from "@/shared/components/ui/app-input";
import SingleSelect from "@/shared/components/ui/single-select";
import type { PostType } from "@/shared/types/post.type";

interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: "ALL" | PostType;
  onTypeFilterChange: (value: "ALL" | PostType) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export const PostFilters = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onReset,
  hasActiveFilters,
  activeFilterCount,
}: PostFiltersProps) => {
  const typeOptions = [
    { value: "ALL", label: "Tất cả" },
    { value: "KNOWLEDGE", label: "Kiến thức" },
    { value: "Q_AND_A", label: "Q&A" },
    { value: "NEWS", label: "Tin tức" },
    { value: "EXPERIENCE", label: "Kinh nghiệm" },
  ];

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-app-border/60 bg-white shadow-sm">
      {/* ─── Primary filter bar ─── */}
      <div className="flex flex-wrap items-end gap-3 p-4 pb-3">
        {/* Search */}
        <div className="min-w-[260px] flex-1">
          <SearchInput
            placeholder="Tìm kiếm theo nội dung hoặc tác giả..."
            value={searchTerm}
            onSearch={onSearchChange}
            inputSize="md"
            variant="default"
          />
        </div>

        {/* Type filter (single-select) */}
        <div className="w-60">
          <SingleSelect
            options={typeOptions}
            value={typeFilter}
            onChange={(val) =>
              onTypeFilterChange((val || "ALL") as "ALL" | PostType)
            }
            placeholder="Loại bài đăng"
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
              {searchTerm && (
                <span>
                  Tìm: "
                  <span className="font-medium text-app-text">
                    {searchTerm}
                  </span>
                  "
                </span>
              )}
              {searchTerm && activeFilterCount > 0 && " · "}
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
              "hover:bg-app-surface hover:text-app-error cursor-pointer",
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

export default PostFilters;
