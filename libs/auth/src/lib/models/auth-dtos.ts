// ===========================
// REQUEST DTOs
// ===========================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  [key: string]: any;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// ===========================
// RESPONSE DTOs
// ===========================

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // segundos
  user: UserDto;
}

export interface UserDto {
  id: string | number;
  email: string;
  name?: string;
  roles?: string[];
  emailVerified?: boolean;
  createdAt?: string;
  [key: string]: any;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ForgotPasswordResponse extends MessageResponse {}
export interface ResetPasswordResponse extends MessageResponse {}
export interface ResendVerificationResponse extends MessageResponse {}
export interface VerifyEmailResponse extends MessageResponse {
  user?: UserDto;
}

