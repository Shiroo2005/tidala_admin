import type { TeacherProfile } from "@/features/account/types/type";
import { Box, Chip, Divider, Rating, Typography } from "@mui/material";
import {
  MdLocationOn,
  MdPeople,
  MdSchool,
  MdStar,
  MdWorkHistory,
} from "react-icons/md";

interface TeacherExtraInfoProps {
  profile: TeacherProfile;
}

const EXPERIENCE_LABELS: Record<string, string> = {
  ONE_TO_THREE: "1 – 3 năm",
  THREE_TO_FIVE: "3 – 5 năm",
  FIVE_TO_TEN: "5 – 10 năm",
  TEN_PLUS: "10+ năm",
};

const STUDENTS_LABELS: Record<string, string> = {
  LOWER_THAN_100: "< 100 học viên",
  FROM_100: "100+ học viên",
  FROM_300: "300+ học viên",
  FROM_500: "500+ học viên",
  FROM_1000: "1000+ học viên",
};

export const TeacherExtraInfo = ({ profile }: TeacherExtraInfoProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Divider sx={{ my: 0.5 }} />

      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="text.primary"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <MdSchool size={16} className="text-indigo-500" />
        Hồ sơ giáo viên
      </Typography>

      {/* Bio */}
      {profile.bio && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 0.5, display: "block" }}
          >
            Giới thiệu
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              fontSize: "0.82rem",
            }}
          >
            {profile.bio}
          </Typography>
        </Box>
      )}

      {/* Statistics row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        {/* Experience */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <MdWorkHistory size={16} className="text-slate-400" />
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", fontSize: "0.65rem" }}
            >
              Kinh nghiệm
            </Typography>
            <Typography variant="body2" fontWeight={600} fontSize="0.78rem">
              {EXPERIENCE_LABELS[profile.experienceYears] ||
                profile.experienceYears}
            </Typography>
          </Box>
        </Box>

        {/* Students */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <MdPeople size={16} className="text-slate-400" />
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", fontSize: "0.65rem" }}
            >
              Đã đào tạo
            </Typography>
            <Typography variant="body2" fontWeight={600} fontSize="0.78rem">
              {STUDENTS_LABELS[profile.studentsTrained] ||
                profile.studentsTrained}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Rating */}
      {(profile.avgRating ?? 0) > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            bgcolor: "amber.50",
            borderRadius: 2,
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          }}
        >
          <MdStar size={18} className="text-amber-500" />
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={700}>
                {(profile.avgRating ?? 0).toFixed(1)}
              </Typography>
              <Rating
                value={profile.avgRating ?? 0}
                precision={0.5}
                readOnly
                size="small"
                sx={{ fontSize: "0.9rem" }}
              />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="0.68rem"
            >
              {profile.reviewSummary?.totalReviews ??
                profile.totalComments ??
                0}{" "}
              đánh giá
            </Typography>
          </Box>
        </Box>
      )}

      {/* Tags */}
      {profile.tags && profile.tags.length > 0 && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Thẻ
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {profile.tags.map((tag) => {
              const isSpecialty = tag.type === "specialty";
              const isStyle = tag.type === "style";
              const styles = isSpecialty
                ? { bg: "#dcfce7", text: "#16a34a", border: "#bbf7d0" }
                : isStyle
                  ? { bg: "#cffafe", text: "#0891b2", border: "#a5f3fc" }
                  : { bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb" };

              return (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    bgcolor: styles.bg,
                    color: styles.text,
                    border: `1px solid ${styles.border}`,
                    borderRadius: "6px",
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* Training levels */}
      {profile.trainings && profile.trainings.length > 0 && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Hạng đào tạo
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {profile.trainings.map((t) => (
              <Chip
                key={t.trainingLevelId}
                label={t.trainingLevelName}
                size="small"
                variant="outlined"
                sx={{
                  height: 24,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  borderColor: "grey.300",
                  borderRadius: 1.5,
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Districts */}
      {profile.districts && profile.districts.length > 0 && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <MdLocationOn size={13} />
            Khu vực dạy
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              fontSize: "0.8rem",
              lineHeight: 1.5,
            }}
          >
            {profile.districts[0].provinceName}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
