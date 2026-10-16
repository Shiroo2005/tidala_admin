import type { TrainingLevel } from "@/features/home/types";
import type { IGoongAutoCompleteAddress } from "@/shared/types/goong.type";
import { ExperienceYears, StudentsTrained } from "@/shared/types/common.type";
import type { ITeachingCarCreateRequest } from "../request/teachingCar.type";
import type { TeachingArea } from "./teachingArea.type";

export interface TeacherProfileFormState {
  avatarUrl: string;
  contactPhoneNumber: string;
  zalo: string;
  bio: string;
  description: string;
  locationAddress: string;
  locationPlaceId: string;
  latitude: number | null;
  longitude: number | null;
  realPhotos: string[];
  teachingAreas: TeachingArea[];
  selectedTrainingLevels: TrainingLevel[];
  trainingLevelPrices: Record<
    string,
    { from: number; to: number; isContactOnly: boolean }
  >;
  practiceCenters: IGoongAutoCompleteAddress[];
  examinationCenters: IGoongAutoCompleteAddress[];
  teachingCars: ITeachingCarCreateRequest[];
  experienceYears: ExperienceYears | null;
  studentsTrained: StudentsTrained | null;
  specialtyTags?: string[];
  styleTags?: string[];
  hasCurrentStudents: boolean;
  agreedToTerms: boolean;
}

export interface TeacherProfileFormErrors {
  contactPhoneNumber?: string;
  zalo?: string;
  bio?: string;
  description?: string;
  location?: string;
  teachingAreas?: string;
  selectedTrainingLevels?: string;
  trainingLevelPrices?: string;
  drivingCenters?: string;
  realPhotos?: string;
  teachingCars?: string;
  experienceYears?: string;
  studentsTrained?: string;
  specialtyTags?: string;
  styleTags?: string;
  tags?: string;
  agreedToTerms?: string;
}

export const initialTeacherProfileFormState: TeacherProfileFormState = {
  avatarUrl: "",
  contactPhoneNumber: "",
  zalo: "",
  bio: "",
  description: "",
  locationAddress: "",
  locationPlaceId: "",
  latitude: null,
  longitude: null,
  realPhotos: [],
  teachingAreas: [],
  selectedTrainingLevels: [],
  trainingLevelPrices: {},
  practiceCenters: [],
  examinationCenters: [],
  teachingCars: [],
  experienceYears: null,
  studentsTrained: null,
  hasCurrentStudents: false,
  specialtyTags: [],
  styleTags: [],
  agreedToTerms: false,
};

export const initialTeacherProfileFormErrors: TeacherProfileFormErrors = {};

export const experienceYearsOptions = [
  {
    value: ExperienceYears.ONE_TO_THREE,
    label: "1-3 năm",
    labelInDetail: "1+ năm",
  },
  {
    value: ExperienceYears.THREE_TO_FIVE,
    label: "3-5 năm",
    labelInDetail: "3+ năm",
  },
  {
    value: ExperienceYears.FIVE_TO_TEN,
    label: "5-10 năm",
    labelInDetail: "5+ năm",
  },
  {
    value: ExperienceYears.TEN_PLUS,
    label: "10+ năm",
    labelInDetail: "10+ năm",
  },
];

export const studentsTrainedOptions = [
  { value: StudentsTrained.LOWER_THAN_100, label: "< 100" },
  { value: StudentsTrained.FROM_100, label: "100+" },
  { value: StudentsTrained.FROM_300, label: "300+" },
  { value: StudentsTrained.FROM_500, label: "500+" },
  { value: StudentsTrained.FROM_1000, label: "1000+" },
];
