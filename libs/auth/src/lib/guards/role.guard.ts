import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AUTH_CONFIG } from '../config/auth.tokens';

/**
 * Guard funcional para proteger rutas por roles
 * Compatible con Angular 21+ (CanActivateFn)
 * 
 * Uso en las rutas:
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [roleGuard],
 *   data: { roles: ['admin'] } // o { roles: ['admin', 'moderator'], requireAll: false }
 * }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const config = inject(AUTH_CONFIG);

  // Verificar si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    const loginUrl = config.redirects?.login ?? '/login';
    return router.createUrlTree([loginUrl]);
  }

  // Obtener los roles requeridos de la configuración de la ruta
  const requiredRoles = route.data['roles'] as string[] | undefined;
  const requireAll = route.data['requireAll'] as boolean | undefined ?? false;

  // Si no hay roles requeridos, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar roles
  const hasAccess = requireAll
    ? authService.hasAllRoles(requiredRoles)
    : authService.hasAnyRole(requiredRoles);

  if (hasAccess) {
    return true;
  }

  // Si no tiene los roles, redirigir a unauthorized
  const unauthorizedUrl = config.redirects?.unauthorized ?? '/login';
  return router.createUrlTree([unauthorizedUrl]);
};

