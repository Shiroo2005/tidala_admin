import { useTeachersLoadMore } from "../hooks/useTeachersLoadMore";
import { LoadMoreButton } from "./LoadMoreButton";
import { TeacherItem, TeacherItemSkeleton } from "./TeacherItem";

type MobileTeacherListProps = {
  searchQuery?: string;
};

export const MobileTeacherList = ({ searchQuery }: MobileTeacherListProps) => {
  const {
    teachers,
    isInitialLoading,
    isPrefetching,
    hasMore,
    loadMore,
    totalElements,
  } = useTeachersLoadMore(searchQuery);

  // Initial loading — show skeletons
  if (isInitialLoading) {
    return (
      <div className="flex flex-col gap-3 px-4 pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <TeacherItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (teachers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">👨‍🏫</span>
        </div>
        <p className="text-sm font-medium text-slate-600">
          Không tìm thấy giáo viên
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {/* Result count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-400">
          Hiển thị {teachers.length} / {totalElements} giáo viên
        </span>
      </div>

      {/* Teacher cards */}
      {teachers.map((teacher) => (
        <TeacherItem
          key={teacher.userId}
          teacher={teacher}
          onViewDetail={(t) => {
            // TODO: Navigate to teacher detail in Phase 2
            console.log("View detail:", t.userId);
          }}
        />
      ))}

      {/* Load more */}
      <LoadMoreButton
        onClick={loadMore}
        isLoading={isPrefetching}
        visible={hasMore}
      />
    </div>
  );
};
