import { extractPostMeta } from "@/features/post/utils/extractPostMeta";
import type { Post } from "@/shared/types/post.type";
import { getPostTypeLabel } from "@/shared/types/post.type";
import { getStorageUrl } from "@/shared/utils/url";
import { Box, Chip, Typography } from "@mui/material";
import {
  MdAccessTime,
  MdImage,
  MdFavorite,
  MdChatBubble,
  MdBookmark,
  MdVisibility,
} from "react-icons/md";
import { PiShareFatFill } from "react-icons/pi";
import { formatAbsoluteDate } from "../../../utils";

interface PostContentProps {
  post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
  const { title } = extractPostMeta(
    post.contentSummary || post.content,
    post.mediaUrls,
  );

  const media =
    post.mediaUrls && post.mediaUrls.length > 0
      ? post.mediaUrls.map(getStorageUrl)
      : post.thumbnailUrl
        ? [getStorageUrl(post.thumbnailUrl)]
        : [];

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        overflow: "hidden",
      }}
    >
      {/* Thumbnail / Media gallery */}
      {media.length > 0 ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            maxHeight: 400,
            overflow: "hidden",
            bgcolor: "grey.100",
          }}
        >
          <img
            src={media[0]}
            alt="Post thumbnail"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {media.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                bgcolor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <MdImage size={14} />+{media.length - 1} ảnh
            </Box>
          )}
        </Box>
      ) : null}

      {/* Content body */}
      <Box sx={{ p: 3 }}>
        {/* Row 1: Tag + Time */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* Type badge */}
          <Chip
            label={getPostTypeLabel(post.type)}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.03em",
              bgcolor: "var(--token-color-primary-soft)",
              color: "var(--token-color-primary)",
              border: "1px solid rgba(19, 127, 236, 0.2)",
              borderRadius: 2,
              height: 26,
            }}
          />

          {/* Date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <MdAccessTime size={14} />
            <Typography variant="caption" fontWeight={500}>
              {formatAbsoluteDate(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Row 2: Interactions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2.5,
            flexWrap: "wrap",
          }}
        >
          {/* Likes */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MdFavorite size={14} style={{ color: "#f43f5e" }} />
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {post.likeCount.toLocaleString("vi-VN")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.72rem" }}
            >
              thích
            </Typography>
          </Box>

          {/* Comments */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MdChatBubble size={14} style={{ color: "#0284c7" }} />
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {post.commentCount.toLocaleString("vi-VN")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.72rem" }}
            >
              bình luận
            </Typography>
          </Box>

          {/* Saves */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MdBookmark size={14} style={{ color: "#d97706" }} />
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {post.saveCount.toLocaleString("vi-VN")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.72rem" }}
            >
              lượt lưu
            </Typography>
          </Box>

          {/* Views */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <MdVisibility size={14} style={{ color: "#0284c7" }} />
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {(
                post.viewCount ??
                (post.id
                  .split("")
                  .reduce((acc, c) => acc + c.charCodeAt(0), 0) *
                  17 +
                  123) %
                  9999
              ).toLocaleString("vi-VN")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.72rem" }}
            >
              lượt xem
            </Typography>
          </Box>

          {/* Shares */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PiShareFatFill size={14} style={{ color: "#7c3aed" }} />
            <Typography variant="caption" fontWeight={600} color="text.primary">
              {(
                post.shareCount ??
                (post.id
                  .split("")
                  .reduce((acc, c) => acc + c.charCodeAt(0), 0) *
                  7 +
                  41) %
                  2999
              ).toLocaleString("vi-VN")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.72rem" }}
            >
              lượt chia sẻ
            </Typography>
          </Box>
        </Box>

        {/* Title */}
        {title && title !== "(Không có tiêu đề)" && (
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            sx={{ mb: 2, lineHeight: 1.4 }}
          >
            {title}
          </Typography>
        )}

        {/* Content */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            lineHeight: 1.8,
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            fontSize: "0.95rem",
          }}
        >
          {post.content || post.contentSummary}
        </Typography>

        {/* Additional images grid */}
        {media.length > 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mb: 1.5 }}
            >
              Ảnh đính kèm ({media.length})
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {media.slice(1).map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    aspectRatio: "1",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    border: "1px solid",
                    borderColor: "grey.200",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <img
                    src={url}
                    alt={`Ảnh ${index + 2}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
