import type { TeacherDetail } from "@/shared/types/common.type";
import { getStorageUrl } from "@/shared/utils/url";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherGallery = ({ teacherDetail }: Props) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const photos = teacherDetail.realPhotos || [];

  if (photos.length === 0) return null;

  const maxDisplay = 8;
  const displayPhotos = photos.slice(0, maxDisplay);
  const remaining = photos.length - maxDisplay;

  const slides = photos.map((url) => ({
    src: getStorageUrl(url),
  }));

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
      >
        Hình ảnh thực tế
        <Typography
          component="span"
          variant="caption"
          color="text.secondary"
          fontWeight={400}
        >
          ({photos.length} ảnh)
        </Typography>
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
        }}
        gap={1.5}
      >
        {displayPhotos.map((url, index) => {
          const isLast = index === maxDisplay - 1 && remaining > 0;
          return (
            <Box
              key={url}
              onClick={() => setLightboxIndex(index)}
              sx={{
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                },
                "&:hover img": {
                  transform: "scale(1.08)",
                },
              }}
            >
              <Box
                component="img"
                src={getStorageUrl(url)}
                alt=""
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                }}
              />
              {isLast && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 700 }}
                  >
                    +{remaining}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
      />
    </Box>
  );
};
