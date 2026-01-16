# @agus-auth/angular-auth

> Sistema de autenticación reutilizable para proyectos Angular 21+ con Signals, Standalone APIs, y soporte completo para JWT, multi-tenant, y más.

## 🚀 Características

- ✅ **Angular 21+** con Signals y Standalone APIs
- ✅ **JWT Authentication** con refresh automático
- ✅ **Multi-tenant** (header o subdomain)
- ✅ **Guards funcionales** (authGuard, roleGuard)
- ✅ **Interceptor funcional** para tokens
- ✅ **Componentes standalone** opcionales (Login, Register, etc.)
- ✅ **Password Reset** y **Email Verification**
- ✅ **Configurable** y **desacoplado** del dominio
- ✅ **Tree-shakeable** y optimizado

## 📦 Instalación

```bash
npm install @agus-auth/angular-auth
```

## 🎯 Quick Start

### 1. Configurar en `app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth } from '@agus-auth/angular-auth';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAuth({
      apiUrl: 'https://api.example.com/auth',
      storage: 'localStorage',
      features: {
        registration: true,
        passwordReset: true,
        emailVerification: false,
      },
    }),
  ],
};
```

### 2. Usar en Componentes

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '@agus-auth/angular-auth';

@Component({
  selector: 'app-profile',
  template: `
    <div>
      @if (auth.isAuthenticated()) {
        <h1>Bienvenido {{ auth.userName() }}</h1>
        <button (click)="auth.logout()">Cerrar Sesión</button>
      } @else {
        <p>No autenticado</p>
      }
    </div>
  `,
})
export class ProfileComponent {
  protected readonly auth = inject(AuthService);
}
```

### 3. Proteger Rutas

```typescript
import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '@agus-auth/angular-auth';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
  },
];
```

## 📖 Documentación Completa

### Configuración (AuthConfig)

```typescript
export interface AuthConfig {
  // URL base del API de autenticación (requerido)
  apiUrl: string;

  // Endpoints personalizados (opcional)
  endpoints?: {
    login?: string;              // default: '/login'
    register?: string;           // default: '/register'
    refresh?: string;            // default: '/refresh'
    me?: string;                 // default: '/me'
    logout?: string;             // default: '/logout'
    forgotPassword?: string;     // default: '/forgot-password'
    resetPassword?: string;      // default: '/reset-password'
    resendVerification?: string; // default: '/resend-verification'
    verifyEmail?: string;        // default: '/verify-email'
  };

  // Storage (opcional)
  storage?: 'localStorage' | 'sessionStorage' | 'memory'; // default: 'localStorage'
  storageKeys?: {
    accessToken?: string;        // default: 'access_token'
    refreshToken?: string;       // default: 'refresh_token'
    user?: string;               // default: 'auth_user'
  };

  // Token Strategy (opcional)
  tokenStrategy?: 'jwt' | 'opaque'; // default: 'jwt'
  autoRefresh?: boolean;            // default: true
  refreshThreshold?: number;        // segundos antes de expirar, default: 60

  // Multi-tenant (opcional)
  tenantStrategy?: 'header' | 'subdomain' | 'none'; // default: 'none'
  tenantId?: string;
  tenantHeader?: string;            // default: 'X-Tenant-ID'
  getTenantId?: () => string;

  // Mappers (opcional, para adaptar respuestas del backend)
  userMapper?: (rawUser: any) => AuthUser;
  tokenMapper?: (response: any) => AuthTokens;

  // Features (opcional)
  features?: {
    registration?: boolean;       // default: true
    emailVerification?: boolean;  // default: false
    passwordReset?: boolean;      // default: false
    roles?: boolean;              // default: true
  };

  // Redirecciones (opcional)
  redirects?: {
    login?: string;               // default: '/login'
    afterLogin?: string;          // default: '/'
    afterLogout?: string;         // default: '/login'
    unauthorized?: string;        // default: '/login'
  };
}
```

### AuthService API

