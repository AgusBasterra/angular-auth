import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_CONFIG } from '../config/auth.tokens';
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
  AuthResponse,
  UserDto,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ResendVerificationResponse,
  VerifyEmailResponse,
  MessageResponse,
} from '../models/auth-dtos';

/**
 * Servicio para manejar las llamadas HTTP al backend de autenticación
 */
@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  private readonly config = inject(AUTH_CONFIG);
  private readonly http = inject(HttpClient);

  /**
   * Construye la URL completa del endpoint
   */
  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.apiUrl.endsWith('/')
      ? this.config.apiUrl.slice(0, -1)
      : this.config.apiUrl;
    
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return `${baseUrl}${path}`;
  }

  /**
   * Obtiene headers adicionales (para multi-tenant)
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Multi-tenant header
    if (this.config.tenantStrategy === 'header' || this.config.tenantStrategy === 'subdomain') {
      const tenantId = this.config.getTenantId 
        ? this.config.getTenantId()
        : this.config.tenantId;
      
      if (tenantId) {
        const headerName = this.config.tenantHeader ?? 'X-Tenant-ID';
        headers = headers.set(headerName, tenantId);
      }
    }

    return headers;
  }

  // ===========================
  // AUTH ENDPOINTS
  // ===========================

  /**
   * Login
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    const endpoint = this.config.endpoints?.login ?? '/login';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<AuthResponse>(url, request, { headers });
  }

  /**
   * Register
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    const endpoint = this.config.endpoints?.register ?? '/register';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<AuthResponse>(url, request, { headers });
  }

  /**
   * Refresh token
   */
  refresh(request: RefreshTokenRequest): Observable<AuthResponse> {
    const endpoint = this.config.endpoints?.refresh ?? '/refresh';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<AuthResponse>(url, request, { headers });
  }

  /**
   * Get current user (requiere Authorization header)
   */
  getMe(): Observable<UserDto> {
    const endpoint = this.config.endpoints?.me ?? '/me';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.get<UserDto>(url, { headers });
  }

  /**
   * Logout
   */
  logout(refreshToken: string): Observable<MessageResponse> {
    const endpoint = this.config.endpoints?.logout ?? '/logout';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<MessageResponse>(url, { refreshToken }, { headers });
  }

  // ===========================
  // PASSWORD RESET ENDPOINTS
  // ===========================

  /**
   * Solicitar reset de password
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    const endpoint = this.config.endpoints?.forgotPassword ?? '/forgot-password';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<ForgotPasswordResponse>(url, request, { headers });
  }

  /**
   * Reset password con token
   */
  resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    const endpoint = this.config.endpoints?.resetPassword ?? '/reset-password';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<ResetPasswordResponse>(url, request, { headers });
  }

  // ===========================
  // EMAIL VERIFICATION ENDPOINTS
  // ===========================

  /**
   * Reenviar email de verificación
   */
  resendVerification(request: ResendVerificationRequest): Observable<ResendVerificationResponse> {
    const endpoint = this.config.endpoints?.resendVerification ?? '/resend-verification';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<ResendVerificationResponse>(url, request, { headers });
  }

  /**
   * Verificar email con token
   */
  verifyEmail(request: VerifyEmailRequest): Observable<VerifyEmailResponse> {
    const endpoint = this.config.endpoints?.verifyEmail ?? '/verify-email';
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();

    return this.http.post<VerifyEmailResponse>(url, request, { headers });
  }
}

