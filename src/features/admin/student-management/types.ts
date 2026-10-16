import type { UserSuspensionResponse } from "@/shared/types/common.type";

export interface AdminStudentDetail {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  deleted: boolean;
  status: "INACTIVE" | "ACTIVE" | "DRAFT" | "BANNED" | "DELETED";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  suspension?: UserSuspensionResponse | null;
}
