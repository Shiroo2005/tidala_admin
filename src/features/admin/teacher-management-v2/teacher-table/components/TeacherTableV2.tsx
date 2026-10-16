import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
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
import { useGetAdminTeachers } from "../hooks/useGetAdminTeachers";
import { useGetProvincesList } from "@/features/home/hooks/useGetProvincesList";
import { useGetDistricstByProvinceId } from "@/features/search-teacher/hooks/useGetDistrictsByProvinceId";
import { useGetTraininLevelList } from "@/features/search-teacher/hooks/useGetTrainingLevelList";
import type { SelectOption } from "@/shared/components/ui/searchable-select";
import { Button } from "@/shared/components/ui/button";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import { createTeacherColumns } from "./teacherColumns";
import { TeacherFiltersV2 } from "./TeacherFiltersV2";
import { useTeacherFilters } from "../hooks/useTeacherFilters";
import { getAdminTeacherId } from "../utils";
import { useToast } from "@/shared/ui/overlay";
import {
  generateTeacherShareText,
  generateTeacherShareUrl,
} from "@/shared/utils/shareUrl";

/**
 * Teacher Table v2 — Uses the shared AdminTable component + filter bar
 *
 * Wires up:
 *  - Full-text search (debounced)
 *  - Training level multi-select
 *  - Province single-select → District multi-select (cascading)
 *  - Advanced filters: experience, has current students
 *  - Sorting + pagination
 *
 * All filter/sort/page state is persisted in the URL so navigating to a
 * detail page and pressing Back restores the exact previous state.
 */
export const TeacherTableV2 = () => {
  const navigate = useNavigate();
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
    trainingLevelIds,
    provinceId,
    districtIds,
    statuses,
    hasActiveFilters,
    activeFilterCount,
    setFilter,
    resetFilters,
  } = useTeacherFilters();

  // ── Reference data for filter options ──────────────────────────────────
  const { traningLevels } = useGetTraininLevelList();
  const { listProvinces } = useGetProvincesList();
  const { listDistricts, isLoadingListDistricts } = useGetDistricstByProvinceId(
    provinceId === "ALL" ? "" : provinceId,
  );

  // ── Map reference data → SelectOption[] ────────────────────────────────
  const trainingLevelOptions: SelectOption[] = useMemo(
    () =>
      (traningLevels || []).map((tl) => ({
        value: tl.id,
        label: tl.name,
      })),
    [traningLevels],
  );

  const provinceOptions: SelectOption[] = useMemo(
    () =>
      (listProvinces || []).map((p) => ({
        value: p.id,
        label: p.name,
      })),
    [listProvinces],
  );

  const districtOptions: SelectOption[] = useMemo(
    () =>
      (listDistricts || []).map((d) => ({
        value: d.id,
        label: d.name,
      })),
    [listDistricts],
  );

  // ── Map SortField[] → backend "field,direction" format ─────────────────
  const sortParams = useMemo(
    () => sorting.map((s) => `${s.id},${s.desc ? "desc" : "asc"}`),
    [sorting],
  );

  // ── Fetch data ─────────────────────────────────────────────────────────
  const { data: teachersData, isLoading } = useGetAdminTeachers({
    filter: filterQuery,
    trainingLevelIds: trainingLevelIds.length > 0 ? trainingLevelIds : undefined,
    provinceId,
    districtIds: districtIds.length > 0 ? districtIds : undefined,
    statuses: statuses.length > 0 ? statuses : undefined,
    page,
    size: pageSize,
    sort: sortParams.length > 0 ? sortParams : ["createdAt,desc"],
  });

  const teachers = teachersData?.content ?? [];
  const totalRows = teachersData?.totalElements ?? 0;

  const handleShareTeacher = useCallback(
    async (target: { teacherId: string; fullName: string }) => {
      const shareUrl = generateTeacherShareUrl(target.teacherId);
      const shareText = generateTeacherShareText(target.fullName);

      try {
        if (navigator.share) {
          await navigator.share({
            title: target.fullName || "Thông tin giáo viên",
            text: shareText,
            url: shareUrl,
          });

          return;
        }

        await navigator.clipboard.writeText(shareUrl);
        showToast({
          message: "Đã copy link giáo viên",
          toastType: "success",
          position: "top",
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        try {
          await navigator.clipboard.writeText(shareUrl);
          showToast({
            message: "Đã copy link giáo viên",
            toastType: "success",
            position: "top",
          });
        } catch {
          showToast({
            message: "Không thể chia sẻ giáo viên",
            toastType: "error",
            position: "top",
          });
        }
      }
    },
    [showToast],
  );

  const columns = useMemo(
    () =>
      createTeacherColumns({
        onShareTeacher: handleShareTeacher,
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
    [handleShareTeacher],
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text">
            Quản lý giáo viên
          </h1>
          <p className="text-sm text-app-text-muted mt-1">
            Tìm kiếm, lọc chi tiết và theo dõi thông tin của các giáo viên trên
            hệ thống
          </p>
        </div>
        <Button
          size="lg"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate(APP_PATHS.ADMIN_TEACHER_INVITE)}
          className="self-start sm:self-auto bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl px-5 h-10 shadow-sm border border-brand/10 transition-all duration-200 active:scale-[0.98]"
        >
          Tạo giáo viên
        </Button>
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <TeacherFiltersV2
          filters={filters}
          onFilterChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          trainingLevelOptions={trainingLevelOptions}
          provinceOptions={provinceOptions}
          districtOptions={districtOptions}
          isLoadingDistricts={isLoadingListDistricts}
        />
      </div>

      <AdminTable
        columns={columns}
        data={teachers}
        totalRows={totalRows}
        currentPage={page}
        pageSize={pageSize}
        sorting={sorting}
        onSortChange={setSorting}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
        getRowId={(row) => getAdminTeacherId(row)}
        onRowClick={(row) => {
          const teacherId = getAdminTeacherId(row);
          if (teacherId)
            navigate(APP_PATHS.ADMIN_TEACHER_DETAIL_WITH_ID(teacherId));
        }}
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

export default TeacherTableV2;
