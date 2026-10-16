import type { DrivingCenterFormItem } from "@/features/account/types/type";
import type { ITeachingCarCreateRequest } from "@/features/auth/types";
import type { TeachingArea } from "@/features/my-profile/components/ui/TeachingAreaSelector";
import type {
  CarType,
  ExperienceYears,
  StudentsTrained,
  Tag,
  TeacherDetail,
  TrainingLevel,
  UserSuspensionResponse,
} from "@/shared/types/common.type";

export interface AdminTeacherDetail {
  id: string;
  userId?: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string;
  status: string;
  experienceYears: string;
  totalReviews: number;
  averageRating: number;
  totalLikes: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
  invitedAt?: string;
  acceptedAt?: string;
  suspension?: UserSuspensionResponse | null;
}

// ── Form types for Teacher Edit ──

export interface TrainingLevelFormItem {
  trainingLevelId: string;
  priceFrom: number | "";
  priceTo: number | "";
  isContactPrice?: boolean;
}

export interface TeachingCarFormItem {
  id?: string;
  brand: string;
  model: string;
  productionYear: number | "";
  type: CarType | "";
  description: string;
  imageUrl: string;
  /** Temporary field: new File selected but not yet uploaded */
  _newImageFile?: File | null;
}

export interface TeacherEditFormValues {
  bio: string;
  description: string;
  experienceYears: ExperienceYears | "";
  studentsTrained: StudentsTrained | "";
  hasCurrentStudents: boolean;
  zalo: string;
  avatarUrl: string;
  coverImageUrl: string;
  realPhotos: string[];
  trainingLevels: TrainingLevelFormItem[];
  teachingAreas: TeachingArea[];
  practiceCenters: DrivingCenterFormItem[];
  examinationCenters: DrivingCenterFormItem[];
  tagIds: string[];
  teachingCars: TeachingCarFormItem[];
}

export interface TeacherProfileUpdatePayload {
  bio: string;
  description: string;
  experienceYears: string;
  studentsTrained: string;
  hasCurrentStudents: boolean;
  zalo: string;
  avatarUrl: string;
  coverImageUrl: string;
  realPhotos: string[];
  trainingLevels: {
    trainingLevelId: string;
    priceFrom: number;
    priceTo: number;
  }[];
  districtIds: string[];
  drivingCenterIds: string[];
  tagIds: string[];
  teachingCars: {
    brand: string;
    model: string;
    productionYear: number;
    type: string;
    description: string;
    imageUrl: string;
  }[];
}

export type BasicInfoFormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
};

export interface TeachingInfoFormState {
  // Section 1: Basic Info
  zalo: string;
  bio: string;
  description: string;
  locationAddress: string;
  locationPlaceId: string;
  latitude: number | null;
  longitude: number | null;
  realPhotos: string[];
  coverImageUrl: string | null;

  // Step 2: Teaching Info
  teachingAreas: TeachingArea[];
  selectedTrainingLevels: TrainingLevel[];
  trainingLevelPrices: Record<
    string,
    { from: number; to: number; isContactOnly: boolean }
  >;
  practiceCenters: DrivingCenterFormItem[];
  examinationCenters: DrivingCenterFormItem[];
  teachingCars: ITeachingCarCreateRequest[];

  // Step 3: Experience & Status
  experienceYears: ExperienceYears | null;
  studentsTrained: StudentsTrained | null;

  specialtyTags?: Tag[];
  styleTags?: Tag[];

  hasCurrentStudents: boolean;
}

export type { TeacherDetail };
