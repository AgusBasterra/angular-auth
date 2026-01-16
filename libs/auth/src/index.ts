// ===========================
// PUBLIC API DE @agus-auth/angular-auth
// ===========================

// Provider principal
export { provideAuth, provideAuthWithoutInterceptor } from './lib/config/auth.provider';

// Configuración
export type { AuthConfig } from './lib/config/auth.config';
export { DEFAULT_AUTH_CONFIG, mergeAuthConfig } from './lib/config/auth.config';
export { AUTH_CONFIG } from './lib/config/auth.tokens';

// Servicios
export { AuthService } from './lib/services/auth.service';
export { AuthStorageService } from './lib/services/auth-storage.service';
export { AuthHttpService } from './lib/services/auth-http.service';

// Guards
export { authGuard } from './lib/guards/auth.guard';
export { roleGuard } from './lib/guards/role.guard';

// Interceptor
export { authInterceptor } from './lib/interceptors/auth.interceptor';

// Componentes standalone (opcionales)
export { LoginComponent } from './lib/components/login/login.component';
export { RegisterComponent } from './lib/components/register/register.component';
export { ForgotPasswordComponent } from './lib/components/forgot-password/forgot-password.component';
export { ResetPasswordComponent } from './lib/components/reset-password/reset-password.component';
export { VerifyEmailComponent } from './lib/components/verify-email/verify-email.component';

// Modelos
export type { AuthUser } from './lib/models/auth-user.model';
export type { AuthTokens } from './lib/models/auth-tokens.model';

// DTOs - Request
export type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from './lib/models/auth-dtos';

// DTOs - Response
export type {
  AuthResponse,
  UserDto,
  MessageResponse,
  ErrorResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ResendVerificationResponse,
  VerifyEmailResponse,
} from './lib/models/auth-dtos';