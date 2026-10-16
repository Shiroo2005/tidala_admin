import type { Post, PostType } from "@/shared/types/post.type";
import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { List, LayoutGrid } from "lucide-react";
import { useSearchAdminPosts } from "../hooks/useSearchAdminPosts";
import { DeletePostDialog } from "./deletePostDialog";
import { PostCardView } from "./PostCardView";
import { PostListView } from "./PostListView";
import { PostFilters } from "./PostFilters";
import type { SortField } from "@/shared/components/admin-table";
import {
  useTableQueryState,
  parseNumber,
  serializeNumber,
  parseString,
  serializeString,
  parseSortFields,
  serializeSortFields,
} from "@/shared/hooks/useTableQueryState";

export type ViewMode = "list" | "card";

const STORAGE_KEY = "admin_post_view_mode";

const getInitialViewMode = (): ViewMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "list" || saved === "card") return saved;
  } catch {
    // noop
  }
  return "list";
};

// ── URL param schema for post management ──────────────────────────────────
const POST_TABLE_SCHEMA = {
  page: {
    key: "p",
    default: 1,
    parse: parseNumber,
    serialize: serializeNumber,
  },
  pageSize: {
    key: "size",
    default: 10,
    parse: parseNumber,
    serialize: serializeNumber,
  },
  search: {
    key: "q",
    default: "",
    parse: parseString,
    serialize: serializeString,
  },
  typeFilter: {
    key: "type",
    default: "ALL",
    parse: parseString,
    serialize: serializeString,
  },
  sorting: {
    key: "sort",
    default: [{ id: "createdAt", desc: true }] as SortField[],
    parse: parseSortFields as (raw: string) => SortField[],
    serialize: serializeSortFields as (v: SortField[]) => string,
  },
} as const;

export const PostManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  // Raw search input (not yet debounced) — kept in local state for
  // responsive input feel; the debounced value is what goes into the URL.
  const [searchInput, setSearchInput] = useState("");

  // ── URL-backed state ──
  const [params, setParam, resetParams] = useTableQueryState(POST_TABLE_SCHEMA);
  const { page, pageSize, search: debouncedSearch, typeFilter, sorting } =
    params;

  // Initialise search input from URL on mount
  useEffect(() => {
    setSearchInput(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run only once

  // Debounce: push search term to URL after 400 ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      // Only update URL when value actually changed to avoid spurious history entries
      if (trimmed !== debouncedSearch) {
        setParam({ search: trimmed });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Map sorting state to API format
  const sortParams = useMemo(
    () => sorting.map((s) => `${s.id},${s.desc ? "desc" : "asc"}`),
    [sorting],
  );

  const handleTypeFilterChange = useCallback(
    (val: PostType | "ALL") => {
      setParam({ typeFilter: val });
    },
    [setParam],
  );

  const { data: postsData, isLoading } = useSearchAdminPosts({
    keyword: debouncedSearch,
    postTypes: typeFilter !== "ALL" ? typeFilter : "",
    page,
    size: pageSize,
    sort: sortParams.length > 0 ? sortParams : ["createdAt,desc"],
  });

  const posts = useMemo(() => postsData?.content || [], [postsData?.content]);
  const totalPages = postsData?.totalPages || 1;
  const totalRows = postsData?.totalElements || 0;

  // Persist view mode to localStorage (not URL — it's a display preference)
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // noop
    }
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== "ALL") count++;
    return count;
  }, [typeFilter]);

  const hasActiveFilters = useMemo(
    () => !!searchInput || activeFilterCount > 0,
    [searchInput, activeFilterCount],
  );

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    resetParams();
  }, [resetParams]);

  const handleSearchChange = useCallback((val: string) => {
    setSearchInput(val);
  }, []);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Breadcrumb */}
      <div>
        <AdminBreadcrumbs />
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Quản lý bài đăng</h1>
          <p className="text-sm text-app-text-muted mt-1">
            Tìm kiếm, kiểm duyệt và quản lý bài đăng trên hệ thống
          </p>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => handleViewModeChange("list")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                viewMode === "list"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/70 hover:shadow-sm hover:scale-[1.02]"
              }
            `}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Danh sách</span>
          </button>

          <button
            onClick={() => handleViewModeChange("card")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                viewMode === "card"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/70 hover:shadow-sm hover:scale-[1.02]"
              }
            `}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Thẻ</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div>
        <PostFilters
          searchTerm={searchInput}
          onSearchChange={handleSearchChange}
          typeFilter={typeFilter as PostType | "ALL"}
          onTypeFilterChange={handleTypeFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {viewMode === "list" ? (
          <PostListView
            posts={posts}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
            totalRows={totalRows}
            onPageChange={(p) => setParam({ page: p }, { preservePage: true })}
            onPageSizeChange={(size) => setParam({ pageSize: size, page: 1 }, { preservePage: true })}
            sorting={sorting}
            onSortChange={(s) => setParam({ sorting: s })}
            onDelete={(post) => setDeletingPost(post)}
          />
        ) : (
          <PostCardView
            posts={posts}
            page={page}
            totalPages={totalPages}
            rowsPerPage={pageSize}
            onPageChange={(p) => setParam({ page: p }, { preservePage: true })}
            onRowsPerPageChange={(size) => setParam({ pageSize: size, page: 1 }, { preservePage: true })}
            onDelete={(post) => setDeletingPost(post)}
          />
        )}
      </div>

      {/* Delete Dialog */}
      <DeletePostDialog
        open={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        post={deletingPost}
      />
    </div>
  );
};

export default PostManagement;
