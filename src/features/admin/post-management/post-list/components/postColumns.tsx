import type { ColumnDef } from "@/shared/components/admin-table";
import type { Post } from "@/shared/types/post.type";
import {
  getPostTypeBadgeClass,
  getPostTypeLabel,
} from "@/shared/types/post.type";
import { getStorageUrl } from "@/shared/utils/url";
import { extractPostMeta } from "@/features/post/utils/extractPostMeta";
import { formatAbsoluteDate } from "../../utils";
import { Image as ImageIcon, Trash2, Pin, PinOff } from "lucide-react";
import { PiShareFatFill } from "react-icons/pi";
import { MdVisibility } from "react-icons/md";

const formatDateOnly = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getFallbackAvatar = (name: string) => {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(-2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="h-9 w-9 shrink-0 rounded-full bg-brand/10 text-brand font-semibold text-sm flex items-center justify-center">
      {initials}
    </div>
  );
};

export const getPostColumns = (
  onDelete?: (post: Post) => void,
  onPin?: (post: Post, isPinned: boolean) => void,
  pinningId?: string | null,
): ColumnDef<Post, unknown>[] => [
  {
    id: "media",
    header: "Ảnh",
    enableSorting: false,
    size: 80,
    cell: ({ row }) => {
      const post = row.original;
      const media =
        post.mediaUrls && post.mediaUrls.length > 0
          ? post.mediaUrls.map(getStorageUrl)
          : post.thumbnailUrl
            ? [getStorageUrl(post.thumbnailUrl)]
            : [];

      if (media.length > 0) {
        return (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-app-border bg-app-surface">
            <img src={media[0]} alt="" className="h-full w-full object-cover" />
            {media.length > 1 && (
              <div className="absolute bottom-0 right-0 rounded-tl-lg bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                +{media.length - 1}
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-app-border bg-app-surface">
          <ImageIcon className="h-4.5 w-4.5 text-app-text-muted/60" />
        </div>
      );
    },
  },
  {
    id: "content",
    header: "Tiêu đề & Nội dung",
    enableSorting: false,
    size: 192,
    cell: ({ row }) => {
      const post = row.original;
      const { title, description } = extractPostMeta(
        post.contentSummary || post.content,
        post.mediaUrls,
      );

      return (
        <div className="min-w-40 max-w-55">
          {title && title !== "(Không có tiêu đề)" && (
            <span className="mb-0.5 block truncate whitespace-nowrap text-sm font-semibold text-app-text">
              {title}
            </span>
          )}
          <p className="truncate whitespace-nowrap text-xs leading-relaxed text-app-text-muted">
            {description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "owner.fullName",
    header: "Tác giả",
    enableSorting: false,
    size: 200,
    cell: ({ row }) => {
      const post = row.original;
      const avatarUrl = post.owner?.avatarUrl;
      const fullName = post.owner?.fullName || "Người dùng";

      return (
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={getStorageUrl(avatarUrl)}
              alt={fullName}
              className="h-9 w-9 shrink-0 rounded-full object-cover bg-app-surface"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const fallback = (e.target as HTMLImageElement)
                  .nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = "flex";
              }}
            />
          ) : null}
          <div style={{ display: avatarUrl ? "none" : "flex" }}>
            {getFallbackAvatar(fullName)}
          </div>
          <span className="truncate text-sm font-medium text-app-text">
            {fullName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày đăng",
    enableSorting: true,
    size: 160,
    cell: ({ getValue }) => (
      <>
        <span className="whitespace-nowrap text-sm font-medium text-app-text-muted sm:hidden">
          {formatDateOnly(getValue() as string)}
        </span>
        <span className="hidden whitespace-nowrap text-sm font-medium text-app-text-muted sm:inline">
          {formatAbsoluteDate(getValue() as string)}
        </span>
      </>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại bài",
    enableSorting: false,
    size: 120,
    cell: ({ getValue }) => {
      const type = getValue() as string;
      return (
        <span
          className={`inline-flex min-w-max shrink-0 items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-tight uppercase ${getPostTypeBadgeClass(
            type,
          )}`}
        >
          {getPostTypeLabel(type)}
        </span>
      );
    },
  },
  {
    accessorKey: "viewCount",
    id: "viewCount",
    header: "Xem",
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const post = row.original;
      // Mock fallback: deterministic number based on post id until backend is ready
      const mockView =
        post.viewCount ??
        (post.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 17 +
          123) %
          9999;
      return (
        <div className="flex items-center gap-1.5 text-sky-600">
          <MdVisibility className="h-3.5 w-3.5 opacity-70" />
          <span className="text-xs font-semibold">
            {mockView.toLocaleString("vi-VN")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "shareCount",
    id: "shareCount",
    header: "Chia sẻ",
    enableSorting: true,
    size: 130,
    cell: ({ row }) => {
      const post = row.original;
      // Mock fallback: deterministic number based on post id until backend is ready
      const mockShare =
        post.shareCount ??
        (post.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 7 +
          41) %
          2999;
      return (
        <div className="flex items-center gap-1.5 text-violet-600">
          <PiShareFatFill className="h-3.5 w-3.5 opacity-70" />
          <span className="text-xs font-semibold">
            {mockShare.toLocaleString("vi-VN")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    enableSorting: false,
    size: 100,
    cell: ({ row }) => {
      const post = row.original;
      const isPinned = !!post.pinnedAt;
      const isLoading = pinningId === post.id;
      return (
        <div
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={isLoading}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 cursor-pointer outline-none disabled:opacity-60 disabled:cursor-not-allowed
              ${
                isPinned
                  ? "bg-amber-50/80 text-amber-600 hover:bg-amber-600 hover:text-white"
                  : "bg-slate-50/80 text-slate-500 hover:bg-amber-500 hover:text-white"
              }
            `}
            title={isPinned ? "Bỏ ghim" : "Ghim bài viết"}
            onClick={() => onPin?.(post, isPinned)}
          >
            {isLoading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isPinned ? (
              <PinOff className="h-3.5 w-3.5" />
            ) : (
              <Pin className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50/80 text-rose-600 transition-all duration-200 hover:bg-rose-600 hover:text-white cursor-pointer outline-none"
            title="Xóa"
            onClick={() => onDelete?.(post)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    },
  },
];
