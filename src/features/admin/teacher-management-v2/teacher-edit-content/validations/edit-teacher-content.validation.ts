import type { BasicInfoFormState, TeachingInfoFormState } from "../../types";
import type { FormErrors } from "../hooks/useTeacherEditContent";

type ValidateOk = { ok: true; errors: FormErrors };
type ValidateFail = {
  ok: false;
  errors: FormErrors;
  firstErrorKey: keyof FormErrors;
};

export type ValidateEditTeacherContentResult = ValidateOk | ValidateFail;

const PHONE_REGEX = /^(0|\+84)[3|5|7|8|9]\d{8}$/;

export function getFirstErrorKey(errors: FormErrors): keyof FormErrors | null {
  const visualOrder: Array<keyof FormErrors> = [
    "coverImageUrl",
    "avatarUrl",
    "fullName",
    "phoneNumber",
    "zalo",
    "bio",
    "description",
    "teachingAreas",
    "selectedTrainingLevels",
    "trainingLevelPrices",
    "practiceCenters",
    "examinationCenters",
    "realPhotos",
    "teachingCars",
    "experienceYears",
    "studentsTrained",
    "specialtyTags",
    "styleTags",
    "tags",
    "latitude",
    "longitude",
  ];

  for (const k of visualOrder) {
    if (errors[k]) return k;
  }

  // Fallback for any other keys not in the list
  const allKeys = Object.keys(errors) as Array<keyof FormErrors>;
  for (const k of allKeys) {
    if (errors[k]) return k;
  }

  return null;
}

export function validateEditTeacherContentStep0(
  teacher: TeachingInfoFormState,
  account: BasicInfoFormState,
): FormErrors {
  const errors: FormErrors = {};

  if (!account?.fullName?.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên";
  }

  if (!account?.avatarUrl?.trim()) {
    errors.avatarUrl = "Ảnh đại diện là bắt buộc";
  }

  const accountPhone = account?.phoneNumber?.trim();
  if (!accountPhone) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!PHONE_REGEX.test(accountPhone)) {
    errors.phoneNumber = "Số điện thoại không hợp lệ (VD: 0912345678)";
  }

  const zalo = teacher?.zalo?.trim();
  if (!zalo) {
    errors.zalo = "Vui lòng nhập số Zalo";
  } else if (!PHONE_REGEX.test(zalo)) {
    errors.zalo = "Số Zalo không hợp lệ (VD: 0912345678)";
  } else if (zalo.length > 20) {
    errors.zalo = "Số Zalo không được vượt quá 20 ký tự";
  }

  const bio = teacher?.bio?.trim();
  if (bio) {
    if (bio.length < 10) {
      errors.bio = "Mô tả ngắn nên dài ít nhất 10 ký tự";
    } else if (bio.length > 200) {
      errors.bio = "Mô tả ngắn không được vượt quá 200 ký tự";
    }
  }

  const description = teacher?.description?.trim();
  if (description && description.length > 1000) {
    errors.description = "Giới thiệu chi tiết không được vượt quá 1000 ký tự";
  }

  // Lat/Lng are now optional for update

  return errors;
}

export function validateEditTeacherContentStep1(
  teacher: TeachingInfoFormState,
): FormErrors {
  const errors: FormErrors = {};

  if (teacher.teachingAreas.length === 0) {
    errors.teachingAreas = "Vui lòng chọn ít nhất 1 khu vực giảng dạy";
  }

  if (teacher.selectedTrainingLevels.length === 0) {
    errors.selectedTrainingLevels = "Vui lòng chọn ít nhất 1 loại bằng";
  }

  const hasAnyMissingPrice = teacher.selectedTrainingLevels.some((lvl) => {
    const p = teacher.trainingLevelPrices[lvl.id];
    if (!p) return true;
    if (p.isContactOnly) return false;

    if (!Number.isFinite(p.from) || p.from <= 0) return true;
    if (!Number.isFinite(p.to) || p.to <= 0) return true;
    return false;
  });

  if (teacher.selectedTrainingLevels.length > 0 && hasAnyMissingPrice) {
    errors.trainingLevelPrices =
      "Vui lòng nhập giá (Từ/Đến) hoặc chọn Liên hệ cho từng loại bằng";
  }

  // Practice/examination centers are optional now.

  // Update logic: if photos provided, must be at least 3
  if (
    teacher.realPhotos &&
    teacher.realPhotos.length > 0 &&
    teacher.realPhotos.length < 3
  ) {
    errors.realPhotos = "Vui lòng tải lên ít nhất 3 ảnh thực tế";
  } else if (teacher.realPhotos && teacher.realPhotos.length > 6) {
    errors.realPhotos = "Tối đa chỉ được tải lên 6 ảnh thực tế";
  }

  // Update logic: teachingCars are optional; if provided validate items
  if (teacher.teachingCars && teacher.teachingCars.length > 10) {
    errors.teachingCars = "Tối đa 10 xe dạy";
  } else if (teacher.teachingCars && teacher.teachingCars.length > 0) {
    // Validate individual car fields
    for (let i = 0; i < teacher.teachingCars.length; i++) {
      const car = teacher.teachingCars[i];
      const missingFields: string[] = [];
      if (!car.imageUrl?.trim()) missingFields.push("ảnh xe");
      if (!car.brand?.trim()) missingFields.push("hãng xe");
      if (!car.model?.trim()) missingFields.push("model");
      if (!car.productionYear || car.productionYear === 0)
        missingFields.push("năm sản xuất");
      if (!car.type?.trim()) missingFields.push("loại số");
      if (!car.description?.trim()) missingFields.push("mô tả");

      if (missingFields.length > 0) {
        errors.teachingCars = `Xe #${i + 1}: Thiếu ${missingFields.join(", ")}`;
        break;
      }

      if (car.description && car.description.trim().length > 50) {
        errors.teachingCars = `Xe #${i + 1}: Mô tả không được vượt quá 50 ký tự`;
        break;
      }
    }
  }

  return errors;
}

export function validateEditTeacherContentStep2(
  teacher: TeachingInfoFormState,
): FormErrors {
  const errors: FormErrors = {};

  if (!teacher.experienceYears) {
    errors.experienceYears = "Vui lòng chọn số năm kinh nghiệm";
  }

  if (!teacher.studentsTrained) {
    errors.studentsTrained = "Vui lòng chọn số học viên đã đào tạo";
  }

  const specialtyCount = teacher.specialtyTags?.length ?? 0;
  const styleCount = teacher.styleTags?.length ?? 0;
  const totalTags = specialtyCount + styleCount;

  if (specialtyCount === 0 || styleCount === 0) {
    errors.tags = "Vui lòng chọn ít nhất 1 thẻ chuyên môn và 1 thẻ phong cách";
  } else if (totalTags > 3) {
    errors.tags = "Tổng số thẻ không được vượt quá 3";
  }

  return errors;
}

export function validateEditTeacherContentAll(
  teacher: TeachingInfoFormState,
  account: BasicInfoFormState,
): ValidateEditTeacherContentResult {
  const step0 = validateEditTeacherContentStep0(teacher, account);
  const step1 = validateEditTeacherContentStep1(teacher);
  const step2 = validateEditTeacherContentStep2(teacher);
  const errors: FormErrors = {
    ...step0,
    ...step1,
    ...step2,
  };

  const hasAnyError = Object.values(errors).some(Boolean);

  if (!hasAnyError) {
    return { ok: true, errors };
  }

  const firstErrorKey = getFirstErrorKey(errors);

  return {
    ok: false,
    errors,
    firstErrorKey: firstErrorKey!,
  };
}
