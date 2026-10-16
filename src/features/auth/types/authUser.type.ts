export const Role = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const RegistrationStatus = {
  EMAIL_VERIFIED: "EMAIL_VERIFIED",
  ROLE_SELECT: "ROLE_SELECT",
  ACCOUNT_CREATED: "ACCOUNT_CREATED",
  COMPLETED: "COMPLETED",
} as const;

export type RegistrationStatusType =
  (typeof RegistrationStatus)[keyof typeof RegistrationStatus];
