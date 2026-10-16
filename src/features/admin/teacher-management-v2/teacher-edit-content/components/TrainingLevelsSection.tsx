import { useGetTraininLevelList } from "@/features/search-teacher/hooks/useGetTrainingLevelList";
import type { TrainingLevel } from "@/shared/types/common.type";
import React, { useCallback, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Checkbox } from "@headlessui/react";
import type { TeachingInfoFormState } from "../../types";
import type { FormErrors } from "../hooks/useTeacherEditContent";
import { AppInput } from "@/shared/components/ui/app-input";
import { Button } from "@/shared/components/ui/button";
import { SearchableMultiSelect } from "@/shared/components/ui/searchable-multi-select";
import { cn } from "@/shared/utils/cn";

const MAX_PRICE = 100_000_000;

interface Props {
  teachingInfoForm: TeachingInfoFormState;
  setTrainingLevels: (levels: TrainingLevel[]) => void;
  setTeacherProfileField: <K extends keyof TeachingInfoFormState>(
    key: K,
    value: TeachingInfoFormState[K],
  ) => void;
  formErrors?: FormErrors;
  registerFieldRef?: (key: string) => (el: HTMLElement | null) => void;
}

// Utilities for formatting prices
const formatPrice = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined || val === "") return "";
  const numStr = String(val).replace(/\D/g, "");
  if (!numStr) return "";
  return Number(numStr).toLocaleString("vi-VN").replace(/\./g, " ");
};

const parsePrice = (str: string): number | "" => {
  const parsed = parseInt(str.replace(/\D/g, ""), 10);
  return isNaN(parsed) ? "" : parsed;
};

// ── Single training level row ──

interface RowErrors {
  from?: string;
  to?: string;
}

interface TrainingLevelRowProps {
  levelId: string;
  levelName: string;
  priceData: { from: number; to: number; isContactOnly: boolean };
  onChange: (newData: {
    from: number;
    to: number;
    isContactOnly: boolean;
  }) => void;
  onRemove: () => void;
  rowErrors?: RowErrors;
}

const TrainingLevelRow = React.memo(({
  levelName,
  priceData,
  onChange,
  onRemove,
  rowErrors,
}: TrainingLevelRowProps) => {
  const isContact = priceData.isContactOnly;

  return (
    <div
      className={cn(
        "flex items-start gap-6 px-4 py-4 rounded-xl border transition-all duration-200 ease-out",
        isContact
          ? "bg-app-surface border-brand/40"
          : "bg-[#fafbfc] border-app-border hover:border-brand hover:shadow-sm"
      )}
    >
      {/* Level Name Text */}
      <div className="w-[120px] shrink-0 h-8 flex items-center">
        <span className="text-sm font-bold text-app-text tracking-wide select-none">
          {levelName}
        </span>
      </div>

      {/* Price From */}
      <AppInput
        inputSize="sm"
        value={formatPrice(priceData.from || "")}
        onChange={(e) =>
          onChange({
            ...priceData,
            from: parsePrice(e.target.value) || 0,
          })
        }
        type="text"
        placeholder="Giá từ"
        disabled={!!isContact}
        error={rowErrors?.from}
        containerClassName="w-[160px] shrink-0"
        wrapperClassName={cn(isContact ? "bg-transparent" : "bg-white")}
        endIcon={!isContact ? <span className="text-xs text-app-text-muted">₫</span> : undefined}
      />

      {/* Price To */}
      <AppInput
        inputSize="sm"
        value={formatPrice(priceData.to || "")}
        onChange={(e) =>
          onChange({
            ...priceData,
            to: parsePrice(e.target.value) || 0,
          })
        }
        type="text"
        placeholder="Giá đến"
        disabled={!!isContact}
        error={rowErrors?.to}
        containerClassName="w-[160px] shrink-0"
        wrapperClassName={cn(isContact ? "bg-transparent" : "bg-white")}
        endIcon={!isContact ? <span className="text-xs text-app-text-muted">₫</span> : undefined}
      />

      <div className="flex-1" />

      {/* Contact Price Toggle */}
      <div className="h-8 flex items-center shrink-0">
        <div
          onClick={() => {
            const newVal = !isContact;
            onChange({
              from: newVal ? 0 : priceData.from,
              to: newVal ? 0 : priceData.to,
              isContactOnly: newVal,
            });
          }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 user-select-none border select-none w-[100px] shrink-0",
            isContact
              ? "bg-brand/10 border-brand text-brand font-semibold"
              : "bg-transparent border-app-border text-app-text-muted hover:bg-app-surface hover:text-app-text"
          )}
          title={isContact ? "Bỏ liên hệ" : "Giá: Liên hệ"}
        >
          <Checkbox
            checked={!!isContact}
            onChange={() => {}} // Controlled via parent div click
            className="group relative size-4 shrink-0 bg-white rounded border border-app-border cursor-pointer data-checked:bg-brand data-checked:border-brand transition-colors duration-200 flex items-center justify-center"
          >
            <Check className="size-3 text-white opacity-0 group-data-checked:opacity-100 transition-opacity" />
          </Checkbox>
          <span className="text-xs">Liên hệ</span>
        </div>
      </div>

      {/* Delete */}
      <div className="h-8 flex items-center shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-app-text-muted hover:text-app-error hover:bg-app-error/10 transition-colors"
          title="Xóa hạng này"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
});

TrainingLevelRow.displayName = "TrainingLevelRow";

// ── Main Section ──

