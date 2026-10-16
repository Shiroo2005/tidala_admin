export const AccountSanctionType = {
  WARNING: "WARNING",
  SUSPENSION: "SUSPENSION",
  BAN: "BAN",
} as const;

export type AccountSanctionType =
  (typeof AccountSanctionType)[keyof typeof AccountSanctionType];

export interface SanctionUserRequest {
  type: AccountSanctionType;
  reason: Record<string, unknown>;
  durationDays?: number;
  metadata?: Record<string, unknown>;
  reportId?: string;
}

export interface SanctionUserVariables {
  userId: string;
  payload: SanctionUserRequest;
}

export interface RevokeSanctionVariables {
  userId: string;
  reason: string;
}

