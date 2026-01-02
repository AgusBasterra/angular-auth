import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AUTH_CONFIG } from '../config/auth.tokens';

/**
 * Guard funcional para proteger rutas que requieren autenticación
 * Compatible con Angular 21+ (CanActivateFn)
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const config = inject(AUTH_CONFIG);

  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirigir al login
  const loginUrl = config.redirects?.login ?? '/login';
  
  // Guardar la URL a la que intentaba acceder para redirigir después del login
  return router.createUrlTree([loginUrl], {
    queryParams: { returnUrl: state.url },
  });
};

