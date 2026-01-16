import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth } from '@agus-auth/angular-auth';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAuth({
      apiUrl: 'http://localhost:3000/auth', // Cambiar por el backend
      storage: 'localStorage',
      features: {
        registration: true,
        passwordReset: true,
        emailVerification: false,
      },
      redirects: {
        login: '/login',
        afterLogin: '/dashboard',
        afterLogout: '/login',
        unauthorized: '/login',
      },
    }),
  ],
};
