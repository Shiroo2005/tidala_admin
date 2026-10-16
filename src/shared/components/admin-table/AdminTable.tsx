import { useMemo, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import SingleSelect from "@/shared/components/ui/single-select";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export interface SortField {
  id: string;
  desc: boolean;
}

export interface AdminTableProps<TData> {
  /** Column definitions — use `createColumnHelper` or `ColumnDef` from TanStack */
  columns: ColumnDef<TData, unknown>[];

  /** Row data array */
  data: TData[];

  /** ── Server-side sorting ── */
  sorting?: SortField[];
  onSortChange?: (sorting: SortField[]) => void;

  /** ── Server-side pagination ── */
  currentPage?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  /** Available page sizes */
  pageSizeOptions?: number[];

  /** Option to hide the pagination footer entirely */
  hidePagination?: boolean;

  /** Loading skeleton state */
  isLoading?: boolean;

  /** Number of skeleton rows to render */
  skeletonRowCount?: number;

  /** Custom empty-state UI */
  emptyState?: ReactNode;

  /** Optional wrapper className */
  className?: string;

  /** Optional unique row key accessor */
  getRowId?: (row: TData) => string;

  /** Callback when a data row is clicked (e.g. navigate to detail page) */
  onRowClick?: (row: TData) => void;

  /** Optional per-row className, receives the row data */
  getRowClassName?: (row: TData) => string;
}

/* ═══════════════════════════════════════════════════
   PAGE RANGE UTIL
   ═══════════════════════════════════════════════════ */

function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis");
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  // Always show last page
  pages.push(total);

  return pages;
}

/* ═══════════════════════════════════════════════════
   SKELETON ROW
   ═══════════════════════════════════════════════════ */

function SkeletonRow({ colCount }: { colCount: number }) {
  return (
    <tr className="border-b border-app-border/40">
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded bg-app-surface-strong/60" />
        </td>
      ))}
    </tr>
  );
}

/* ═══════════════════════════════════════════════════
   DEFAULT EMPTY STATE
   ═══════════════════════════════════════════════════ */

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-app-text-muted">
      <svg
        className="h-12 w-12 opacity-40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="text-sm font-medium">Không có dữ liệu</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN TABLE COMPONENT
   ═══════════════════════════════════════════════════ */

