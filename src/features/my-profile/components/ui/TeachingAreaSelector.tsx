import SelectDistrictPage from "@/features/search-teacher/components/selectDistrictPage";
import SelectProvincePage from "@/features/search-teacher/components/selectProvincePage";
import type { District, Province } from "@/shared/types/common.type";
import { cn } from "@/shared/utils/cn";
import { useMemo, useState } from "react";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";

export type TeachingArea = {
  province: Province;
  district: District;
};

interface TeachingAreaSelectorProps {
  label: string;
  value: TeachingArea[];
  onChange: (next: TeachingArea[]) => void;
  error?: string;
  maxSelectedAreas?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isEditModeOn?: boolean;
  required?: boolean;
}

export function TeachingAreaSelector({
  label,
  error,
  value,
  onChange,
  maxSelectedAreas = 10,
  placeholder = "Thêm khu vực giảng dạy",
  disabled = false,
  className = "",
  isEditModeOn = true,
  required = false,
}: TeachingAreaSelectorProps) {
  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [pendingProvince, setPendingProvince] = useState<Province | null>(null);
  const [localDistricts, setLocalDistricts] = useState<District[]>([]);

  const isMaxReached = value.length >= maxSelectedAreas;

  const pendingProvinceSelectedDistricts = useMemo(() => {
    if (!pendingProvince) return [];
    return value
      .filter((x) => x.province.id === pendingProvince.id)
      .map((x) => x.district);
  }, [pendingProvince, value]);

  const maxSelectableForPendingProvince = useMemo(() => {
    if (!pendingProvince) return maxSelectedAreas;
    const alreadySelectedInOtherProvinces = value.filter(
      (x) => x.province.id !== pendingProvince.id,
    ).length;
    return Math.max(0, maxSelectedAreas - alreadySelectedInOtherProvinces);
  }, [maxSelectedAreas, pendingProvince, value]);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="text-sm font-medium text-app-text font-['Lexend']">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>

      {value.length > 0 && (
        <div className="space-y-2 mb-3">
          {value.map((area) => (
            <div
              key={`${area.province.id}-${area.district.id}`}
              className={cn(
                "flex items-center gap-2 p-2.5",
                "bg-white border rounded-xl",
                "transition-all duration-200",
                "border-brand/30 hover:bg-brand-soft/30",
              )}
            >
              <FaMapMarkerAlt size={16} className="shrink-0 text-brand" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand truncate font-['Lexend']">
                  {area.district.name}
                </p>
                <p className="text-xs text-app-text-muted truncate">
                  {area.province.name}
                </p>
              </div>
              {isEditModeOn && (
                <button
                  type="button"
                  onClick={() =>
                    onChange(
                      value.filter(
                        (x) =>
                          !(
                            x.province.id === area.province.id &&
                            x.district.id === area.district.id
                          ),
                      ),
                    )
                  }
                  disabled={disabled}
                  className={cn(
                    "shrink-0 w-7 h-7 rounded-full",
                    "flex items-center justify-center",
                    "text-brand hover:bg-brand-soft/60",
                    "active:scale-90 transition-all duration-150",
                    disabled && "opacity-50 cursor-not-allowed",
                  )}
                  aria-label={`Remove ${area.district.name}`}
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditModeOn && (
        <button
          type="button"
          onClick={() => {
            setOpenProvince(true);
          }}
          disabled={disabled || isMaxReached}
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "px-4 py-3 rounded-2xl",
            "border-2 border-dashed border-app-border",
            "bg-app-bg-muted",
            "text-app-text-muted text-sm font-medium font-['Lexend']",
            "transition-all duration-200",
            "hover:border-brand hover:bg-brand-soft/40 hover:text-brand",
            "active:scale-[0.98]",
            (disabled || isMaxReached) &&
              "opacity-50 cursor-not-allowed hover:border-app-border hover:bg-app-bg-muted hover:text-app-text-muted",
            error && "border-app-error bg-app-error-bg",
          )}
        >
          <FaMapMarkerAlt size={20} />
          <span>
            {isMaxReached
              ? `Đã đạt tối đa ${maxSelectedAreas} khu vực`
              : placeholder}
          </span>
        </button>
      )}

      {isEditModeOn && value.length > 0 && (
        <p className="mt-2 text-xs text-app-text-muted font-['Lexend']">
          {value.length}/{maxSelectedAreas} khu vực
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-app-error font-['Lexend']">{error}</p>
      )}

      {openProvince && (
        <SelectProvincePage
          showAllTeachersOnly={false}
          selectedProvince={null}
          onSelect={(p) => {
            setPendingProvince(p);
            setLocalDistricts(
              value
                .filter((x) => x.province.id === p.id)
                .map((x) => x.district),
            );
            // Open the district selector right after choosing a province.
            // (SelectProvincePage doesn't necessarily call onClose after onSelect.)
            setOpenProvince(false);
            setTimeout(() => setOpenDistrict(true), 0);
          }}
          onClose={() => {
            setOpenProvince(false);
          }}
        />
      )}

      {openDistrict && pendingProvince && (
        <SelectDistrictPage
          province={pendingProvince}
          selectedDistricts={localDistricts}
          setSelectedListDistricts={setLocalDistricts}
          onMultiSelect={(next) => {
            onChange([
              ...value.filter((x) => x.province.id !== pendingProvince.id),
              ...next.map((d) => ({ province: pendingProvince, district: d })),
            ]);
          }}
          maxSelected={maxSelectableForPendingProvince}
          onClose={() => {
            setOpenDistrict(false);
            setLocalDistricts(pendingProvinceSelectedDistricts);
          }}
        />
      )}
    </div>
  );
}
