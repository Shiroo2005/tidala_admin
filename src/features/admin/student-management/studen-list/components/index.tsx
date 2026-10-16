import { useCallback, useMemo, useState } from "react";
import { AdminTable } from "@/shared/components/admin-table";
import {
  AccountModerationDialog,
  type AccountModerationDialogState,
  type AccountModerationTarget,
} from "@/features/admin/account-moderation/components/AccountModerationDialog";
import {
  useRevokeSanction,
  useSanctionUser,
} from "@/features/admin/account-moderation/hooks/useAccountModeration";
import {
  AccountSanctionType,
  type SanctionUserRequest,
} from "@/features/admin/account-moderation/types";
import { useGetAdminStudents } from "../hooks/useGetAdminStudents";
import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import { createStudentColumns } from "./studentColumns";
import { StudentFiltersV2 } from "./StudentFiltersV2";
import { useStudentFilters } from "../hooks/useStudentFilters";
import { useToast } from "@/shared/ui/overlay";

/**
 * Student Management Feature (v2)
 *
 * Implements:
 *  - Responsive grid layout with design tokens
 *  - TanStack Table (AdminTable) for server-side sorting and pagination
 *  - Custom filter hook and search/status filters component
 *  - Zero dependency on Material UI
 *
 * All filter/sort/page state is persisted in the URL so navigating away
 * and pressing Back restores the exact previous state.
 */
export const StudentManagement = () => {
  const { showToast } = useToast();
  const { mutateAsync: sanctionAccount, isPending: isSanctioning } =
    useSanctionUser();
  const { mutateAsync: revokeAccountSanction, isPending: isRevokingSanction } =
    useRevokeSanction();
  const [moderationDialog, setModerationDialog] =
    useState<AccountModerationDialogState | null>(null);

  // ── URL-backed filter / pagination / sort state ──────────────────────────
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    sorting,
    setSorting,
    filters,
    filterQuery,
    hasActiveFilters,
    activeFilterCount,
    setFilter,
    resetFilters,
  } = useStudentFilters();

  // ── Map SortField[] → backend "field,direction" format ──
  const sortParams = useMemo(
    () => sorting.map((s) => `${s.id},${s.desc ? "desc" : "asc"}`),
    [sorting],
  );

  // ── Fetch data ──
  const { data: studentsData, isLoading } = useGetAdminStudents({
    filter: filterQuery,
    page,
    size: pageSize,
    sort: sortParams.length > 0 ? sortParams : ["createdAt,desc"],
  });

  const students = studentsData?.content ?? [];
  const totalRows = studentsData?.totalElements ?? 0;

  const columns = useMemo(
    () =>
      createStudentColumns({
        onWarnAccount: (target) =>
          setModerationDialog({
            mode: "sanction",
            target,
            sanctionType: AccountSanctionType.WARNING,
          }),
        onBlockAccount: (target) =>
          setModerationDialog({
            mode: "sanction",
            target,
            availableSanctionTypes: [
              AccountSanctionType.SUSPENSION,
              AccountSanctionType.BAN,
            ],
          }),
        onRevokeSanction: (target) =>
          setModerationDialog({ mode: "revoke", target }),
      }),
    [],
  );

  const handleSanctionAccount = useCallback(
    async (target: AccountModerationTarget, payload: SanctionUserRequest) => {
      await sanctionAccount({ userId: target.userId, payload });
      const actionLabel =
        payload.type === AccountSanctionType.WARNING
          ? "Đã gửi cảnh báo"
          : payload.type === AccountSanctionType.BAN
            ? "Đã chặn vĩnh viễn"
            : "Đã chặn người dùng";
      showToast({
        message: `${actionLabel} cho ${target.fullName}`,
        toastType: "success",
        position: "top",
      });
    },
    [sanctionAccount, showToast],
  );

  const handleRevokeSanction = useCallback(
    async (target: AccountModerationTarget, reason: string) => {
      await revokeAccountSanction({ userId: target.userId, reason });
      showToast({
        message: `Đã gỡ chặn cho ${target.fullName}`,
        toastType: "success",
        position: "top",
      });
    },
    [revokeAccountSanction, showToast],
  );

  return (
    <div className="p-6">
      <AdminBreadcrumbs />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Quản lý học sinh</h1>
          <p className="text-sm text-app-text-muted mt-1">
            Tìm kiếm, lọc trạng thái và theo dõi thông tin của các học sinh trên
            hệ thống
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <StudentFiltersV2
          filters={filters}
          onFilterChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* TanStack Table */}
      <AdminTable
        columns={columns}
        data={students}
        totalRows={totalRows}
        currentPage={page}
        pageSize={pageSize}
        sorting={sorting}
        onSortChange={setSorting}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
        getRowId={(row) => row.id}
      />

      <AccountModerationDialog
        state={moderationDialog}
        isSubmitting={isSanctioning || isRevokingSanction}
        onClose={() => setModerationDialog(null)}
        onSanction={handleSanctionAccount}
        onRevoke={handleRevokeSanction}
      />
    </div>
  );
};

export default StudentManagement;
