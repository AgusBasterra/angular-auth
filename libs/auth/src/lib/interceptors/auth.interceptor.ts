import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStorageService } from '../services/auth-storage.service';
import { AUTH_CONFIG } from '../config/auth.tokens';

/**
 * Interceptor funcional para agregar el token de autenticación a las peticiones HTTP
 * Compatible con Angular 21+ (HttpInterceptorFn)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(AuthStorageService);
  const config = inject(AUTH_CONFIG);

  // Obtener el token
  const token = storage.getAccessToken();

  // Si no hay token, continuar sin modificar
  if (!token) {
    return next(req);
  }

  // Verificar si la petición es hacia el API configurado
  const isApiRequest = req.url.startsWith(config.apiUrl);

  // Solo agregar el token si es una petición al API
  if (!isApiRequest) {
    return next(req);
  }

  // Clonar la petición y agregar el Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};

