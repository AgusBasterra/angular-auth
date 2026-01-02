import { AuthUser } from '../models/auth-user.model';
import { AuthTokens } from '../models/auth-tokens.model';

export interface AuthConfig {
  // ===========================
  // URLs Base
  // ===========================
  apiUrl: string;

  // ===========================
  // Endpoints (opcionales, con defaults)
  // ===========================
  endpoints?: {
    login?: string;              // default: '/login'
    register?: string;           // default: '/register'
    refresh?: string;            // default: '/refresh'
    me?: string;                 // default: '/me'
    logout?: string;             // default: '/logout'
    
    // Password Reset
    forgotPassword?: string;     // default: '/forgot-password'
    resetPassword?: string;      // default: '/reset-password'
    
    // Email Verification
    resendVerification?: string; // default: '/resend-verification'
    verifyEmail?: string;        // default: '/verify-email'
  };

  // ===========================
  // Storage
  // ===========================
  storage?: 'localStorage' | 'sessionStorage' | 'memory';
  storageKeys?: {
    accessToken?: string;        // default: 'access_token'
    refreshToken?: string;       // default: 'refresh_token'
    user?: string;               // default: 'auth_user'
  };

  // ===========================
  // Token Strategy
  // ===========================
  tokenStrategy?: 'jwt' | 'opaque';
  autoRefresh?: boolean;         // default: true
  refreshThreshold?: number;     // segundos antes de expirar, default: 60

  // ===========================
  // Multi-Tenant
  // ===========================
  tenantStrategy?: 'header' | 'subdomain' | 'none'; // default: 'none'
  tenantId?: string;
  tenantHeader?: string;         // default: 'X-Tenant-ID'
  getTenantId?: () => string;

  // ===========================
  // Mappers (para adaptar respuestas del backend)
  // ===========================
  userMapper?: (rawUser: any) => AuthUser;
  tokenMapper?: (response: any) => AuthTokens;

  // ===========================
  // Features
  // ===========================
  features?: {
    registration?: boolean;      // default: true
    emailVerification?: boolean; // default: false
    passwordReset?: boolean;     // default: false
    roles?: boolean;             // default: true
  };

  // ===========================
  // Redirecciones
  // ===========================
  redirects?: {
    login?: string;              // default: '/login'
    afterLogin?: string;         // default: '/'
    afterLogout?: string;        // default: '/login'
    unauthorized?: string;       // default: '/login'
  };
}

// Defaults
export const DEFAULT_AUTH_CONFIG: Partial<AuthConfig> = {
  storage: 'localStorage',
  tokenStrategy: 'jwt',
  autoRefresh: true,
  refreshThreshold: 60,
  tenantStrategy: 'none',
  tenantHeader: 'X-Tenant-ID',
  
  endpoints: {
    login: '/login',
    register: '/register',
    refresh: '/refresh',
    me: '/me',
    logout: '/logout',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    resendVerification: '/resend-verification',
    verifyEmail: '/verify-email',
  },
  
  storageKeys: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    user: 'auth_user',
  },
  
  features: {
    registration: true,
    emailVerification: false,
    passwordReset: false,
    roles: true,
  },
  
  redirects: {
    login: '/login',
    afterLogin: '/',
    afterLogout: '/login',
    unauthorized: '/login',
  },
};

/**
 * Combina la configuración del usuario con los valores por defecto
 */
export function mergeAuthConfig(config: AuthConfig): Required<AuthConfig> {
  return {
    apiUrl: config.apiUrl,
    endpoints: { ...DEFAULT_AUTH_CONFIG.endpoints, ...config.endpoints } as Required<AuthConfig>['endpoints'],
    storage: config.storage ?? DEFAULT_AUTH_CONFIG.storage!,
    storageKeys: { ...DEFAULT_AUTH_CONFIG.storageKeys, ...config.storageKeys } as Required<AuthConfig>['storageKeys'],
    tokenStrategy: config.tokenStrategy ?? DEFAULT_AUTH_CONFIG.tokenStrategy!,
    autoRefresh: config.autoRefresh ?? DEFAULT_AUTH_CONFIG.autoRefresh!,
    refreshThreshold: config.refreshThreshold ?? DEFAULT_AUTH_CONFIG.refreshThreshold!,
    tenantStrategy: config.tenantStrategy ?? DEFAULT_AUTH_CONFIG.tenantStrategy!,
    tenantId: config.tenantId ?? '',
    tenantHeader: config.tenantHeader ?? DEFAULT_AUTH_CONFIG.tenantHeader!,
    getTenantId: config.getTenantId ?? (() => config.tenantId ?? ''),
    userMapper: config.userMapper ?? ((user: any) => user),
    tokenMapper: config.tokenMapper ?? ((response: any) => ({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: response.expiresIn,
    })),
    features: { ...DEFAULT_AUTH_CONFIG.features, ...config.features } as Required<AuthConfig>['features'],
    redirects: { ...DEFAULT_AUTH_CONFIG.redirects, ...config.redirects } as Required<AuthConfig>['redirects'],
  };
}

