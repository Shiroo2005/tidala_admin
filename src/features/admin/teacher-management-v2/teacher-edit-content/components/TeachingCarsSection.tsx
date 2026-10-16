import type { ITeachingCarCreateRequest } from "@/features/auth/types";
import { useImagesUpload } from "@/shared/hooks/useImagesUpload";
import { CarType } from "@/shared/types/common.type";
import { UploadItemStatus } from "@/shared/types/storage.type";
import { getStorageUrl } from "@/shared/utils/url";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { AppInput } from "@/shared/components/ui/app-input";
import { SingleSelect } from "@/shared/components/ui/single-select";
import { Textarea } from "@/shared/components/ui/textarea";
import React, { useCallback, useState } from "react";
import { MdAdd, MdAddAPhoto, MdCameraAlt, MdDelete } from "react-icons/md";
import type { TeachingInfoFormState } from "../../types";
import type { FormErrors } from "../hooks/useTeacherEditContent";

interface Props {
  teachingInfoForm: TeachingInfoFormState;
  setTeacherProfileField: <K extends keyof TeachingInfoFormState>(
    key: K,
    value: TeachingInfoFormState[K],
  ) => void;
  formErrors?: FormErrors;
  registerFieldRef?: (key: string) => (el: HTMLElement | null) => void;
}

const emptyCarItem: ITeachingCarCreateRequest = {
  brand: "",
  model: "",
  productionYear: 0,
  type: CarType.MANUAL,
  description: "",
  imageUrl: "",
};

// ── Validation types ──
type CarFieldKey =
  | "imageUrl"
  | "brand"
  | "model"
  | "productionYear"
  | "type"
  | "description";
type CarFieldErrors = Partial<Record<CarFieldKey, string>>;
type CarFieldTouched = Partial<Record<CarFieldKey, boolean>>;

const validateCarField = (key: CarFieldKey, value: string | number): string => {
  if (key === "imageUrl") {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "Vui lòng tải ảnh xe";
    }
  } else if (key === "brand") {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "Hãng xe không được để trống";
    }
  } else if (key === "model") {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "Model không được để trống";
    }
  } else if (key === "productionYear") {
    if (!value || value === 0) {
      return "Năm sản xuất không được để trống";
    }
    const year = typeof value === "string" ? Number(value) : value;
    if (year < 1900 || year > new Date().getFullYear() + 1) {
      return `Năm sản xuất phải từ 1900 đến ${new Date().getFullYear() + 1}`;
    }
  } else if (key === "type") {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "Loại số không được để trống";
    }
  } else if (key === "description") {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "Mô tả không được để trống";
    }
    if (typeof value === "string" && value.trim().length > 50) {
      return "Mô tả không được vượt quá 50 ký tự";
    }
  }
  return "";
};

const MAX_CARS = 5;
const MIN_CARS = 1;