```typescript
class AuthService {
  // Signals (readonly)
  readonly user: Signal<AuthUser | null>;
  readonly isAuthenticated: Signal<boolean>;
  readonly isEmailVerified: Signal<boolean>;
  readonly userRoles: Signal<string[]>;
  readonly userName: Signal<string>;
  readonly isLoading: Signal<boolean>;

  // Métodos principales
  login(email: string, password: string): Observable<AuthResponse>;
  register(email: string, password: string, additionalData?: Record<string, any>): Observable<AuthResponse>;
  logout(): void;
  refreshToken(): Observable<AuthResponse>;
  getCurrentUser(): Observable<AuthUser>;

  // Password reset
  forgotPassword(email: string): Observable<ForgotPasswordResponse>;
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse>;

  // Email verification
  resendVerificationEmail(email: string): Observable<ResendVerificationResponse>;
  verifyEmail(token: string): Observable<VerifyEmailResponse>;

  // Roles
  hasRole(role: string): boolean;
  hasAnyRole(roles: string[]): boolean;
  hasAllRoles(roles: string[]): boolean;
}
```

### Componentes Standalone (Opcionales)

Puedes usar los componentes incluidos o crear los tuyos propios:

```typescript
import { Routes } from '@angular/router';
import {
  LoginComponent,
  RegisterComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  VerifyEmailComponent,
} from '@agus-auth/angular-auth';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
];
```

## 🔐 Contrato Backend

El backend debe implementar estos endpoints:

### POST `/auth/login`
```typescript
Request: { email: string, password: string }
Response: {
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  user: {
    id: string | number,
    email: string,
    name?: string,
    roles?: string[],
    emailVerified?: boolean
  }
}
```

### POST `/auth/register`
```typescript
Request: { email: string, password: string, name?: string }
Response: AuthResponse (igual que login)
```

### POST `/auth/refresh`
```typescript
Request: { refreshToken: string }
Response: AuthResponse
```

### GET `/auth/me`
```typescript
Headers: { Authorization: 'Bearer {token}' }
Response: UserDto
```

Ver documentación completa de endpoints en el código fuente.

## 🌍 Multi-Tenant

### Por Header
```typescript
provideAuth({
  apiUrl: 'https://auth-api.example.com',
  tenantStrategy: 'header',
  tenantId: 'my-app-prod',
  tenantHeader: 'X-Tenant-ID', // opcional, default
})
```

### Por Subdomain
```typescript
provideAuth({
  apiUrl: 'https://auth-api.example.com',
  tenantStrategy: 'subdomain',
  getTenantId: () => {
    return window.location.hostname.split('.')[0]; // 'acme' de 'acme.app.com'
  },
})
```

## 🎨 Personalización

### Usar tu propio backend adapter

```typescript
provideAuth({
  apiUrl: 'https://api.example.com',
  userMapper: (rawUser) => ({
    id: rawUser.userId,
    email: rawUser.emailAddress,
    name: rawUser.fullName,
    roles: rawUser.permissions,
  }),
  tokenMapper: (response) => ({
    accessToken: response.token,
    refreshToken: response.refresh,
    expiresIn: response.ttl,
  }),
})
```

### Sin Interceptor (si ya tienes uno)

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAuthWithoutInterceptor, authInterceptor } from '@agus-auth/angular-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([myCustomInterceptor, authInterceptor])
    ),
    provideAuthWithoutInterceptor({
      apiUrl: 'https://api.example.com/auth',
    }),
  ],
};
```

## 📝 Ejemplos de Uso

### Login Manual
```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '@agus-auth/angular-auth';

@Component({
  template: `
    <form (submit)="login()">
      <input [(ngModel)]="email" type="email" />
      <input [(ngModel)]="password" type="password" />
      <button type="submit">Login</button>
    </form>
  `
})
export class MyLoginComponent {
  private authService = inject(AuthService);
  email = '';
  password = '';

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => console.log('Login exitoso'),
      error: (err) => console.error('Error:', err),
    });
  }
}
```

### Verificar Roles
```typescript
@Component({
  template: `
    @if (auth.hasRole('admin')) {
      <button>Panel Admin</button>
    }
  `
})
export class MyComponent {
  protected auth = inject(AuthService);
}
```

## 🧪 Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { provideAuth, AuthService } from '@agus-auth/angular-auth';

describe('MyComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideAuth({
          apiUrl: 'http://localhost:3000/auth',
        }),
      ],
    });
  });

  it('should authenticate', () => {
    const authService = TestBed.inject(AuthService);
    // ... tests
  });
});
```

## 📄 Licencia

MIT

## 🤝 Contribuir

Contribuciones son bienvenidas. Por favor abre un issue o PR en GitHub.

---
