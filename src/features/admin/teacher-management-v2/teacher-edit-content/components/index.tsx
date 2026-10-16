import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { MdArrowBack, MdSave } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacherEditContent } from "../hooks/useTeacherEditContent";
import { BasicInfoSection } from "./BasicInfoSection";
import { ImagesSection } from "./ImagesSection";
import { LocationsSection } from "./LocationsSection";
import { TagsSection } from "./TagsSection";
import { TeachingCarsSection } from "./TeachingCarsSection";
import { TrainingLevelsSection } from "./TrainingLevelsSection";

const EMPTY_PHOTOS: string[] = [];

export const TeacherEditContent = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const setFieldRef = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      fieldRefs.current[key] = el;
    },
    [],
  );

  const teacherForm = useTeacherEditContent({
    onNavigateToFieldError: (errorFieldKey) => {
      setTimeout(() => {
        const el = fieldRefs.current[errorFieldKey as string];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    onSuccess: () => {
      navigate(-1);
    },
  });

  const {
    isChanged,
    isSubmitting,
    handleSubmit,
    formErrors,
    isLoadingTeacherDetail,
    teacherDetail,
    isErrorFetchTeacherDetail,
    teachingInfoForm,
    setTeacherProfileField,
  } = teacherForm;

  const handleBack = () => {
    navigate(-1);
  };

  const onRealPhotosChange = useCallback(
    (urls: string[]) => {
      setTeacherProfileField("realPhotos", urls);
    },
    [setTeacherProfileField],
  );

  const teacherProvince = useMemo(() => {
    if (!teacherDetail) return undefined;
    if (teacherDetail.districts && teacherDetail.districts.length > 0) {
      return {
        id: teacherDetail.districts[0].provinceId,
        name: teacherDetail.districts[0].provinceName,
      };
    }
    return undefined;
  }, [teacherDetail]);

  if (!teacherId) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <Typography color="text.secondary" variant="body1">
          Không tìm thấy giáo viên.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Breadcrumb section */}
      <Box sx={{ mb: -1 }}>
        <AdminBreadcrumbs />
      </Box>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 outline-none cursor-pointer"
            aria-label="Quay lại"
          >
            <MdArrowBack size={22} />
          </button>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Chỉnh sửa hồ sơ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cập nhật thông tin giáo viên
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleBack}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <MdSave size={18} />
              )
            }
            disabled={isSubmitting || !isChanged}
            onClick={handleSubmit}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {isLoadingTeacherDetail ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={400}
        >
          <CircularProgress />
        </Box>
      ) : isErrorFetchTeacherDetail || !teacherDetail ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <Typography color="error" variant="body1">
            Không thể tải thông tin giáo viên.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Section 1: Basic Info */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <BasicInfoSection
              teachingInfoForm={teachingInfoForm}
              setTeacherProfileField={teacherForm.setTeacherProfileField}
              basicInfoForm={teacherForm.basicInfoForm}
              setAccountField={teacherForm.setAccountField}
              formErrors={formErrors}
              registerFieldRef={setFieldRef}
            />
          </Paper>

          {/* Section 2: Images */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <ImagesSection
              avatarUrl={teacherForm.basicInfoForm.avatarUrl || ""}
              coverImageUrl={teachingInfoForm.coverImageUrl || ""}
              realPhotos={teachingInfoForm.realPhotos ?? EMPTY_PHOTOS}
              onAvatarChange={teacherForm.setAvatarUrl}
              onCoverChange={teacherForm.setCoverImageUrl}
              onRealPhotosChange={onRealPhotosChange}
              formErrors={formErrors}
              registerFieldRef={setFieldRef}
            />
          </Paper>

          {/* Section 3: Training Levels */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <TrainingLevelsSection
              teachingInfoForm={teachingInfoForm}
              setTrainingLevels={teacherForm.setTrainingLevels}
              setTeacherProfileField={teacherForm.setTeacherProfileField}
              formErrors={formErrors}
              registerFieldRef={setFieldRef}
            />
          </Paper>

          {/* Section 4: Locations */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <LocationsSection
              teachingInfoForm={teachingInfoForm}
              setTeacherProfileField={teacherForm.setTeacherProfileField}
              teacherProvince={teacherProvince}
              formErrors={formErrors}
              registerFieldRef={setFieldRef}
            />
          </Paper>

          {/* Section 5: Tags */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <TagsSection
              teachingInfoForm={teachingInfoForm}
              setTeacherProfileField={teacherForm.setTeacherProfileField}
              formErrors={formErrors}
              registerFieldRef={setFieldRef}
              clearError={teacherForm.clearError}
            />
          </Paper>

          {/* Section 6: Teaching Cars */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <TeachingCarsSection
              teachingInfoForm={teachingInfoForm}
              setTeacherProfileField={teacherForm.setTeacherProfileField}
              formErrors={formErrors}
              registerFieldRef={setFieldRef}
            />
          </Paper>

          {/* Bottom action buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              pb: 4,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleBack}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <MdSave size={18} />
                )
              }
              disabled={isSubmitting || !isChanged}
              onClick={handleSubmit}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
              }}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </Box>
        </Box>
      )}

      {/* Success/Error Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherEditContent;