export const TeachingCarsSection = React.memo(
  ({
    teachingInfoForm,
    setTeacherProfileField,
    formErrors,
    registerFieldRef,
  }: Props) => {
    const fields = teachingInfoForm.teachingCars || [];

    // Per-car validation state (indexed by car index)
    const [carErrors, setCarErrors] = useState<Record<number, CarFieldErrors>>(
      {},
    );
    const [carTouched, setCarTouched] = useState<
      Record<number, CarFieldTouched>
    >({});

    const handleAppend = () => {
      if (fields.length >= MAX_CARS) return;
      setTeacherProfileField("teachingCars", [...fields, { ...emptyCarItem }]);
    };

    const handleRemove = (index: number) => {
      const newFields = fields.filter((_, i) => i !== index);
      setTeacherProfileField("teachingCars", newFields);

      // Re-index validation state after removal
      setCarErrors((prev) => {
        const updated: Record<number, CarFieldErrors> = {};
        Object.keys(prev).forEach((k) => {
          const idx = Number(k);
          if (idx < index) updated[idx] = prev[idx];
          else if (idx > index) updated[idx - 1] = prev[idx];
          // skip the removed index
        });
        return updated;
      });
      setCarTouched((prev) => {
        const updated: Record<number, CarFieldTouched> = {};
        Object.keys(prev).forEach((k) => {
          const idx = Number(k);
          if (idx < index) updated[idx] = prev[idx];
          else if (idx > index) updated[idx - 1] = prev[idx];
        });
        return updated;
      });
    };

    const handleChange = (
      index: number,
      updatedItem: ITeachingCarCreateRequest,
    ) => {
      const newItems = [...fields];
      newItems[index] = updatedItem;
      setTeacherProfileField("teachingCars", newItems);
    };

    const updateCarFieldError = (
      carIndex: number,
      field: CarFieldKey,
      value: string | number,
    ) => {
      const errorMsg = validateCarField(field, value);
      setCarErrors((prev) => ({
        ...prev,
        [carIndex]: {
          ...(prev[carIndex] || {}),
          [field]: errorMsg || undefined,
        },
      }));
    };

    const touchCarField = (carIndex: number, field: CarFieldKey) => {
      setCarTouched((prev) => ({
        ...prev,
        [carIndex]: {
          ...(prev[carIndex] || {}),
          [field]: true,
        },
      }));
    };

    const isAtMax = fields.length >= MAX_CARS;
    const isBelowMin = fields.length < MIN_CARS;

    return (
      <Box
        ref={registerFieldRef?.("teachingCars")}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              🚗 Xe tập lái
            </Typography>
            <Typography
              variant="caption"
              sx={{
                bgcolor: "grey.100",
                px: 1,
                py: 0.5,
                borderRadius: 1.5,
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              {fields.length}/{MAX_CARS}
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<MdAdd />}
            onClick={handleAppend}
            disabled={isAtMax}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Thêm xe
          </Button>
        </Box>

        {/* Section-level validation message */}
        {(isBelowMin || formErrors?.teachingCars) && (
          <Alert severity="warning" sx={{ borderRadius: 2, py: 0.5 }}>
            {formErrors?.teachingCars || `Cần ít nhất ${MIN_CARS} xe tập lái`}
          </Alert>
        )}

        {isAtMax && (
          <Alert severity="info" sx={{ borderRadius: 2, py: 0.5 }}>
            Đã đạt tối đa {MAX_CARS} xe
          </Alert>
        )}

        {fields.length === 0 && (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            Chưa có xe tập lái nào. Nhấn "Thêm xe" để bắt đầu.
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {fields.map((field, index) => (
            <CarItemRow
              key={index}
              index={index}
              item={field}
              errors={carErrors[index] || {}}
              touched={carTouched[index] || {}}
              onChange={(updated) => handleChange(index, updated)}
              onRemove={() => handleRemove(index)}
              onValidate={(fieldKey, value) =>
                updateCarFieldError(index, fieldKey, value)
              }
              onTouch={(fieldKey) => touchCarField(index, fieldKey)}
              disableRemove={fields.length <= MIN_CARS}
            />
          ))}
        </Box>
      </Box>
    );
  },
);

TeachingCarsSection.displayName = "TeachingCarsSection";

const carTypeOptions = [
  { value: "manual", label: "Số sàn" },
  { value: "automatic", label: "Số tự động" },
];

// ── Individual Car Row ──

interface CarItemRowProps {
  index: number;
  item: ITeachingCarCreateRequest;
  errors: CarFieldErrors;
  touched: CarFieldTouched;
  onChange: (item: ITeachingCarCreateRequest) => void;
  onRemove: () => void;
  onValidate: (field: CarFieldKey, value: string | number) => void;
  onTouch: (field: CarFieldKey) => void;
  disableRemove: boolean;
}

const CarItemRow = ({
  index,
  item,
  errors,
  touched,
  onChange,
  onRemove,
  onValidate,
  onTouch,
  disableRemove,
}: CarItemRowProps) => {
  const carUpload = useImagesUpload();

  const handleImageSelect = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onChangeField: (value: string) => void,
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      carUpload.clearFiles();
      const newItems = await carUpload.addFiles([file]);

      try {
        const results = await carUpload.uploadFiles("car-images", newItems);
        const objectKey = Object.values(results)[0];
        if (objectKey) {
          onChangeField(objectKey);
          onTouch("imageUrl");
          onValidate("imageUrl", objectKey);
        }
      } catch (error) {
        console.error("Car image upload failed:", error);
      }
    },
    [carUpload, onTouch, onValidate],
  );

  const carImageItem = carUpload.files[0] ?? null;
  const isUploading = carImageItem?.status === UploadItemStatus.UPLOADING;

  const previewSrc = carImageItem?.preview
    ? carImageItem.preview
    : item.imageUrl
      ? getStorageUrl(item.imageUrl)
      : null;

  const imageHasError = touched.imageUrl && !!errors.imageUrl;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#f8fafc",
        borderRadius: 2,
        border: "1px solid",
        borderColor: imageHasError ? "error.main" : "grey.200",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          Xe #{index + 1}
        </Typography>
        <IconButton
          size="small"
          color="error"
          onClick={onRemove}
          disabled={disableRemove}
          title={disableRemove ? "Cần ít nhất 1 xe" : "Xóa xe"}
        >
          <MdDelete size={18} />
        </IconButton>
      </Box>

      {/* Image */}
      <Box>
        <Box
          component="label"
          sx={{
            width: "100%",
            height: 200,
            borderRadius: 2,
            overflow: "hidden",
            border: imageHasError
              ? "2px solid"
              : previewSrc
                ? "1px solid"
                : "2px dashed",
            borderColor: imageHasError
              ? "error.main"
              : previewSrc
                ? "grey.200"
                : "grey.300",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "white",
            cursor: "pointer",
            position: "relative",
            "&:hover": {
              borderColor: imageHasError ? "error.dark" : "grey.400",
            },
            "&:hover .cover-overlay": { opacity: 1 },
            transition: "all 0.2s",
          }}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              handleImageSelect(e, (url) =>
                onChange({ ...item, imageUrl: url }),
              )
            }
          />
          {previewSrc ? (
            <>
              <Box
                component="img"
                src={previewSrc}
                alt="Car"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Fade-in overlay with Change Button */}
              <Box
                className="cover-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.15)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  p: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1.5,
                    backdropFilter: "blur(4px)",
                    transition: "background 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.8)",
                    },
                  }}
                >
                  <MdCameraAlt size={16} />
                  <Typography variant="caption" fontWeight={600}>
                    Thay đổi ảnh xe
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                color: imageHasError ? "error.main" : "text.secondary",
              }}
            >
              <MdAddAPhoto size={24} />
              <Typography variant="caption">Ảnh xe</Typography>
            </Box>
          )}
          {isUploading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
        {imageHasError && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.5, ml: 1.5, display: "block" }}
          >
            {errors.imageUrl}
          </Typography>
        )}
      </Box>

      {/* Fields row 1 */}
      <div className="flex gap-3">
        <AppInput
          value={item.brand}
          onChange={(e) => {
            onChange({ ...item, brand: e.target.value });
            onValidate("brand", e.target.value);
          }}
          onBlur={() => {
            onTouch("brand");
            onValidate("brand", item.brand);
          }}
          error={touched.brand && errors.brand ? errors.brand : undefined}
          label="Hãng xe"
          placeholder="Toyota, KIA..."
          containerClassName="w-full"
        />
        <AppInput
          value={item.model}
          onChange={(e) => {
            onChange({ ...item, model: e.target.value });
            onValidate("model", e.target.value);
          }}
          onBlur={() => {
            onTouch("model");
            onValidate("model", item.model);
          }}
          error={touched.model && errors.model ? errors.model : undefined}
          label="Model"
          placeholder="Vios, Morning..."
          containerClassName="w-full"
        />
      </div>

      {/* Fields row 2 */}
      <div className="flex gap-3">
        <AppInput
          value={item.productionYear || ""}
          type="number"
          label="Năm sản xuất"
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : Number(e.target.value);
            onChange({ ...item, productionYear: val });
            onValidate("productionYear", val);
          }}
          onBlur={() => {
            onTouch("productionYear");
            onValidate("productionYear", item.productionYear);
          }}
          error={touched.productionYear && errors.productionYear ? errors.productionYear : undefined}
          placeholder="VD: 2020"
          containerClassName="w-full"
        />
        <SingleSelect
          options={carTypeOptions}
          value={item.type}
          onChange={(val) => {
            onChange({ ...item, type: val as CarType });
            onTouch("type");
            onValidate("type", val);
          }}
          label="Loại số"
          error={touched.type && errors.type ? errors.type : undefined}
          fullWidth
          containerClassName="w-full"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-app-text">Mô tả</label>
        <Textarea
          value={item.description}
          onChange={(e) => {
            onChange({ ...item, description: e.target.value });
            onValidate("description", e.target.value);
          }}
          onBlur={() => {
            onTouch("description");
            onValidate("description", item.description);
          }}
          aria-invalid={(touched.description && !!errors.description) || undefined}
          className="rounded-xl border border-app-border hover:border-app-border-strong bg-white focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 transition-all duration-200 ease-out outline-none text-sm p-3 min-h-[80px] resize-y placeholder:text-app-placeholder text-app-text disabled:cursor-not-allowed disabled:bg-app-surface disabled:opacity-60"
          placeholder="Mô tả tình trạng xe..."
          maxLength={50}
        />
        {touched.description && errors.description ? (
          <p className="text-xs text-app-error">{errors.description}</p>
        ) : (
          <p className="text-xs text-app-text-muted">
            {`${(item.description || "").length}/50 ký tự`}
          </p>
        )}
      </div>
    </Box>
  );
};
