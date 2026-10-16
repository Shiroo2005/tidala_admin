import type { ColumnDef } from "@/shared/components/admin-table";
import type { AccountModerationTarget } from "@/features/admin/account-moderation/components/AccountModerationDialog";
import type { AdminStudentDetail } from "@/features/admin/student-management/types";
import {
  formatSuspensionDateTime,
  isSuspensionActive,
} from "@/features/admin/teacher-management-v2/utils/suspension";
import { getStorageUrl } from "@/shared/utils/url";
import { getStatusStyle } from "@/features/admin/teacher-management-v2/teacher-table/utils";
import { StudentRowActions } from "./StudentRowActions";

interface StudentColumnActions {
  onWarnAccount: (target: AccountModerationTarget) => void;
  onBlockAccount: (target: AccountModerationTarget) => void;
  onRevokeSanction: (target: AccountModerationTarget) => void;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Column definitions for Student table (v2)
 */
export const createStudentColumns = ({
  onWarnAccount,
  onBlockAccount,
  onRevokeSanction,
}: StudentColumnActions): ColumnDef<AdminStudentDetail, unknown>[] => [
  {
    accessorKey: "fullName",
    header: "Học sinh",
    enableSorting: false,
    size: 320,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          {getStorageUrl(student.avatarUrl) ? (
            <img
              src={getStorageUrl(student.avatarUrl)}
              alt={student.fullName}
              className="h-9 w-9 shrink-0 rounded-full object-cover bg-app-surface"
              onError={(e) => {
                // Hide broken image, show fallback via next sibling
                (e.target as HTMLImageElement).style.display = "none";
                const fallback = (e.target as HTMLImageElement)
                  .nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = "flex";
              }}
            />
          ) : (
            <div
              className="h-9 w-9 shrink-0 rounded-full bg-brand/10 text-brand font-semibold text-sm items-center justify-center"
              // style={{
              //   display: getStorageUrl(student.avatarUrl) ? "none" : "flex",
              // }}
            >
              {student.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}

          <div className="min-w-0">
            <span className="truncate text-sm font-medium text-app-text block">
              {student.fullName}
            </span>
            <p className="truncate text-xs text-app-text-muted">
              {student.email || "N/A"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
    enableSorting: false,
    size: 140,
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-sm text-app-text">
        {(getValue() as string) || "Chưa cập nhật"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tham gia",
    enableSorting: true,
    cell: ({ getValue }) => (
      <span className="text-sm text-app-text">
        {formatDate(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    enableSorting: false,
    size: 170,
    cell: ({ row, getValue }) => {
      const student = row.original;
      const isBanned = student.status?.toUpperCase() === "BANNED";
      const isSuspended = !isBanned && isSuspensionActive(student.suspension);
      const style = isSuspended
        ? {
            bg: "bg-rose-50",
            text: "text-rose-600",
            border: "border-rose-200/70",
            dot: "bg-rose-500",
            label: "Đang bị chặn",
          }
        : getStatusStyle(getValue() as string);

      return (
        <div className="flex min-w-max flex-col items-start gap-1">
          <div
            className={`inline-flex min-w-max shrink-0 items-center gap-1.5 whitespace-nowrap ${style.bg} px-2.5 py-0.5 rounded-full border ${style.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            <span
              className={`${style.text} whitespace-nowrap text-[11px] font-bold tracking-tight uppercase`}
            >
              {style.label}
            </span>
          </div>
          {isSuspended && student.suspension?.endAt && (
            <span
              className="max-w-37.5 truncate text-[10px] font-semibold text-rose-500"
              title={`Bị chặn đến ${formatSuspensionDateTime(student.suspension.endAt)}`}
            >
              Đến {formatSuspensionDateTime(student.suspension.endAt)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      return (
        <StudentRowActions
          student={row.original}
          onWarnAccount={onWarnAccount}
          onBlockAccount={onBlockAccount}
          onRevokeSanction={onRevokeSanction}
        />
      );
    },
  },
];
