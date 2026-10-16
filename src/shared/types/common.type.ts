export type Override<T, U> = Omit<T, keyof U> & U;

// Common type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export interface UserSuspensionResponse {
  sanctionId: string;
  reason: string;
  startAt: string;
  endAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * @description Training Level Type
 */
export interface TrainingLevel {
  id: string;
  name: string;
  description: string;
}

/**
 * @description Training Level Detail Type
 */
export interface TrainingLevelDetail {
  teacherUserId: string;
  trainingLevelId: string;
  trainingLevelName: string;
  seats?: number;
  weight?: number;
  courseDescription?: string;
  trainingLevelDescription?: string;
  priceFrom?: number;
  priceTo?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * @description Province Type
 */
export interface Province {
  id: string;
  name: string;
  slug?: string;
  teacherCounts?: number;
}

export interface ProvinceDetails {
  id: string;
  name: string;
  districts: District[];
}

/**
 * @description District Type
 */
export interface District {
  id: string;
  name: string;
}

export interface DistrictDetail {
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
}

/**
 * @description Experience Years Type
 */
export const ExperienceYears = {
  ONE_TO_THREE: "ONE_TO_THREE",
  THREE_TO_FIVE: "THREE_TO_FIVE",
  FIVE_TO_TEN: "FIVE_TO_TEN",
  TEN_PLUS: "TEN_PLUS",
} as const;
export type ExperienceYears =
  (typeof ExperienceYears)[keyof typeof ExperienceYears];

/**
 * @description Student Trained Type
 */
export const StudentsTrained = {
  LOWER_THAN_100: "LOWER_THAN_100",
  FROM_100: "FROM_100",
  FROM_300: "FROM_300",
  FROM_500: "FROM_500",
  FROM_1000: "FROM_1000",
} as const;
export type StudentsTrained =
  (typeof StudentsTrained)[keyof typeof StudentsTrained];

/**
 * @description Car Type
 */
export const CarType = {
  MANUAL: "manual",
  AUTOMATIC: "automatic",
} as const;
export type CarType = (typeof CarType)[keyof typeof CarType];

/**
 * @description Tag Type
 */
export interface Tag {
  id: string;
  name: string;
  type: TagOption;
}

/**
 * @description Tag Option Type
 */
export const TagOption = {
  specialty: "specialty",
  style: "style",
} as const;
export type TagOption = (typeof TagOption)[keyof typeof TagOption];

/**
 * @description Teacher Status Type
 */
export const TeacherStatus = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
  BANNED: "BANNED",
  DELETED: "DELETED",
} as const;
export type TeacherStatus = (typeof TeacherStatus)[keyof typeof TeacherStatus];

/**
 * @description Driving Center Option Type
 */
export const DrivingCenterOption = {
  PRACTICE_GROUND: "PRACTICE_GROUND",
  TEST_CENTER: "TEST_CENTER",
} as const;

export type DrivingCenterOption =
  (typeof DrivingCenterOption)[keyof typeof DrivingCenterOption];

/**
 * @description Review Summary Response Type
 */
export interface ReviewSummaryResponse {
  teacherUserId: string;
  averageRating: number;
  totalReviews: number;
  stars: {
    star: number;
    count: number;
  }[];
}

/**
 * @description Driving Center Type
 */
export interface DrivingCenter {
  id: string;
  name: string;
  type: DrivingCenterOption;
  address: string;
  placeId: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * @description Teaching Car Type
 */
export interface TeachingCar {
  id: string;
  teacherUserId: string;
  brand: string;
  model: string;
  productionYear: number;
  type: "manual" | "automatic" | string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherContactResponse {
  userId: string;
  contactPhoneNumber: string;
  contactEmail: string;
  zalo: string;
}

/**
 * @description Teacher Detail Type
 */
export interface TeacherDetail {
  userId: string;
  fullName: string;
  avatarUrl: string;
  coverImageUrl: string;
  zalo: string;
  contactPhoneNumber: string;
  phone: string;
  contactEmail: string;
  bio: string;
  description?: string;
  experienceYears: ExperienceYears;
  studentsTrained: StudentsTrained;
  status: TeacherStatus;
  suspension?: UserSuspensionResponse | null;
  rejectedReason?: string | null;
  trainings: TrainingLevelDetail[];
  province: Province;
  districts: DistrictDetail[];
  drivingCenters: DrivingCenter[];
  avgRating?: number;
  totalComments?: number;
  reviewSummary?: ReviewSummaryResponse;
  realPhotos: string[];
  teachingCars: TeachingCar[];
  totalLikes: number;
  isLiked: boolean;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string | null;
  tags: Tag[];
  hasCurrentStudents: boolean;
}

export interface TeacherDetailWithDistance {
  profile: TeacherDetail;
  distance: number; // Distance in meters
}

export interface ReviewResponse {
  id: string;
  studentUserId: string;
  studentFullName: string;
  studentAvatarUrl: string;
  teacherUserId: string;
  rating: number;
  content: string;
  totalLikes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProvinceDetail {
  id: string;
  name: string;
  districts: District[];
}
