import type { TeacherDetail } from "@/shared/types/common.type";
import { Box, Chip, Typography } from "@mui/material";
import { MdLocationOn, MdOpenInNew } from "react-icons/md";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherLocations = ({ teacherDetail }: Props) => {
  const districts = teacherDetail.districts || [];
  const drivingCenters = teacherDetail.drivingCenters || [];
  const province = teacherDetail.province;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Districts */}
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
          Khu vực hoạt động
        </Typography>

        {province && (
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
            sx={{ mb: 1.5 }}
          >
            {province.name}
          </Typography>
        )}

        {districts.length > 0 ? (
          <Box display="flex" flexWrap="wrap" gap={1}>
            {districts.map((d) => (
              <Chip
                key={d.districtId}
                label={d.districtName}
                size="small"
                variant="outlined"
                icon={<MdLocationOn size={14} />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 500,
                  "& .MuiChip-icon": { color: "#3b82f6" },
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Chưa cập nhật khu vực.
          </Typography>
        )}
      </Box>

      {/* Driving Centers */}
      {drivingCenters.length > 0 && (
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
            Sân tập & Trung tâm sát hạch
          </Typography>

          <Box display="flex" flexDirection="column" gap={1.5}>
            {drivingCenters.map((center) => (
              <Box
                key={center.id}
                sx={{
                  p: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="body2" fontWeight="bold" noWrap>
                      {center.name}
                    </Typography>
                    <Chip
                      label={
                        center.type === "PRACTICE_GROUND"
                          ? "Sân tập"
                          : "Sát hạch"
                      }
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: 11,
                        borderRadius: 1.5,
                        bgcolor:
                          center.type === "PRACTICE_GROUND"
                            ? "#dbeafe"
                            : "#ffedd5",
                        color:
                          center.type === "PRACTICE_GROUND"
                            ? "#1d4ed8"
                            : "#c2410c",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    {center.address}
                  </Typography>
                </Box>
                {center.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-blue-500 hover:text-blue-700 transition-colors p-1"
                  >
                    <MdOpenInNew size={18} />
                  </a>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
