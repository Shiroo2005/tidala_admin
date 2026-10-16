import type { DrivingCenterFormItem } from "@/features/account/types/type";
import { useAddressAutocomplete } from "@/shared/hooks/useAddressAutocomplete";
import type { IGoongAutoCompleteAddress } from "@/shared/types/goong.type";
import { Box, Chip, Typography } from "@mui/material";
import type { TeachingInfoFormState } from "../../types";
import type { FormErrors } from "../hooks/useTeacherEditContent";

import { useGetDistricstByProvinceId } from "@/features/search-teacher/hooks/useGetDistrictsByProvinceId";
import { useGetProvincesListV2 } from "@/features/search-teacher/hooks/useGetProvincesListV2";
import type { Province } from "@/shared/types/common.type";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdAdd, MdClose, MdLocationOn } from "react-icons/md";
import { AppInput } from "@/shared/components/ui/app-input";
import { SearchableSelect } from "@/shared/components/ui/searchable-select";
import { SearchableMultiSelect } from "@/shared/components/ui/searchable-multi-select";
import { cn } from "@/shared/utils/cn";

interface Props {
  teachingInfoForm: TeachingInfoFormState;
  setTeacherProfileField: <K extends keyof TeachingInfoFormState>(
    key: K,
    value: TeachingInfoFormState[K],
  ) => void;
  teacherProvince?: Province;
  formErrors?: FormErrors;
  registerFieldRef?: (key: string) => (el: HTMLElement | null) => void;
}

// ── Goong Center Search Autocomplete (desktop-friendly, inline) ──

const DEBOUNCE_MS = 500;

interface CenterSearchProps {
  type: "PRACTICE_GROUND" | "TEST_CENTER";
  selectedPlaceIds: string[];
  onSelect: (address: IGoongAutoCompleteAddress) => void;
  onClose: () => void;
}

