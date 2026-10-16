import type {
  ExperienceYears,
  StudentsTrained,
} from "@/shared/types/common.type";
import type { IDrivingCenterCreateRequest } from "./drivingCenter.type";
import type { ITeachingCarCreateRequest } from "./teachingCar.type";
import type { ITrainingLevelPrice } from "./traningLevelPrice.type";

export interface ITeacherProfileSetupPayload {
  contactPhoneNumber: string;
  avatarUrl?: string;
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
  drivingCenterCreateRequests?: IDrivingCenterCreateRequest[];
  trainingLevels: ITrainingLevelPrice[];
  teachingCars?: ITeachingCarCreateRequest[];
  tagIds: string[];
}
