import type {
  BasicInfoFormState,
  TeacherProfileUpdatePayload,
  TeachingInfoFormState,
} from "@/features/admin/teacher-management-v2/types";
import type {
  ITeacherProfileSetupPayload,
  ITeachingCarCreateRequest,
  ITrainingLevelPrice,
} from "@/features/auth/types";
import type {
  ExperienceYears,
  StudentsTrained,
} from "@/shared/types/common.type";
import type { AccountFormState, TeacherProfileFormState } from "../types";

export interface UpdateMyProfilePayloadType {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
  teacherProfile?: {
    contactPhoneNumber: string;
    coverImageUrl: string;
    bio: string;
    description: string;
    lat?: number;
    lng?: number;
    realPhotos?: string[];
    experienceYears: ExperienceYears;
    studentsTrained: StudentsTrained;
    hasCurrentStudents: boolean;
    zalo: string;
    districtIds: string[];
    drivingCenterIds: string[];
    trainingLevels: ITrainingLevelPrice[];
    teachingCars?: ITeachingCarCreateRequest[];
    tagIds: string[];
  };
}

export interface EditTeacherContentPayloadType {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
  teacherProfile?: {
    coverImageUrl: string;
    bio: string;
    description: string;
    lat?: number;
    lng?: number;
    realPhotos?: string[];
    experienceYears: ExperienceYears;
    studentsTrained: StudentsTrained;
    hasCurrentStudents: boolean;
    zalo: string;
    districtIds: string[];
    drivingCenterIds: string[];
    trainingLevels: ITrainingLevelPrice[];
    teachingCars: ITeachingCarCreateRequest[];
    tagIds: string[];
  };
}

export const buildUpdateMyProfilePayload = (
  account: AccountFormState,
  drivingCenterIds: string[],
  teacher?: TeacherProfileFormState,
): UpdateMyProfilePayloadType => {
  const base: UpdateMyProfilePayloadType = {
    fullName: account.fullName,
    avatarUrl: account.avatarUrl,
    phoneNumber: account.phoneNumber,
  };

  if (!teacher) return base;

  return {
    ...base,
    teacherProfile: {
      coverImageUrl: teacher.coverImageUrl || "",
      bio: teacher.bio,
      description: teacher.description,
      contactPhoneNumber: teacher.contactPhoneNumber,
      lat: teacher.latitude ?? undefined,
      lng: teacher.longitude ?? undefined,
      districtIds: teacher.teachingAreas.map((area) => area.district.id),
      experienceYears: teacher.experienceYears!,
      hasCurrentStudents: teacher.hasCurrentStudents,
      realPhotos: teacher.realPhotos && teacher.realPhotos.length > 0 ? teacher.realPhotos : undefined,
      zalo: teacher.zalo,
      studentsTrained: teacher.studentsTrained!,
      teachingCars: teacher.teachingCars && teacher.teachingCars.length > 0 ? teacher.teachingCars : undefined,
      trainingLevels: teacher.selectedTrainingLevels.map((level) => ({
        trainingLevelId: level.id,
        priceFrom: teacher.trainingLevelPrices[level.id]?.from || 0,
        priceTo: teacher.trainingLevelPrices[level.id]?.to || 0,
        validPriceRange:
          teacher.trainingLevelPrices[level.id]?.isContactOnly || false,
      })),
      drivingCenterIds: drivingCenterIds,
      tagIds: [
        ...(teacher.specialtyTags || []),
        ...(teacher.styleTags || []),
      ].map((tag) => tag.id),
    },
  };
};

export const buildEditTeacherContentPayload = (
  account: BasicInfoFormState,
  drivingCenterIds: string[],
  teacher: TeachingInfoFormState,
): TeacherProfileUpdatePayload => {
  return {
    bio: teacher.bio,
    description: teacher.description,
    experienceYears: teacher.experienceYears!,
    studentsTrained: teacher.studentsTrained!,
    hasCurrentStudents: teacher.hasCurrentStudents,
    zalo: teacher.zalo,
    avatarUrl: account.avatarUrl || "",
    coverImageUrl: teacher.coverImageUrl || "",
    realPhotos: teacher.realPhotos,
    trainingLevels: teacher.selectedTrainingLevels.map((level) => ({
      trainingLevelId: level.id,
      priceFrom: teacher.trainingLevelPrices[level.id]?.from || 0,
      priceTo: teacher.trainingLevelPrices[level.id]?.to || 0,
    })),
    districtIds: teacher.teachingAreas.map((area) => area.district.id),
    drivingCenterIds: drivingCenterIds,
    tagIds: [
      ...(teacher.specialtyTags || []),
      ...(teacher.styleTags || []),
    ].map((tag) => tag.id),
    teachingCars: teacher.teachingCars.map((car) => ({
      brand: car.brand,
      model: car.model,
      productionYear: car.productionYear,
      type: car.type,
      description: car.description,
      imageUrl: car.imageUrl,
    })),
  };
};

export const buildCreateTeacherProfilePayload = (
  teacher: TeacherProfileFormState,
): ITeacherProfileSetupPayload => {
  return {
    bio: teacher.bio,
    description: teacher.description,
    contactPhoneNumber: teacher.contactPhoneNumber,
    lat: teacher.latitude ?? undefined,
    lng: teacher.longitude ?? undefined,
    districtIds: teacher.teachingAreas.map((area) => area.district.id),
    experienceYears: teacher.experienceYears!,
    hasCurrentStudents: teacher.hasCurrentStudents,
    realPhotos: teacher.realPhotos && teacher.realPhotos.length > 0 ? teacher.realPhotos : undefined,
    zalo: teacher.zalo,
    studentsTrained: teacher.studentsTrained!,
    teachingCars: teacher.teachingCars && teacher.teachingCars.length > 0 ? teacher.teachingCars : undefined,
    trainingLevels: teacher.selectedTrainingLevels.map((level) => ({
      trainingLevelId: level.id,
      priceFrom: teacher.trainingLevelPrices[level.id]?.from || 0,
      priceTo: teacher.trainingLevelPrices[level.id]?.to || 0,
      validPriceRange:
        teacher.trainingLevelPrices[level.id]?.isContactOnly || false,
    })),
    drivingCenterCreateRequests: [
      ...teacher.practiceCenters.map((center) => ({
        placeId: center.place_id,
        name: center.structured_formatting.main_text,
        type: "PRACTICE_GROUND" as const,
        address: center.description,
      })),
      ...teacher.examinationCenters.map((center) => ({
        placeId: center.place_id,
        name: center.structured_formatting.main_text,
        type: "TEST_CENTER" as const,
        address: center.description,
      })),
    ].filter(Boolean) ,
    tagIds: [
      ...(teacher.specialtyTags || []),
      ...(teacher.styleTags || []),
    ].map((tag) => tag.id),
  };
};
