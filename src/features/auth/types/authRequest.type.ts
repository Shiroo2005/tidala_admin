import type {
  ExperienceYears,
  StudentsTrained,
} from "@/shared/types/common.type";
import type { RoleType } from "./authUser.type";

export interface RegisterRequest {
  role: RoleType;
  email: string;
  fullName: string;
  password: string;
}

export interface UpdateUserProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: RoleType;
  bio?: string;
  experienceYears?: ExperienceYears;
  studentsTrained?: StudentsTrained;
  hasCurrentStudents?: boolean;
  zalo?: string;
  contactPhoneNumber?: string;
  contactEmail?: string;
  realPhotos?: string[];
  coverImageUrl?: string;
}