export const TrainingLevelsSection = React.memo(
  ({
    teachingInfoForm,
    setTrainingLevels,
    setTeacherProfileField,
    formErrors,
    registerFieldRef,
  }: Props) => {
    const { traningLevels } = useGetTraininLevelList();

    const selectedLevels = teachingInfoForm.selectedTrainingLevels;
    const prices = teachingInfoForm.trainingLevelPrices;

    // ── Validation state ──
    const [levelCountError, setLevelCountError] = useState<
      string | undefined
    >();
    const [rowErrors, setRowErrors] = useState<Record<string, RowErrors>>({});
    const [touched, setTouched] = useState(false);

    // Validate how many levels are selected
    const validateLevelCount = useCallback((count: number) => {
      setLevelCountError(count < 1 ? "Cần ít nhất 1 hạng đào tạo" : undefined);
    }, []);

    // Validate prices for a single row, returns the error object
    const validateRow = useCallback(
      (priceData: {
        from: number;
        to: number;
        isContactOnly: boolean;
      }): RowErrors => {
        const errs: RowErrors = {};
        if (priceData.isContactOnly) return errs;

        // Required
        if (!priceData.from) {
          errs.from = "Giá từ là bắt buộc";
        } else if (priceData.from > MAX_PRICE) {
          errs.from = "Không vượt quá 100 000 000₫";
        }

        if (!priceData.to) {
          errs.to = "Giá đến là bắt buộc";
        } else if (priceData.to > MAX_PRICE) {
          errs.to = "Không vượt quá 100 000 000₫";
        }

        // from <= to
        if (priceData.from && priceData.to && priceData.from > priceData.to) {
          errs.from = "Giá từ phải ≤ Giá đến";
        }

        return errs;
      },
      [],
    );

    // Re-validate all rows whenever prices or selectedLevels change
    useEffect(() => {
      if (!touched) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      validateLevelCount(selectedLevels.length);

      const newRowErrors: Record<string, RowErrors> = {};
      for (const level of selectedLevels) {
        const priceData = prices[level.id] || {
          from: 0,
          to: 0,
          isContactOnly: false,
        };
        const errs = validateRow(priceData);
        if (Object.keys(errs).length > 0) {
          newRowErrors[level.id] = errs;
        }
      }
      setRowErrors(newRowErrors);
    }, [selectedLevels, prices, touched, validateLevelCount, validateRow]);

    const handleAutocompleteChange = (newIds: string[]) => {
      const newValue = newIds
        .map((id) => traningLevels.find((lvl) => lvl.id === id))
        .filter((lvl): lvl is TrainingLevel => !!lvl);
      setTrainingLevels(newValue);
      setTouched(true);
    };

    const handlePriceChange = (
      levelId: string,
      newData: { from: number; to: number; isContactOnly: boolean },
    ) => {
      setTeacherProfileField("trainingLevelPrices", {
        ...prices,
        [levelId]: newData,
      });
      setTouched(true);
    };

    const handleRemoveLevel = (levelId: string) => {
      const newLevels = selectedLevels.filter((lvl) => lvl.id !== levelId);
      setTrainingLevels(newLevels);
      setTouched(true);
    };

    const searchableOptions = traningLevels.map((lvl) => ({
      value: lvl.id,
      label: lvl.name,
    }));

    return (
      <div
        ref={registerFieldRef?.("selectedTrainingLevels")}
        className="flex flex-col gap-6"
      >
        <h3 className="text-base font-bold text-app-text flex items-center gap-2 border-b border-app-border pb-3">
          🎓 Hạng đào tạo
        </h3>

        {/* Multi-select control using standard searchable multi-select */}
        <SearchableMultiSelect
          options={searchableOptions}
          value={selectedLevels.map((lvl) => lvl.id)}
          onChange={handleAutocompleteChange}
          placeholder="Tìm và chọn hạng (B, B1, C1, ...)"
          searchPlaceholder="Nhập tên hạng đào tạo để tìm kiếm..."
          label="Chọn hạng đào tạo"
          fullWidth
          error={
            (touched && levelCountError) || formErrors?.selectedTrainingLevels
              ? formErrors?.selectedTrainingLevels || levelCountError
              : undefined
          }
        />

        {formErrors?.trainingLevelPrices && !levelCountError && (
          <p className="text-xs text-app-error">
            {formErrors.trainingLevelPrices}
          </p>
        )}

        {/* Selected training levels list */}
        {selectedLevels.length === 0 ? (
          <div className="text-center py-8 px-4 bg-[#fafbfc] rounded-xl border border-dashed border-app-border flex flex-col gap-1">
            <p className="text-sm font-medium text-app-text-muted">Chưa có hạng đào tạo nào.</p>
            <p className="text-xs text-app-placeholder">Chọn từ danh sách phía trên để thêm.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-6 px-4 pb-1">
              <span className="text-xs font-semibold text-app-text-muted w-[120px] shrink-0">
                Hạng
              </span>
              <span className="text-xs font-semibold text-app-text-muted w-[160px] shrink-0">
                Giá từ
              </span>
              <span className="text-xs font-semibold text-app-text-muted w-[160px] shrink-0">
                Giá đến
              </span>
              <div className="flex-1" />
              <div className="w-[100px] shrink-0" />
              <div className="w-8 shrink-0" />
            </div>

            {/* Rows */}
            {selectedLevels.map((level) => {
              const priceData = prices[level.id] || {
                from: 0,
                to: 0,
                isContactOnly: false,
              };
              return (
                <TrainingLevelRow
                  key={level.id}
                  levelId={level.id}
                  levelName={level.name}
                  priceData={priceData}
                  onChange={(newData) => handlePriceChange(level.id, newData)}
                  onRemove={() => handleRemoveLevel(level.id)}
                  rowErrors={touched ? rowErrors[level.id] : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

TrainingLevelsSection.displayName = "TrainingLevelsSection";

