import type { Tag } from "@/shared/types/tag.type";
import { Hash, Pencil, Trash2 } from "lucide-react";
import { AdminTable, type ColumnDef } from "@/shared/components/admin-table";
import { useMemo } from "react";

interface Props {
  tags: Tag[];
  isLoading: boolean;
  onEdit?: (tag: Tag) => void;
  onDelete?: (tag: Tag) => void;
}

const getTagTypeStyle = (type: string) => {
  switch (type) {
    case "specialty":
      return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200/50", label: "Chuyên môn" };
    case "style":
      return { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200/50", label: "Phong cách" };
    default:
      return { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200/50", label: type };
  }
};

export const TagList = ({ tags, isLoading, onEdit, onDelete }: Props) => {
  const columns = useMemo<ColumnDef<Tag, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Thẻ",
        enableSorting: false,
        size: 250,
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-app-text">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Loại",
        enableSorting: false,
        cell: ({ getValue }) => {
          const type = (getValue() as string) || "";
          const style = getTagTypeStyle(type);
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}
            >
              {style.label}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        size: 100,
        cell: ({ row }) => {
          const tag = row.original;
          return (
            <div
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/80 text-slate-600 transition-all duration-200 hover:bg-slate-700 hover:text-white cursor-pointer outline-none"
                title="Chỉnh sửa"
                onClick={() => onEdit?.(tag)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50/80 text-rose-600 transition-all duration-200 hover:bg-rose-600 hover:text-white cursor-pointer outline-none"
                title="Xóa"
                onClick={() => onDelete?.(tag)}
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
        <Hash className="h-6 w-6 text-app-text-muted" />
      </div>
      <p className="text-sm font-semibold text-app-text">Chưa có thẻ nào</p>
      <p className="text-xs text-app-text-muted">Dữ liệu thẻ sẽ hiển thị tại đây khi có sẵn</p>
    </div>
  );

  return (
    <div className="flex flex-col">
      <AdminTable
        columns={columns}
        data={tags}
        isLoading={isLoading}
        emptyState={emptyState}
        hidePagination
        getRowId={(row) => row.id}
      />
      
      {/* Footer summary */}
      {!isLoading && tags.length > 0 && (
        <div className="flex justify-end items-center p-4 border-t border-app-border/40 text-sm text-app-text-muted">
          Tổng cộng: <span className="font-semibold text-app-text ml-1">{tags.length}</span> thẻ
        </div>
      )}
    </div>
  );
};