const CenterSearchInput = ({
  type,
  selectedPlaceIds,
  onSelect,
  onClose,
}: CenterSearchProps) => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [keyword]);

  const { data, isLoading } = useAddressAutocomplete(debouncedKeyword);

  const filteredResults = useMemo(() => {
    const predictions = data?.predictions ?? [];
    return predictions.filter((p) => !selectedPlaceIds.includes(p.place_id));
  }, [data?.predictions, selectedPlaceIds]);

  const canSearch = keyword.trim().length > 2;
  const isDebouncing = canSearch && keyword !== debouncedKeyword;
  const showLoading = canSearch && (isLoading || isDebouncing);

  const label =
    type === "PRACTICE_GROUND" ? "Tìm sân tập..." : "Tìm sân sát hạch...";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <AppInput
        autoFocus
        placeholder={label}
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        loading={showLoading}
        endIcon={
          <button
            type="button"
            onClick={onClose}
            className="text-app-text-muted hover:text-app-text transition-colors"
          >
            <MdClose size={18} />
          </button>
        }
      />

      {/* Autocomplete Dropdown List */}
      {open && canSearch && (
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-1.5",
            "rounded-xl border border-app-border/80 bg-white",
            "shadow-lg shadow-black/8 overflow-hidden",
            "animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1",
            "duration-150 ease-out",
          )}
        >
          <div className="max-h-56 overflow-y-auto overscroll-contain p-1">
            {showLoading ? (
              <div className="flex items-center justify-center py-6 text-sm text-app-text-muted">
                Đang tìm kiếm...
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-sm text-app-text-muted">
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredResults.map((option) => (
                <button
                  key={option.place_id}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    onClose();
                  }}
                  className={cn(
                    "flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left text-sm",
                    "transition-colors duration-100 cursor-pointer hover:bg-app-surface",
                  )}
                >
                  <span className="font-semibold text-brand">
                    {option.structured_formatting.main_text}
                  </span>
                  {option.structured_formatting.secondary_text && (
                    <span className="text-xs text-app-text-muted">
                      {option.structured_formatting.secondary_text}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Center List Item ──

interface CenterItemProps {
  center: DrivingCenterFormItem;
  color: "primary" | "warning";
  onRemove: () => void;
}

const CenterItem = ({ center, color, onRemove }: CenterItemProps) => (
  <Chip
    icon={<MdLocationOn size={16} />}
    label={
      <Box sx={{ display: "flex", flexDirection: "column", py: 0.25 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {center.structured_formatting.main_text}
        </Typography>
        {center.structured_formatting.secondary_text && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {center.structured_formatting.secondary_text}
          </Typography>
        )}
      </Box>
    }
    onDelete={onRemove}
    color={color}
    variant="outlined"
    sx={{
      height: "auto",
      py: 0.5,
      "& .MuiChip-label": { maxWidth: 380 },
    }}
  />
);

// ── Single Section for Practice / Examination Centers ──

interface CenterSectionProps {
  title: string;
  type: "PRACTICE_GROUND" | "TEST_CENTER";
  chipColor: "primary" | "warning";
  value: DrivingCenterFormItem[];
  onChange: (next: DrivingCenterFormItem[]) => void;
  maxCenters?: number;
  error?: string;
  registerFieldRef?: (key: string) => (el: HTMLElement | null) => void;
  fieldKey?: string;
}

const CenterSection = ({
  title,
  type,
  chipColor,
  value,
  onChange,
  maxCenters = 3,
  error,
  registerFieldRef,
  fieldKey,
}: CenterSectionProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const isMaxReached = value.length >= maxCenters;

  const handleAddCenter = useCallback(
    (address: IGoongAutoCompleteAddress) => {
      if (isMaxReached) return;
      const newItem: DrivingCenterFormItem = {
        ...address,
        source: "NEW",
        type: type,
      };
      onChange([...value, newItem]);
    },
    [isMaxReached, onChange, type, value],
  );

  const handleRemove = useCallback(
    (placeId: string) => {
      onChange(value.filter((c) => c.place_id !== placeId));
    },
    [onChange, value],
  );

  return (
    <Box
      ref={fieldKey ? registerFieldRef?.(fieldKey) : undefined}
      sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
    >
      <Typography variant="body2" fontWeight={600}>
        {title}
      </Typography>

      {/* Selected centers */}
      {value.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {value.map((center) => (
            <CenterItem
              key={center.place_id}
              center={center}
              color={chipColor}
              onRemove={() => handleRemove(center.place_id)}
            />
          ))}
        </Box>
      )}

      {/* Search input or Add button */}
      {showSearch ? (
        <CenterSearchInput
          type={type}
          selectedPlaceIds={value.map((c) => c.place_id)}
          onSelect={handleAddCenter}
          onClose={() => setShowSearch(false)}
        />
      ) : (
        <Chip
          icon={<MdAdd size={18} />}
          label={
            isMaxReached
              ? `Đã đạt tối đa ${maxCenters} trung tâm`
              : type === "PRACTICE_GROUND"
                ? "Thêm sân tập"
                : "Thêm sân sát hạch"
          }
          onClick={isMaxReached ? undefined : () => setShowSearch(true)}
          variant="outlined"
          disabled={isMaxReached}
          sx={{
            width: "fit-content",
            borderStyle: "dashed",
            cursor: isMaxReached ? "not-allowed" : "pointer",
          }}
        />
      )}

      {/* Counter */}
      {value.length > 0 && (
        <Typography variant="caption" color="text.secondary">
          {value.length}/{maxCenters}{" "}
          {type === "PRACTICE_GROUND" ? "sân tập" : "sân sát hạch"} đã chọn
        </Typography>
      )}

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

// ── Main LocationsSection ──

export const LocationsSection = React.memo(
  ({
    teachingInfoForm,
    setTeacherProfileField,
    teacherProvince,
    formErrors,
    registerFieldRef,
  }: Props) => {
    const teachingAreas = teachingInfoForm.teachingAreas;

    const [activeProvince, setActiveProvince] = useState<Province | null>(
      () => {
        if (teacherProvince) return teacherProvince;
        if (
          teachingAreas &&
          teachingAreas.length > 0 &&
          teachingAreas[0].province
        ) {
          return teachingAreas[0].province;
        }
        return null;
      },
    );

    const { listProvinces } = useGetProvincesListV2();
    const { listDistricts } = useGetDistricstByProvinceId(
      activeProvince?.id || "",
    );

    const activeProvinceSelectedDistricts = useMemo(() => {
      return activeProvince
        ? teachingAreas
            .filter((area) => area.province.id === activeProvince.id)
            .map((area) => area.district)
        : [];
    }, [activeProvince, teachingAreas]);

    // ── Validation state ──
    type ValidationFields =
      | "province"
      | "districts"
      | "practiceCenters"
      | "examinationCenters";

    const [errors, setErrors] = useState<
      Partial<Record<ValidationFields, string>>
    >({});
    const [touched, setTouched] = useState<
      Partial<Record<ValidationFields, boolean>>
    >({});

    // Re-validate province whenever activeProvince changes
    useEffect(() => {
      if (touched.province) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setErrors((prev) => ({
          ...prev,
          province: activeProvince ? undefined : "Vui lòng chọn Tỉnh/Thành phố",
        }));
      }
    }, [activeProvince, touched.province]);

    // Re-validate districts whenever teachingAreas changes
    useEffect(() => {
      if (touched.districts && activeProvince) {
        const districtCount = activeProvinceSelectedDistricts.length;
        let errMsg: string | undefined;
        if (districtCount < 1) {
          errMsg = "Vui lòng chọn ít nhất 1 Quận/Huyện";
        } else if (districtCount > 10) {
          errMsg = `Tối đa 10 Quận/Huyện (hiện có ${districtCount})`;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setErrors((prev) => ({ ...prev, districts: errMsg }));
      }
    }, [
      activeProvinceSelectedDistricts.length,
      activeProvince,
      touched.districts,
    ]);

    // Re-validate practice centers
    useEffect(() => {
      if (touched.practiceCenters) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setErrors((prev) => ({
          ...prev,
          practiceCenters:
            teachingInfoForm.practiceCenters.length < 1
              ? "Cần ít nhất 1 sân tập"
              : undefined,
        }));
      }
    }, [teachingInfoForm.practiceCenters.length, touched.practiceCenters]);

    // Re-validate examination centers
    useEffect(() => {
      if (touched.examinationCenters) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setErrors((prev) => ({
          ...prev,
          examinationCenters:
            teachingInfoForm.examinationCenters.length < 1
              ? "Cần ít nhất 1 trung tâm sát hạch"
              : undefined,
        }));
      }
    }, [
      teachingInfoForm.examinationCenters.length,
      touched.examinationCenters,
    ]);

    const provinceOptions = useMemo(() => {
      return listProvinces.map((p) => ({
        value: p.id,
        label: p.name,
      }));
    }, [listProvinces]);

    const districtOptions = useMemo(() => {
      return (listDistricts || []).map((d) => ({
        value: d.id,
        label: d.name,
      }));
    }, [listDistricts]);

    const activeProvinceSelectedDistrictIds = useMemo(() => {
      return activeProvinceSelectedDistricts.map((d) => d.id);
    }, [activeProvinceSelectedDistricts]);

    const handleProvinceChange = useCallback(
      (provinceId: string) => {
        const selectedProvince =
          listProvinces.find((p) => p.id === provinceId) || null;
        if (selectedProvince?.id !== activeProvince?.id) {
          setTeacherProfileField("teachingAreas", []);
        }
        setActiveProvince(selectedProvince);
        setTouched((prev) => ({
          ...prev,
          province: true,
          districts: true,
        }));
      },
      [listProvinces, activeProvince, setTeacherProfileField],
    );

    const handleDistrictChange = useCallback(
      (newDistrictIds: string[]) => {
        if (!activeProvince) return;

        const newDistricts = newDistrictIds
          .map((id) => (listDistricts || []).find((d) => d.id === id))
          .filter((d): d is NonNullable<typeof d> => !!d);

        const newlyAddedAreas = newDistricts.map((d) => ({
          province: activeProvince,
          district: d,
        }));

        if (newlyAddedAreas.length <= 10) {
          setTeacherProfileField("teachingAreas", newlyAddedAreas);
        } else {
          setTeacherProfileField("teachingAreas", newlyAddedAreas.slice(0, 10));
        }
        setTouched((prev) => ({ ...prev, districts: true }));
      },
      [activeProvince, listDistricts, setTeacherProfileField],
    );

    return (
      <Box
        ref={registerFieldRef?.("teachingAreas")}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          📍 Khu vực hoạt động
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            Khu vực giảng dạy
          </Typography>

          {/* Selected Areas Chips */}
          {teachingAreas.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {teachingAreas.map((area) => (
                <Chip
                  key={`${area.province.id}-${area.district.id}`}
                  label={`${area.district.name}, ${area.province.name}`}
                  onDelete={() => {
                    setTeacherProfileField(
                      "teachingAreas",
                      teachingAreas.filter(
                        (a) =>
                          !(
                            a.province.id === area.province.id &&
                            a.district.id === area.district.id
                          ),
                      ),
                    );
                  }}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {/* Add New Area Controls */}
          <div className="flex gap-4 items-start w-full">
            <div className="flex-1">
              <SearchableSelect
                options={provinceOptions}
                value={activeProvince?.id || ""}
                onChange={handleProvinceChange}
                placeholder="Chọn Tỉnh/Thành"
                label="Tỉnh/Thành phố"
                fullWidth
                error={
                  (touched.province && errors.province) ||
                  formErrors?.teachingAreas
                    ? formErrors?.teachingAreas || errors.province
                    : undefined
                }
              />
            </div>
            <div className="flex-[2]">
              <SearchableMultiSelect
                disabled={!activeProvince}
                options={districtOptions}
                value={activeProvinceSelectedDistrictIds}
                onChange={handleDistrictChange}
                placeholder={
                  activeProvince
                    ? "Chọn Quận/Huyện"
                    : "Vui lòng chọn Tỉnh/Thành phố trước"
                }
                label="Quận/Huyện"
                fullWidth
                error={
                  touched.districts && errors.districts
                    ? errors.districts
                    : undefined
                }
              />
            </div>
          </div>
        </Box>

        {/* Practice Centers */}
        <CenterSection
          title="🏋️ Sân tập"
          type="PRACTICE_GROUND"
          chipColor="primary"
          value={teachingInfoForm.practiceCenters}
          onChange={(next) => {
            setTeacherProfileField("practiceCenters", next);
            setTouched((prev) => ({ ...prev, practiceCenters: true }));
          }}
          maxCenters={3}
          error={
            formErrors?.practiceCenters
              ? formErrors.practiceCenters
              : touched.practiceCenters && errors.practiceCenters
                ? errors.practiceCenters
                : undefined
          }
          registerFieldRef={registerFieldRef}
          fieldKey="practiceCenters"
        />

        {/* Examination Centers */}
        <CenterSection
          title="📝 Trung tâm sát hạch"
          type="TEST_CENTER"
          chipColor="warning"
          value={teachingInfoForm.examinationCenters}
          onChange={(next) => {
            setTeacherProfileField("examinationCenters", next);
            setTouched((prev) => ({ ...prev, examinationCenters: true }));
          }}
          maxCenters={3}
          error={
            formErrors?.examinationCenters
              ? formErrors.examinationCenters
              : touched.examinationCenters && errors.examinationCenters
                ? errors.examinationCenters
                : undefined
          }
          registerFieldRef={registerFieldRef}
          fieldKey="examinationCenters"
        />
      </Box>
    );
  },
);

LocationsSection.displayName = "LocationsSection";
