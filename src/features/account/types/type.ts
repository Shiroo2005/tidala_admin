/* ===========================
   ENUMS
=========================== */

import type {
  ITeachingCarCreateRequest,
  ITrainingLevelPrice,
} from "@/features/auth/types";
import type { Province, TrainingLevelDetail } from "@/shared/types/common.type";
import { ExperienceYears, StudentsTrained } from "@/shared/types/common.type";
import type { IGoongAutoCompleteAddress } from "@/shared/types/goong.type";
import type { Tag } from "@/shared/types/tag.type";

export const Role = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const TeacherStatus = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
} as const;

export type TeacherStatus = (typeof TeacherStatus)[keyof typeof TeacherStatus];

export const DrivingCenterType = {
  PRACTICE_GROUND: "PRACTICE_GROUND",
  TEST_CENTER: "TEST_CENTER",
} as const;

export type DrivingCenterType =
  (typeof DrivingCenterType)[keyof typeof DrivingCenterType];

/* ===========================
   COMMON TYPES
=========================== */

export interface District {
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
}

export interface DrivingCenter {
  id: string;
  name: string;
  type: DrivingCenterType;
  address: string;
  placeId: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ===========================
   REVIEW SUMMARY (Account)
=========================== */

export interface ReviewSummary {
  averageRating: number;
  stars: {
    start: number;
    count: number;
  }[];
  teacherUserId: string;
  totalReviews: number;
}

/* ===========================
   RECENT VIEWERS (Account)
=========================== */

export interface RecentViewer {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export const ContactType = {
  ZALO: "ZALO",
  SDT: "SDT",
  SMS: "SMS",
} as const;

export type ContactType = (typeof ContactType)[keyof typeof ContactType];

export interface RecentContact {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  type: ContactType;
  contactedAt: string;
}

/* ===========================
   TEACHER PROFILE (Account)
=========================== */

export interface TeacherProfile {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  coverImageUrl?: string | null;
  zalo: string;
  contactPhoneNumber: string;
  contactEmail: string;
  bio: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
  experienceYears: ExperienceYears;
  studentsTrained: StudentsTrained;
  status: TeacherStatus;
  rejectedReason?: string | null;
  trainings: TrainingLevelDetail[];
  province?: Province;
  districts: District[];
  drivingCenters: DrivingCenter[];
  teachingCars: ITeachingCarCreateRequest[];
  avgRating?: number;
  totalComments?: number;
  realPhotos: string[];
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string | null;
  hasCurrentStudents: boolean;
  reviewSummary: ReviewSummary;
  totalLikes: number;
  tags: Tag[];
  recentViewers?: RecentViewer[];
  totalViews: number;
}

/* ===========================
   USER (Discriminated Union)
=========================== */

export interface BaseUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export type TeacherUser = BaseUser & {
  role: typeof Role.TEACHER;
  teacherProfile: TeacherProfile;
};

export type StudentUser = BaseUser & {
  role: typeof Role.STUDENT;
  teacherProfile?: never;
};

export type AdminUser = BaseUser & {
  role: typeof Role.ADMIN;
  teacherProfile?: never;
};

export type User = TeacherUser | StudentUser | AdminUser;

// Request payload
export interface ITeacherProfileUpdatePayload {
  fullName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  teacherProfile?: {
    contactEmail: string;
    contactPhoneNumber: string;
    coverImageUrl: string;
    bio: string;
    description: string;
    latitude: number;
    longitude: number;
    realPhotos: string[];
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

export interface IStudentProfileUpdatePayload {
  fullName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

export interface DrivingCenterFormItem extends IGoongAutoCompleteAddress {
  id?: string;
  tempId?: string;
  source: "EXISTING" | "NEW";
  type: DrivingCenterType;
}
