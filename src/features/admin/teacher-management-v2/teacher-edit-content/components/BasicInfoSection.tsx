import { ExperienceYears, StudentsTrained } from "@/shared/types/common.type";
import React, { useState } from "react";
import type { BasicInfoFormState, TeachingInfoFormState } from "../../types";
import type { FormErrors } from "../hooks/useTeacherEditContent";
import { AppInput } from "@/shared/components/ui/app-input";
import { SingleSelect } from "@/shared/components/ui/single-select";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";

interface Props {
  teachingInfoForm: TeachingInfoFormState;
  setTeacherProfileField: <K extends keyof TeachingInfoFormState>(
    key: K,
    value: TeachingInfoFormState[K],
  ) => void;
  basicInfoForm: BasicInfoFormState;
  setAccountField: <K extends keyof BasicInfoFormState>(
    key: K,
    value: BasicInfoFormState[K],
  ) => void;
  formErrors?: FormErrors;
  registerFieldRef?: (key: string) => (el: HTMLElement | null) => void;
}

const experienceOptions = [
  { value: ExperienceYears.ONE_TO_THREE, label: "1–3 năm" },
  { value: ExperienceYears.THREE_TO_FIVE, label: "3–5 năm" },
  { value: ExperienceYears.FIVE_TO_TEN, label: "5–10 năm" },
  { value: ExperienceYears.TEN_PLUS, label: "Trên 10 năm" },
];

const studentsTrainedOptions = [
  { value: StudentsTrained.LOWER_THAN_100, label: "Dưới 100" },
  { value: StudentsTrained.FROM_100, label: "Từ 100" },
  { value: StudentsTrained.FROM_300, label: "Từ 300" },
  { value: StudentsTrained.FROM_500, label: "Từ 500" },
  { value: StudentsTrained.FROM_1000, label: "Trên 1000" },
];

