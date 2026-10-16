import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTable, type SortField } from "@/shared/components/admin-table";
import type { Post } from "@/shared/types/post.type";
import { getPostColumns } from "../postColumns";
import { FileText } from "lucide-react";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { usePinAdminPost } from "../../hooks/usePinAdminPost";

interface PostListViewProps {
  posts: Post[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sorting: SortField[];
  onSortChange: (sorting: SortField[]) => void;
  onDelete?: (post: Post) => void;
}

export const PostListView = ({
  posts,
  isLoading,
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortChange,
  onDelete,
}: PostListViewProps) => {
  const navigate = useNavigate();
  const { pinMutation, unpinMutation } = usePinAdminPost();

  /**
   * Local overrides for pinnedAt.
   * Key = postId, value = ISO timestamp string (pinned) | null (unpinned).
   * This avoids refetching the whole list after pin/unpin — the row stays
   * in place and its visual state flips instantly. The list will re-sort
   * naturally on the next real fetch (page change / reload).
   */
  const [pinnedOverrides, setPinnedOverrides] = useState<
    Record<string, string | null>
  >({});

  /** id of the post currently being pinned/unpinned (for spinner) */
  const [pinningId, setPinningId] = useState<string | null>(null);

  const handlePin = (post: Post, isPinned: boolean) => {
    setPinningId(post.id);
    const mutation = isPinned ? unpinMutation : pinMutation;
    mutation.mutate(post.id, {
      onSuccess: () => {
        // Update local override — no API refetch needed
        setPinnedOverrides((prev) => ({
          ...prev,
          [post.id]: isPinned ? null : new Date().toISOString(),
        }));
      },
      onSettled: () => setPinningId(null),
    });
  };

  /**
   * Merge local pinnedAt overrides into the post data so the table
   * reflects the new state without re-fetching from the server.
   */
  const mergedPosts = useMemo(() => {
    const hasOverrides = Object.keys(pinnedOverrides).length > 0;
    if (!hasOverrides) return posts;
    return posts.map((p) =>
      p.id in pinnedOverrides ? { ...p, pinnedAt: pinnedOverrides[p.id] } : p,
    );
  }, [posts, pinnedOverrides]);

  const columns = useMemo(
    () => getPostColumns(onDelete, handlePin, pinningId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDelete, pinningId],
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-app-text-muted">
      <div className="w-14 h-14 rounded-full bg-app-surface/60 flex items-center justify-center mb-2">
        <FileText className="h-6 w-6 text-app-text-muted" />
      </div>
      <p className="text-sm font-semibold text-app-text">
        Chưa có bài đăng nào
      </p>
      <p className="text-xs text-app-text-muted">
        Dữ liệu bài đăng sẽ hiển thị tại đây
      </p>
    </div>
  );

  return (
    <AdminTable
      columns={columns}
      data={mergedPosts}
      totalRows={totalRows}
      currentPage={page}
      pageSize={pageSize}
      sorting={sorting}
      onSortChange={onSortChange}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      isLoading={isLoading}
      getRowId={(row) => row.id}
      emptyState={emptyState}
      getRowClassName={(row) =>
        row.pinnedAt
          ? "bg-amber-50/60 border-l-2 border-l-amber-400 hover:bg-amber-50"
          : ""
      }
      onRowClick={(row) =>
        navigate(APP_PATHS.ADMIN_POST_DETAIL_WITH_ID(row.id))
      }
    />
  );
};
