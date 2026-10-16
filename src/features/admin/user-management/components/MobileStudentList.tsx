import { useStudentsLoadMore } from "../hooks/useStudentsLoadMore";
import { LoadMoreButton } from "./LoadMoreButton";
import { StudentItem, StudentItemSkeleton } from "./StudentItem";

type MobileStudentListProps = {
  searchQuery?: string;
};

export const MobileStudentList = ({ searchQuery }: MobileStudentListProps) => {
  const {
    students,
    isInitialLoading,
    isPrefetching,
    hasMore,
    loadMore,
    totalElements,
  } = useStudentsLoadMore(searchQuery);

  // Initial loading — show skeletons
  if (isInitialLoading) {
    return (
      <div className="flex flex-col gap-3 px-4 pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StudentItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <p className="text-sm font-medium text-slate-600">
          Không tìm thấy học viên
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
          Hiển thị {students.length} / {totalElements} học viên
        </span>
      </div>

      {/* Student cards */}
      {students.map((student) => (
        <StudentItem
          key={student.id}
          student={student}
          onViewDetail={(s) => {
            // TODO: Navigate to student detail in Phase 2
            console.log("View detail:", s.id);
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