export const BasicInfoSection = React.memo(
  ({
    teachingInfoForm,
    setTeacherProfileField,
    basicInfoForm,
    formErrors,
    registerFieldRef,
  }: Props) => {
    type ValidationFields =
      | "fullName"
      | "phoneNumber"
      | "bio"
      | "zalo"
      | "description";

    const [errors, setErrors] = useState<
      Partial<Record<ValidationFields, string>>
    >({});
    const [touched, setTouched] = useState<
      Partial<Record<ValidationFields, boolean>>
    >({});

    const validateField = (key: ValidationFields, value: string) => {
      let errorMsg = "";
      if (key === "fullName") {
        if (!value.trim()) {
          errorMsg = "Họ và tên không được để trống";
        } else if (value.trim().length < 10) {
          errorMsg = "Phải có ít nhất 10 ký tự";
        }
      } else if (key === "phoneNumber") {
        if (!value.trim()) {
          errorMsg = "Số điện thoại không được để trống";
        } else if (!/^[0-9]{10}$/.test(value.trim())) {
          errorMsg = "Số điện thoại không đúng định dạng";
        }
      } else if (key === "zalo") {
        if (!value.trim()) {
          errorMsg = "Số Zalo không được để trống";
        } else if (!/^[0-9]{10}$/.test(value.trim())) {
          errorMsg = "Số Zalo không đúng định dạng";
        }
      } else if (key === "bio") {
        const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
        if (wordsCount > 100) {
          errorMsg = "Giới thiệu ngắn không được vượt quá 100 từ";
        }
      } else if (key === "description") {
        const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
        if (wordsCount > 200) {
          errorMsg = "Mô tả chi tiết không được vượt quá 200 từ";
        }
      }

      setErrors((prev) => ({
        ...prev,
        [key]: errorMsg || undefined,
      }));
    };

    // Helper: show error if parent formErrors has it OR local touched+error
    const getFieldError = (key: ValidationFields) => {
      // Parent submit-time errors take priority and show without touched
      if (formErrors?.[key as keyof FormErrors]) {
        return formErrors[key as keyof FormErrors];
      }
      // Local real-time errors only show if touched
      if (touched[key] && errors[key]) {
        return errors[key];
      }
      return undefined;
    };

    const hasFieldError = (key: ValidationFields) => !!getFieldError(key);

    return (
      <div className="flex flex-col gap-6">
        <h3 className="text-base font-bold text-app-text flex items-center gap-2 border-b border-app-border pb-3">
          📝 Thông tin cơ bản
        </h3>

        {/* Full Name & Phone Number Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AppInput
            ref={registerFieldRef?.("fullName")}
            value={basicInfoForm.fullName || ""}
            label="Họ và tên"
            placeholder="Nhập họ và tên đầy đủ"
            disabled
          />

          <AppInput
            ref={registerFieldRef?.("phoneNumber")}
            value={basicInfoForm.phoneNumber || ""}
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            disabled
          />
        </div>

        {/* Bio */}
        <AppInput
          ref={registerFieldRef?.("bio")}
          value={teachingInfoForm.bio || ""}
          onChange={(e) => {
            setTeacherProfileField("bio", e.target.value);
            validateField("bio", e.target.value);
          }}
          onBlur={(e) => {
            setTouched((prev) => ({ ...prev, bio: true }));
            validateField("bio", e.target.value);
          }}
          error={getFieldError("bio")}
          label="Giới thiệu ngắn (Bio)"
          placeholder="VD: Thầy Minh – 10 năm kinh nghiệm, chuyên dạy lái xe B2"
        />

        {/* Description textarea */}
        <div
          ref={registerFieldRef?.("description")}
          className="flex flex-col gap-1.5 w-full animate-fade-in"
        >
          <label className="text-sm font-medium text-app-text">
            Mô tả chi tiết
          </label>
          <Textarea
            value={teachingInfoForm.description || ""}
            onChange={(e) => {
              setTeacherProfileField("description", e.target.value);
              validateField("description", e.target.value);
            }}
            onBlur={(e) => {
              setTouched((prev) => ({ ...prev, description: true }));
              validateField("description", e.target.value);
            }}
            aria-invalid={hasFieldError("description") || undefined}
            className="rounded-xl border border-app-border hover:border-app-border-strong bg-white focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 transition-all duration-200 ease-out outline-none text-sm p-3 min-h-[110px] resize-y placeholder:text-app-placeholder text-app-text disabled:cursor-not-allowed disabled:bg-app-surface disabled:opacity-60"
            placeholder="Mô tả kinh nghiệm, phong cách dạy, thành tích..."
          />
          {hasFieldError("description") && (
            <p className="text-xs text-app-error">
              {getFieldError("description")}
            </p>
          )}
        </div>

        {/* Experience & Students Trained Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div ref={registerFieldRef?.("experienceYears")} className="w-full">
            <SingleSelect
              options={experienceOptions}
              value={teachingInfoForm.experienceYears || ""}
              onChange={(val) =>
                setTeacherProfileField(
                  "experienceYears",
                  val as ExperienceYears,
                )
              }
              label="Kinh nghiệm"
              error={getFieldError("experienceYears" as ValidationFields)}
              fullWidth
            />
          </div>

          <div ref={registerFieldRef?.("studentsTrained")} className="w-full">
            <SingleSelect
              options={studentsTrainedOptions}
              value={teachingInfoForm.studentsTrained || ""}
              onChange={(val) =>
                setTeacherProfileField(
                  "studentsTrained",
                  val as StudentsTrained,
                )
              }
              label="Số học viên đã dạy"
              error={getFieldError("studentsTrained" as ValidationFields)}
              fullWidth
            />
          </div>
        </div>

        {/* Current Students Switch & Zalo Number Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
          <div className="flex items-center h-10 pb-1.5">
            <Switch
              checked={!!teachingInfoForm.hasCurrentStudents}
              onCheckedChange={(checked) =>
                setTeacherProfileField("hasCurrentStudents", checked)
              }
              label="Đang có học viên"
            />
          </div>

          <AppInput
            ref={registerFieldRef?.("zalo")}
            value={teachingInfoForm.zalo || ""}
            onChange={(e) => {
              setTeacherProfileField("zalo", e.target.value);
              validateField("zalo", e.target.value);
            }}
            onBlur={(e) => {
              setTouched((prev) => ({ ...prev, zalo: true }));
              validateField("zalo", e.target.value);
            }}
            error={getFieldError("zalo")}
            label="Số Zalo"
            placeholder="Nhập số điện thoại Zalo"
          />
        </div>
      </div>
    );
  },
);

BasicInfoSection.displayName = "BasicInfoSection";
