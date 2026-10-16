import type { DrivingCenterFormItem } from "@/features/account/types/type";
import type { ITeachingCarCreateRequest } from "@/features/auth/types";
import type {
  ExperienceYears,
  StudentsTrained,
  Tag,
  TrainingLevel,
} from "@/shared/types/common.type";
import type { ReactNode } from "react";
import type { TeachingArea } from "../components/ui/TeachingAreaSelector";

export type SectionRenderContext = {
  isTeacher: boolean;
  enableEditProfile: boolean;

  form: {
    account: AccountFormState;
    teacher: TeacherProfileFormState;
  };

  errors: Partial<
    Record<
      keyof AccountFormState | keyof TeacherProfileFormState | "tags",
      string
    >
  >;

  actions: {
    setAccountField: <K extends keyof AccountFormState>(
      name: K,
      value: AccountFormState[K],
    ) => void;

    setTeacherProfileField: <K extends keyof TeacherProfileFormState>(
      name: K,
      value: TeacherProfileFormState[K],
    ) => void;

    setTrainingLevels: (levels: TrainingLevel[]) => void;

    clearError: (
      key: keyof AccountFormState | keyof TeacherProfileFormState | "tags",
    ) => void;

    setAvatarUrl: (url: string | null) => void;
    setCoverImageUrl: (url: string | null) => void;
    setAvatarUploading?: (isUploading: boolean) => void;
    setCoverImageUploading?: (isUploading: boolean) => void;
    setRealPhotosUploading?: (isUploading: boolean) => void;
  };

  setFieldRef: (key: string) => (el: HTMLElement | null) => void;

  openLightbox?: (image: string) => void;
  openPhotosLightbox?: (index: number) => void;
};

export type SectionConfig = {
  key: string;
  index?: number | string;
  title: string;
  hasSwitch?: boolean;
  section: (ctx: SectionRenderContext) => ReactNode;
};

export interface FormActionConfig {
  show: boolean;
  text: string;
  loadingText: string;
  note?: string;
  onSubmit?: () => void;
  disabled?: boolean;
}

export type AccountFormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
};

export interface TeacherProfileFormState {
  // Section 1: Basic Info
  contactPhoneNumber: string;
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

export interface TrainingLevelPrice {
  trainingLevelId: string;
  priceFrom: number | null;
  priceTo: number | null;
  validPriceRange: boolean;
}
