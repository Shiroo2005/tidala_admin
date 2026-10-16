export interface ForgotPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export type ForgotPasswordErrors = Partial<
  Record<keyof ForgotPasswordFormData, string>
>;

export interface VerifyPasswordResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyPasswordResetOtpResponse {
  resetToken: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  resetToken: string;
}
