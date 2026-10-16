import { extractPostMeta } from "@/features/post/utils/extractPostMeta";
import type { Post } from "@/shared/types/post.type";
import {
  getPostTypeBadgeClass,
  getPostTypeLabel,
} from "@/shared/types/post.type";
import { cn } from "@/shared/utils/cn";
import { getStorageUrl } from "@/shared/utils/url";
import {
  MdChatBubble,
  MdDelete,
  MdImage,
  MdMoreHoriz,
  MdThumbUp,
  MdVisibility,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { formatAbsoluteDate } from "../../../utils";
import { APP_PATHS } from "@/shared/constants/appPaths";

interface PostItemCardProps {
  post: Post;
  onDelete?: (post: Post) => void;
}

const FallbackAvatar = ({ name }: { name: string }) => {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(-2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
      {initials}
    </div>
  );
};

export const PostItemCard = ({ post, onDelete }: PostItemCardProps) => {
  const navigate = useNavigate();
  const media =
    post.mediaUrls && post.mediaUrls.length > 0
      ? post.mediaUrls.map(getStorageUrl)
      : post.thumbnailUrl
        ? [getStorageUrl(post.thumbnailUrl)]
        : [];

  const { title, description } = extractPostMeta(
    post.contentSummary || post.content,
    post.mediaUrls,
  );

  return (
    <div
      onClick={() => navigate(APP_PATHS.ADMIN_POST_DETAIL_WITH_ID(post.id))}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:border-slate-300 flex flex-col h-full cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {post.owner?.avatarUrl ? (
            <img
              src={getStorageUrl(post.owner.avatarUrl)}
              alt=""
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
          ) : (
            <FallbackAvatar name={post.owner?.fullName || "User"} />
          )}
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight line-clamp-1">
              {post.owner?.fullName || "Tên người dùng"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatAbsoluteDate(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold whitespace-nowrap shadow-sm",
              getPostTypeBadgeClass(post.type),
            )}
          >
            {getPostTypeLabel(post.type)}
          </span>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100 shrink-0">
            <MdMoreHoriz size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 flex-1">
        {title && title !== "(Không có tiêu đề)" && (
          <h3 className="font-bold text-slate-800 mb-1 line-clamp-2">
            {title}
          </h3>
        )}
        <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Images */}
      {media.length > 0 && (
        <div className="px-4 pb-3 mt-auto">
          {media.length === 1 ? (
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
              <img
                src={media[0]}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : media.length === 2 ? (
            <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden border border-slate-100">
              {media.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-slate-100 overflow-hidden"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden border border-slate-100">
              <div className="relative aspect-square bg-slate-100 overflow-hidden row-span-2">
                <img
                  src={media[0]}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img
                  src={media[1]}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              {media.length > 2 && (
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={media[2]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {media.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        +{media.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* No images indicator */}
      {media.length === 0 && (
        <div className="px-4 pb-3 mt-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-dashed border-slate-200">
            <MdImage size={16} className="text-slate-400" />
            <span className="text-xs text-slate-400">Không có hình ảnh</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MdThumbUp size={15} />
            <span className="text-xs font-medium">{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MdChatBubble size={14} />
            <span className="text-xs font-medium">{post.commentCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(APP_PATHS.ADMIN_POST_DETAIL_WITH_ID(post.id));
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-blue-600 bg-white border border-blue-100 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 outline-none cursor-pointer"
            title="Xem chi tiết"
          >
            <MdVisibility size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(post);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-red-500 bg-white border border-red-100 shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 outline-none cursor-pointer"
            title="Xóa bài đăng"
          >
            <MdDelete size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