export default function AdminTable<TData>({
  columns,
  data,
  sorting = [],
  onSortChange,
  currentPage,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  isLoading = false,
  skeletonRowCount = 5,
  emptyState,
  className,
  getRowId,
  onRowClick,
  getRowClassName,
  hidePagination = false,
}: AdminTableProps<TData>) {
  "use no memo";

  // Provide defaults for pagination
  const finalCurrentPage = currentPage ?? 1;
  const finalPageSize = pageSize ?? (data.length || 10);
  const finalTotalRows = totalRows ?? data.length;

  /* ── Map SortField[] → TanStack SortingState ── */
  const tanstackSorting: SortingState = useMemo(
    () => sorting.map((s) => ({ id: s.id, desc: s.desc })),
    [sorting],
  );

  /* ── Table instance (manual everything) ── */
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting: tanstackSorting },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(tanstackSorting) : updater;
      onSortChange?.(next.map((s) => ({ id: s.id, desc: s.desc })));
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.ceil(finalTotalRows / finalPageSize),
    getRowId,
  });

  /* ── Derived values ── */
  const totalPages = Math.max(1, Math.ceil(finalTotalRows / finalPageSize));
  const startRow =
    finalTotalRows === 0 ? 0 : (finalCurrentPage - 1) * finalPageSize + 1;
  const endRow = Math.min(finalCurrentPage * finalPageSize, finalTotalRows);
  const pageRange = getPageRange(finalCurrentPage, totalPages);
  const isEmpty = !isLoading && data.length === 0;

  /* ── Handlers ── */
  const handleSortToggle = (columnId: string) => {
    if (!onSortChange) return;

    const existing = sorting.find((s) => s.id === columnId);
    if (!existing) {
      // Not sorted → sort asc
      onSortChange([{ id: columnId, desc: false }]);
    } else if (!existing.desc) {
      // Asc → desc
      onSortChange([{ id: columnId, desc: true }]);
    } else {
      // Desc → remove sort
      onSortChange(sorting.filter((s) => s.id !== columnId));
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-app-border/50 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          {/* ── Header ── */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-app-border/50 bg-app-surface/60"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortState = sorting.find(
                    (s) => s.id === header.column.id,
                  );

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-app-text-muted",
                        canSort && "cursor-pointer select-none",
                      )}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                      onClick={() => {
                        if (canSort) handleSortToggle(header.column.id);
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort && (
                          <span className="inline-flex text-app-text-muted/60">
                            {!sortState && (
                              <ArrowUpDown className="h-3.5 w-3.5" />
                            )}
                            {sortState && !sortState.desc && (
                              <ArrowUp className="h-3.5 w-3.5 text-brand" />
                            )}
                            {sortState && sortState.desc && (
                              <ArrowDown className="h-3.5 w-3.5 text-brand" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* ── Body ── */}
          <tbody>
            {/* Loading skeleton */}
            {isLoading &&
              Array.from({ length: skeletonRowCount }).map((_, i) => (
                <SkeletonRow key={`skeleton-${i}`} colCount={columns.length} />
              ))}

            {/* Empty state */}
            {isEmpty && (
              <tr>
                <td colSpan={columns.length}>
                  {emptyState ?? <DefaultEmptyState />}
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-app-border/30 transition-all duration-200",
                    onRowClick
                      ? "cursor-pointer hover:bg-brand/5 hover:shadow-[inset_3px_0_0_0] hover:shadow-brand/60"
                      : "hover:bg-app-surface/40",
                    getRowClassName?.(row.original),
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-app-text">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ── */}
      {!hidePagination && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Result count text */}
          <p className="text-sm text-app-text-muted">
            Hiển thị{" "}
            <span className="font-semibold text-app-text">
              {startRow}–{endRow}
            </span>{" "}
            /{" "}
            <span className="font-semibold text-app-text">
              {finalTotalRows}
            </span>{" "}
            kết quả
          </p>

          {/* Page controls */}
          <div className="flex items-center gap-2">
            {/* Page size selector */}
            <div className="flex items-center gap-1.5 text-sm text-app-text-muted">
              <span>Hiển thị</span>
              <SingleSelect
                options={pageSizeOptions.map((size) => ({
                  value: String(size),
                  label: String(size),
                }))}
                value={String(finalPageSize)}
                onChange={(val) => onPageSizeChange?.(Number(val))}
                className="h-8 w-20! rounded-lg!"
                containerClassName="!w-20"
              />
              <span>/ trang</span>
            </div>

            {/* Divider */}
            <div className="mx-1 h-5 w-px bg-app-border/50" />

            {/* Prev button */}
            <button
              type="button"
              disabled={finalCurrentPage <= 1}
              onClick={() => onPageChange?.(finalCurrentPage - 1)}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-app-border/60 text-app-text-muted transition-all duration-150",
                finalCurrentPage <= 1
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:border-brand hover:bg-brand/5 hover:text-brand",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {pageRange.map((page, i) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="inline-flex h-8 w-8 items-center justify-center text-sm text-app-text-muted"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange?.(page)}
                  className={cn(
                    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150",
                    page === finalCurrentPage
                      ? "border-brand bg-brand text-white shadow-sm"
                      : "border-app-border/60 text-app-text-muted cursor-pointer hover:border-brand hover:bg-brand/5 hover:text-brand",
                  )}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next button */}
            <button
              type="button"
              disabled={finalCurrentPage >= totalPages}
              onClick={() => onPageChange?.(finalCurrentPage + 1)}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-app-border/60 text-app-text-muted transition-all duration-150",
                finalCurrentPage >= totalPages
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:border-brand hover:bg-brand/5 hover:text-brand",
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
