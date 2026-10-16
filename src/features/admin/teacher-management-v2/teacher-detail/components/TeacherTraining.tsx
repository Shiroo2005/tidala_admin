import type { TeacherDetail, TeachingCar } from "@/shared/types/common.type";
import { getStorageUrl } from "@/shared/utils/url";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { formatCurrency } from "./utils";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherTraining = ({ teacherDetail }: Props) => {
  const trainings = teacherDetail.trainings || [];
  const cars = teacherDetail.teachingCars || [];
  const [selectedCar, setSelectedCar] = useState<TeachingCar | null>(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Training Levels Table */}
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
          Khóa học đào tạo
        </Typography>
        {trainings.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                    Hạng
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    Giá từ
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    Giá đến
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainings.map((t) => (
                  <TableRow
                    key={t.trainingLevelId}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: "#f8fafc" },
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={`${t.trainingLevelName}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(t.priceFrom)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(t.priceTo)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Chưa có khóa học nào.
          </Typography>
        )}
      </Box>

      {/* Teaching Cars */}
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
          Xe tập lái
        </Typography>
        {cars.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            }}
            gap={2}
          >
            {cars.map((car) => (
              <Box
                key={car.id}
                onClick={() => setSelectedCar(car)}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  transition: "all 0.15s",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "#f0f7ff",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={getStorageUrl(car.imageUrl)}
                  alt={car.brand}
                  sx={{
                    width: 80,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1.5,
                    flexShrink: 0,
                    bgcolor: "grey.100",
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {car.brand} {car.model} ({car.productionYear})
                  </Typography>
                  <Chip
                    label={car.type === "manual" ? "Số sàn" : "Số tự động"}
                    size="small"
                    variant="outlined"
                    color={car.type === "manual" ? "default" : "info"}
                    sx={{
                      mt: 0.5,
                      fontWeight: 500,
                      borderRadius: 1.5,
                      fontSize: 11,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Chưa có thông tin xe tập lái.
          </Typography>
        )}
      </Box>
      {/* Car Detail Modal */}
      <Dialog
        open={Boolean(selectedCar)}
        onClose={() => setSelectedCar(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ m: 0, p: 2, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            Chi tiết xe tập lái
          </Typography>
          <IconButton onClick={() => setSelectedCar(null)} size="small" sx={{ color: "grey.500" }}>
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {selectedCar && (
            <>
              <Box
                component="img"
                src={getStorageUrl(selectedCar.imageUrl)}
                alt={selectedCar.brand}
                sx={{
                  width: "100%",
                  height: 240,
                  objectFit: "cover",
                  borderRadius: 2,
                  bgcolor: "grey.100",
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedCar.brand} {selectedCar.model} ({selectedCar.productionYear})
                </Typography>
                <Chip
                  label={selectedCar.type === "manual" ? "Số sàn" : "Số tự động"}
                  variant="outlined"
                  color={selectedCar.type === "manual" ? "default" : "info"}
                  sx={{ fontWeight: 600, borderRadius: 1.5, mb: 2 }}
                />
                
                {selectedCar.description && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                      Mô tả:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "text.primary", lineHeight: 1.6 }}>
                      {selectedCar.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
