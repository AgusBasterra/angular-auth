import { InjectionToken } from '@angular/core';
import { AuthConfig } from './auth.config';

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG', {
  providedIn: 'root',
  factory: () => {
    throw new Error(
      'AUTH_CONFIG no está configurado. Asegúrate de llamar a provideAuth() en tu configuración de la aplicación.'
    );
  },
});

