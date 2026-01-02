import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthConfig, mergeAuthConfig } from './auth.config';
import { AUTH_CONFIG } from './auth.tokens';
import { authInterceptor } from '../interceptors/auth.interceptor';

/**
 * Proveedor principal para configurar el sistema de autenticación
 * 
 * @param config - Configuración del sistema de autenticación
 * @returns EnvironmentProviders para usar en bootstrapApplication o provideRouter
 * 
 * @example
 * ```typescript
 * // En main.ts o app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAuth({
 *       apiUrl: 'https://api.example.com/auth',
 *       storage: 'localStorage',
 *       features: {
 *         registration: true,
 *         passwordReset: true,
 *       }
 *     }),
 *     // ... otros providers
 *   ]
 * };
 * ```
 */
export function provideAuth(config: AuthConfig): EnvironmentProviders {
  // Validar configuración mínima
  if (!config.apiUrl) {
    throw new Error('provideAuth: apiUrl es requerido en la configuración');
  }

  // Combinar con valores por defecto
  const mergedConfig = mergeAuthConfig(config);

  return makeEnvironmentProviders([
    // Proveer la configuración
    {
      provide: AUTH_CONFIG,
      useValue: mergedConfig,
    },
    // Proveer HttpClient con el interceptor de auth
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ]);
}

/**
 * Proveedor sin interceptor (útil si ya tienes HttpClient configurado)
 * 
 * @param config - Configuración del sistema de autenticación
 * @returns EnvironmentProviders
 * 
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptors([customInterceptor, authInterceptor])),
 *     provideAuthWithoutInterceptor({
 *       apiUrl: 'https://api.example.com/auth',
 *     }),
 *   ]
 * };
 * ```
 */
export function provideAuthWithoutInterceptor(config: AuthConfig): EnvironmentProviders {
  if (!config.apiUrl) {
    throw new Error('provideAuthWithoutInterceptor: apiUrl es requerido en la configuración');
  }

  const mergedConfig = mergeAuthConfig(config);

  return makeEnvironmentProviders([
    {
      provide: AUTH_CONFIG,
      useValue: mergedConfig,
    },
  ]);
}

