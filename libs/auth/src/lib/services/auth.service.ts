import { Injectable, computed, signal, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, timer, switchMap } from 'rxjs';
import { AUTH_CONFIG } from '../config/auth.tokens';
import { AuthUser } from '../models/auth-user.model';
import { AuthHttpService } from './auth-http.service';
import { AuthStorageService } from './auth-storage.service';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
  AuthResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyEmailResponse,
} from '../models/auth-dtos';

/**
 * Servicio principal de autenticación con Signals (Angular 21+)
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly config = inject(AUTH_CONFIG);
  private readonly http = inject(AuthHttpService);
  private readonly storage = inject(AuthStorageService);
  private readonly router = inject(Router);

  // ===========================
  // SIGNALS (Angular 21 style)
  // ===========================
  
  // Signal privado para el usuario
  private readonly _user = signal<AuthUser | null>(null);
  
  // Signal público (readonly)
  readonly user = this._user.asReadonly();
  
  // Computed signals
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isEmailVerified = computed(() => this.user()?.emailVerified ?? false);
  readonly userRoles = computed(() => this.user()?.roles ?? []);
  readonly userName = computed(() => this.user()?.name ?? this.user()?.email ?? 'Usuario');

  // Estado de carga
  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  // ===========================
  // CONSTRUCTOR & INIT
  // ===========================

  constructor() {
    // Cargar usuario desde storage al inicializar
    this.loadUserFromStorage();

    // Auto-refresh effect (solo si está habilitado)
    if (this.config.autoRefresh) {
      this.setupAutoRefresh();
    }
  }

  // ===========================
  // PUBLIC METHODS
  // ===========================

  /**
   * Login con email y password
   */
  login(email: string, password: string): Observable<AuthResponse> {
    this._isLoading.set(true);
    
    const request: LoginRequest = { email, password };
    
    return this.http.login(request).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      }),
      tap(() => this._isLoading.set(false))
    );
  }

  /**
   * Registro de nuevo usuario
   */
  register(
    email: string,
    password: string,
    additionalData?: Record<string, any>
  ): Observable<AuthResponse> {
    if (!this.config.features?.registration) {
      return throwError(() => new Error('Registration is disabled'));
    }

    this._isLoading.set(true);
    
    const request: RegisterRequest = { email, password, ...additionalData };
    
    return this.http.register(request).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      }),
      tap(() => this._isLoading.set(false))
    );
  }

  /**
   * Logout
   */
  logout(): void {
    const refreshToken = this.storage.getRefreshToken();
    
    // Llamar al backend (opcional)
    if (refreshToken) {
      this.http.logout(refreshToken).subscribe({
        complete: () => this.clearSession(),
        error: () => this.clearSession(), // Limpiar igual si falla
      });
    } else {
      this.clearSession();
    }
  }

  /**
   * Refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storage.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.refresh({ refreshToken }).pipe(
      tap((response) => this.handleAuthSuccess(response, false)), // false = no redirect
      catchError((error) => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  /**
   * Solicitar reset de password
   */
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    if (!this.config.features?.passwordReset) {
      return throwError(() => new Error('Password reset is disabled'));
    }

    this._isLoading.set(true);
    
    return this.http.forgotPassword({ email }).pipe(
      tap(() => this._isLoading.set(false)),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Reset password con token
   */
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    if (!this.config.features?.passwordReset) {
      return throwError(() => new Error('Password reset is disabled'));
    }

    this._isLoading.set(true);
    
    return this.http.resetPassword({ token, newPassword }).pipe(
      tap(() => this._isLoading.set(false)),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Reenviar email de verificación
   */
  resendVerificationEmail(email: string): Observable<any> {
    if (!this.config.features?.emailVerification) {
      return throwError(() => new Error('Email verification is disabled'));
    }

    return this.http.resendVerification({ email });
  }

  /**
   * Verificar email con token
   */
  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    if (!this.config.features?.emailVerification) {
      return throwError(() => new Error('Email verification is disabled'));
    }

    this._isLoading.set(true);
    
    return this.http.verifyEmail({ token }).pipe(
      tap((response) => {
        if (response.user) {
          this._user.set(response.user);
          this.storage.setUser(response.user);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener usuario actual desde el backend
   */
  getCurrentUser(): Observable<AuthUser> {
    return this.http.getMe().pipe(
      tap((user) => {
        this._user.set(user);
        this.storage.setUser(user);
      })
    );
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  /**
   * Verificar si el usuario tiene alguno de los roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Verificar si el usuario tiene todos los roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
  }

  // ===========================
  // PRIVATE METHODS
  // ===========================

  private handleAuthSuccess(response: AuthResponse, redirect: boolean = true): void {
    // Guardar tokens
    this.storage.setAccessToken(response.accessToken);
    this.storage.setRefreshToken(response.refreshToken);
    
    // Guardar usuario
    const user = this.config.userMapper 
      ? this.config.userMapper(response.user)
      : response.user;
    
    this._user.set(user);
    this.storage.setUser(user);

    // Redirigir (solo en login/register, no en refresh)
    if (redirect) {
      const redirectUrl = this.config.redirects?.afterLogin ?? '/';
      this.router.navigateByUrl(redirectUrl);
    }
  }

  private clearSession(): void {
    this._user.set(null);
    this.storage.clear();
    
    const redirectUrl = this.config.redirects?.afterLogout ?? '/login';
    this.router.navigateByUrl(redirectUrl);
  }

  private loadUserFromStorage(): void {
    const user = this.storage.getUser();
    if (user) {
      this._user.set(user);
    }
  }

  private setupAutoRefresh(): void {
    // Efecto que vigila el token y lo refresca automáticamente
    effect(() => {
      const user = this.user();
      
      if (!user) return;

      const accessToken = this.storage.getAccessToken();
      if (!accessToken) return;

      // Decodificar JWT y calcular tiempo de refresh
      const expiresAt = this.getTokenExpiration(accessToken);
      const refreshThreshold = (this.config.refreshThreshold ?? 60) * 1000;
      const now = Date.now();
      const timeUntilRefresh = expiresAt - now - refreshThreshold;

      if (timeUntilRefresh > 0) {
        // Programar refresh
        timer(timeUntilRefresh)
          .pipe(switchMap(() => this.refreshToken()))
          .subscribe();
      } else if (expiresAt > now) {
        // Token cerca de expirar, refrescar inmediatamente
        this.refreshToken().subscribe();
      }
    });
  }

  private getTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // Convertir a milisegundos
    } catch {
      return 0;
    }
  }
}

