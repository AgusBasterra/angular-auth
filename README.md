# @my-org/angular-auth - Guía de Inicio Rápido

## 📦 Resumen del Proyecto

Este es un sistema de autenticación completo y reutilizable para Angular 21+.

```
angular-auth/
├── libs/auth/              # 📚 Librería de autenticación
│   ├── src/
│   │   ├── lib/
│   │   │   ├── config/     # Configuración y providers
│   │   │   ├── models/     # DTOs y modelos
│   │   │   ├── services/   # AuthService, Storage, HTTP
│   │   │   ├── guards/     # authGuard, roleGuard
│   │   │   ├── interceptors/ # authInterceptor
│   │   │   └── components/ # Login, Register, etc.
│   │   └── index.ts        # Public API
│   ├── package.json        # @my-org/angular-auth
│   └── README.md
│
└── apps/demo/              # 🎨 App de demostración
    ├── src/app/
    │   ├── pages/          # Dashboard, Profile
    │   ├── app.config.ts   # provideAuth() configurado
    │   └── app.routes.ts   # Rutas protegidas
    └── README.md
```

## 📝 Próximos Pasos

### 1. Probar la Demo

```bash
# Ejecutar la app demo
npx nx serve demo
```

Necesitarás un backend. Ver `apps/demo/README.md` para opciones de mock.

### 2. Usar en Otros Proyectos

```bash
# Instalar
npm install @my-org/angular-auth

# Configurar en app.config.ts
import { provideAuth } from '@my-org/angular-auth';

export const appConfig = {
  providers: [
    provideAuth({
      apiUrl: 'https://api.example.com/auth',
      storage: 'localStorage',
    }),
  ],
};
```

## 🎯 Características Implementadas

### Core
- ✅ Autenticación JWT con refresh automático
- ✅ Multi-tenant (header o subdomain)
- ✅ Storage flexible (localStorage/sessionStorage/memory)
- ✅ Signals reactivos (Angular 21+)
- ✅ Guards funcionales
- ✅ Interceptor funcional
- ✅ Standalone components
- ✅ Tree-shakeable

### Features Opcionales
- ✅ Registro de usuarios
- ✅ Password reset (forgot/reset)
- ✅ Email verification
- ✅ Role-based access control
- ✅ Mappers personalizables (userMapper, tokenMapper)

### Configuración
- ✅ Endpoints personalizables
- ✅ Redirecciones personalizables
- ✅ Features activables/desactivables
- ✅ Multi-tenant opcional
- ✅ Auto-refresh configurable

## 📖 Documentación

- **Librería**: `libs/auth/README.md` - Documentación completa de la API
- **Demo**: `apps/demo/README.md` - Cómo ejecutar la demo
- **Backend**: Ver DTOs en `libs/auth/src/lib/models/auth-dtos.ts`

## 🔧 Comandos Útiles

```bash
# Compilar librería
npx nx build auth

# Ejecutar demo
npx nx serve demo

# Ejecutar tests (cuando estén implementados)
npx nx test auth

# Lint
npx nx lint auth

# Ver dependencias
npx nx graph
```

## 🎨 Ejemplo de Uso

```typescript
// app.config.ts
import { provideAuth } from '@my-org/angular-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth({
      apiUrl: 'https://api.example.com/auth',
      storage: 'localStorage',
      features: {
        registration: true,
        passwordReset: true,
      },
    }),
  ],
};

// component.ts
import { Component, inject } from '@angular/core';
import { AuthService } from '@my-org/angular-auth';

@Component({
  template: `
    @if (auth.isAuthenticated()) {
      <p>Hola {{ auth.userName() }}!</p>
      <button (click)="auth.logout()">Logout</button>
    }
  `
})
export class MyComponent {
  protected auth = inject(AuthService);
}

// routes.ts
import { authGuard } from '@my-org/angular-auth';

export const routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
```

## 🤝 Contribuir

Este es un proyecto interno. Para contribuir:

1. Crea una rama feature
2. Implementa tus cambios
3. Asegúrate de que compile sin errores
4. Actualiza la documentación si es necesario
5. Crea un PR


**Desarrollado por Agustín Basterra** 🚀
