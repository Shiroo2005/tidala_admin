import type {
  ExperienceYears,
  StudentsTrained,
} from "@/shared/types/common.type";
import type { IDrivingCenterCreateRequest } from "./drivingCenter.type";
import type { ITeachingCarCreateRequest } from "./teachingCar.type";
import type { ITrainingLevelPrice } from "./traningLevelPrice.type";

/**
 * V2 Teacher Profile Setup Payload
 * All fields are optional except phoneNumber, allowing partial/draft saves.
 */
export interface ITeacherProfileSetupV2Payload {
  phoneNumber: string;
  bio?: string;
  description?: string;
  realPhotos?: string[];
  experienceYears?: ExperienceYears;
  studentsTrained?: StudentsTrained;
  hasCurrentStudents?: boolean;
  zalo?: string;
  districtIds?: string[];
  drivingCenterCreateRequests?: IDrivingCenterCreateRequest[];
  trainingLevels?: ITrainingLevelPrice[];
  avatarUrl?: string;
  coverImageUrl?: string;
  teachingCars?: ITeachingCarCreateRequest[];
  tagIds?: string[];
  lat?: number;
  lng?: number;
}
