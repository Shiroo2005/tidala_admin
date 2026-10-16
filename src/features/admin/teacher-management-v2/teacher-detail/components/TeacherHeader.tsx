import type { TeacherDetail } from "@/shared/types/common.type";
import { getStorageUrl } from "@/shared/utils/url";
import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import { MdVerified } from "react-icons/md";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getStatusColor } from "./utils";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherHeader = ({ teacherDetail }: Props) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const status = getStatusColor(teacherDetail.status);
  const coverImage = teacherDetail.coverImageUrl
    ? getStorageUrl(teacherDetail.coverImageUrl)
    : null;
  const avatarImage = teacherDetail.avatarUrl
    ? getStorageUrl(teacherDetail.avatarUrl)
    : null;

  const validImages = [coverImage, avatarImage].filter(Boolean) as string[];
  const slides = validImages.map((src) => ({ src }));

  const openLightbox = (imgSrc: string | null) => {
    if (!imgSrc) return;
    const index = validImages.indexOf(imgSrc);
    if (index !== -1) setLightboxIndex(index);
  };

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
      {/* Cover Image */}
      <Box
        onClick={coverImage ? () => openLightbox(coverImage) : undefined}
        sx={{
          height: { xs: 160, sm: 200, md: 260 },
          position: "relative",
          overflow: "hidden",
          cursor: coverImage ? "pointer" : "default",
          // Fallback gradient when no cover image
          ...(!coverImage && {
            background:
              "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
          }),
        }}
      >
        {/* Actual cover image element */}
        {coverImage && (
          <Box
            component="img"
            src={coverImage}
            alt="Cover"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.85)",
            }}
          />
        )}

        {/* Gradient overlay — dark at bottom for readability */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
          }}
        />

      </Box>


      {/* Avatar + Info */}
      <Box sx={{ px: 3, pb: 3 }}>
        {/* Avatar — overlapping the cover */}
        <Avatar
          src={avatarImage || undefined}
          alt={teacherDetail.fullName}
          onClick={avatarImage ? () => openLightbox(avatarImage) : undefined}
          sx={{
            width: 112,
            height: 112,
            border: "4px solid white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            fontSize: 40,
            mt: -7,
            position: "relative",
            zIndex: 3,
            cursor: avatarImage ? "pointer" : "default",
            transition: "transform 0.2s",
            "&:hover": avatarImage
              ? {
                  transform: "scale(1.05)",
                }
              : {},
          }}
        >
          {teacherDetail.fullName?.[0]}
        </Avatar>

        {/* Name + Status — below avatar with breathing room */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
          sx={{ mt: 2 }}
        >
          <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
            <Typography variant="h5" fontWeight="bold" noWrap>
              {teacherDetail.fullName}
            </Typography>
            {["ACTIVE", "APPROVED"].includes(teacherDetail.status) && (
              <MdVerified
                className="text-blue-600 shrink-0"
                size={22}
                title="Đã xác minh"
              />
            )}
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              bgcolor: status.bg,
              border: `1px solid ${status.border}`,
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{ color: status.color }}
            >
              {status.label}
            </Typography>
          </Box>
        </Box>

        {/* Bio line */}
        <Typography
          variant="body2"
          color="text.secondary"
          mt={0.5}
          noWrap
          sx={{ maxWidth: 600 }}
        >
          {teacherDetail.bio ||
            teacherDetail.description ||
            "Chưa có giới thiệu"}
        </Typography>
      </Box>

      {/* Lightbox for Cover and Avatar */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </Box>
  );
};
