import type { ColumnDef } from "@/shared/components/admin-table";
import type { AccountModerationTarget } from "@/features/admin/account-moderation/components/AccountModerationDialog";
import type { AdminTeacherDetail } from "@/features/admin/teacher-management-v2/types";
import {
  formatSuspensionDateTime,
  isSuspensionActive,
} from "@/features/admin/teacher-management-v2/utils/suspension";
import { getStorageUrl } from "@/shared/utils/url";
import {
  formatDate,
  formatExperience,
  getStatusStyle,
} from "../utils";
import { TeacherRowActions } from "./TeacherRowActions";

interface TeacherColumnActions {
  onShareTeacher: (target: { teacherId: string; fullName: string }) => void;
  onWarnAccount: (target: AccountModerationTarget) => void;
  onBlockAccount: (target: AccountModerationTarget) => void;
  onRevokeSanction: (target: AccountModerationTarget) => void;
}

/**
 * Column definitions for Teacher table (v2)
 *
 * Defined outside component to avoid re-creation on each render.
 * Uses TanStack ColumnDef<AdminTeacherDetail>.
 */
export const createTeacherColumns = ({
  onShareTeacher,
  onWarnAccount,
  onBlockAccount,
  onRevokeSanction,
}: TeacherColumnActions): ColumnDef<AdminTeacherDetail, unknown>[] => [
  {
    accessorKey: "fullName",
    header: "Giáo viên",
    enableSorting: false,
    size: 280,
    cell: ({ row }) => {
      const teacher = row.original;
      const totalComments = teacher.totalReviews || 0;
      return (
        <div className="flex items-center gap-3">
          {getStorageUrl(teacher.avatarUrl) ? (
            <img
              src={getStorageUrl(teacher.avatarUrl)}
              alt={teacher.fullName}
              className="h-9 w-9 shrink-0 rounded-full object-cover bg-app-surface"
              onError={(e) => {
                // Hide broken image, show fallback via next sibling
                (e.target as HTMLImageElement).style.display = "none";
                const fallback = (e.target as HTMLImageElement).nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="h-9 w-9 shrink-0 rounded-full bg-brand/10 text-brand font-semibold text-sm items-center justify-center"
            style={{ display: getStorageUrl(teacher.avatarUrl) ? "none" : "flex" }}
          >
            {teacher.fullName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-medium text-app-text">
                {teacher.fullName}
              </span>
              {totalComments >= 5 && (
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
            <p className="truncate text-xs text-app-text-muted">
              {teacher.email || "N/A"}
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
    cell: ({ getValue }) => (
      <span className="text-sm text-app-text">
        {(getValue() as string) || "Chưa cập nhật"}
      </span>
    ),
  },
  {
    accessorKey: "experienceYears",
    header: "Kinh nghiệm",
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="text-sm text-app-text">
        {formatExperience(getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: "averageRating",
    header: "Đánh giá",
    enableSorting: true,
    cell: ({ row }) => {
      const teacher = row.original;
      const totalComments = teacher.totalReviews || 0;

      if (totalComments <= 0) {
        return <span className="text-sm text-app-text-muted">Chưa có</span>;
      }

      return (
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-app-text">
            {teacher.averageRating ? teacher.averageRating.toFixed(1) : "-"}
          </span>
          <span className="text-amber-500 text-sm">★</span>
          <span className="text-xs text-app-text-muted">
            ({totalComments})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
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
      const teacher = row.original;
      const isBanned = teacher.status?.toUpperCase() === "BANNED";
      const isSuspended = !isBanned && isSuspensionActive(teacher.suspension);
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
          {isSuspended && teacher.suspension?.endAt && (
            <span
              className="max-w-37.5 truncate text-[10px] font-semibold text-rose-500"
              title={`Bị chặn đến ${formatSuspensionDateTime(teacher.suspension.endAt)}`}
            >
              Đến {formatSuspensionDateTime(teacher.suspension.endAt)}
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
        <TeacherRowActions
          teacher={row.original}
          onShareTeacher={onShareTeacher}
          onWarnAccount={onWarnAccount}
          onBlockAccount={onBlockAccount}
          onRevokeSanction={onRevokeSanction}
        />
      );
    },
  },
];
