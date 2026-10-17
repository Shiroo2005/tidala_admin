import type { TrainingLevel } from "@/shared/types/common.type";
import { Layers, Pencil, Trash2 } from "lucide-react";
import { AdminTable, type ColumnDef } from "@/shared/components/admin-table";
import { useMemo } from "react";

interface Props {
  levels: TrainingLevel[];
  isLoading: boolean;
  onEdit?: (level: TrainingLevel) => void;
  onDelete?: (level: TrainingLevel) => void;
}

export const TrainingLevelList = ({
  levels,
  isLoading,
  onEdit,
  onDelete,
}: Props) => {
  const columns = useMemo<ColumnDef<TrainingLevel, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên hạng",
        enableSorting: false,
        size: 200,
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-app-text">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-app-text-muted">
            {(getValue() as string) || "—"}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span
            className="text-sm text-app-text-muted max-w-[360px] truncate block"
            title={getValue() as string}
          >
            {(getValue() as string) || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        size: 100,
        cell: ({ row }) => {
          const level = row.original;
          return (
            <div
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/80 text-slate-600 transition-all duration-200 hover:bg-slate-700 hover:text-white cursor-pointer outline-none"
                title="Chỉnh sửa"
                onClick={() => onEdit?.(level)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50/80 text-rose-600 transition-all duration-200 hover:bg-rose-600 hover:text-white cursor-pointer outline-none"
                title="Xóa"
                onClick={() => onDelete?.(level)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-app-text-muted">
      <div className="w-14 h-14 rounded-full bg-app-surface/60 flex items-center justify-center mb-2">
        <Layers className="h-6 w-6 text-app-text-muted" />
      </div>
      <p className="text-sm font-semibold text-app-text">Chưa có hạng đào tạo nào</p>
      <p className="text-xs text-app-text-muted">Dữ liệu hạng đào tạo sẽ hiển thị tại đây khi có sẵn</p>
    </div>
  );

  return (
    <div className="flex flex-col">
      <AdminTable
        columns={columns}
        data={levels}
        isLoading={isLoading}
        emptyState={emptyState}
        hidePagination
        getRowId={(row) => row.id}
      />
      
      {/* Footer summary */}
      {!isLoading && levels.length > 0 && (
        <div className="flex justify-end items-center p-4 border-t border-app-border/40 text-sm text-app-text-muted">
          Tổng cộng: <span className="font-semibold text-app-text ml-1">{levels.length}</span> hạng đào tạo
        </div>
      )}
    </div>
  );
};
