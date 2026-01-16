# Demo App - @agus-auth/angular-auth

Aplicación de demostración del sistema de autenticación.

## 🚀 Cómo ejecutar

### 1. Instalar dependencias (si aún no lo hiciste)
```bash
npm install
```

### 2. Ejecutar la app demo
```bash
npx nx serve demo
```

La aplicación estará disponible en: `http://localhost:4200`

## 🔧 Configuración del Backend

La app demo está configurada para conectarse a `http://localhost:3000/auth`. 

Necesitas un backend que implemente el contrato de autenticación. Opciones:

### Opción A: Backend Mock (JSON Server)

1. Instala json-server:
```bash
npm install -D json-server
```

2. Crea `mock-api/db.json`:
```json
{
  "users": [
    {
      "id": 1,
      "email": "demo@example.com",
      "password": "123456",
      "name": "Usuario Demo",
      "roles": ["user"],
      "emailVerified": true
    }
  ]
}
```

3. Crea `mock-api/routes.json`:
```json
{
  "/auth/*": "/$1"
}
```

4. Ejecuta:
```bash
npx json-server --watch mock-api/db.json --port 3000 --routes mock-api/routes.json
```

### Opción B: Backend Real (Node.js/NestJS)

Ver documentación de backend en `/backend/README.md` (próximamente)

## 📁 Estructura

```
apps/demo/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   └── profile/
│   │   ├── app.config.ts      # Configuración de provideAuth()
│   │   ├── app.routes.ts      # Rutas con authGuard
│   │   └── app.ts
│   ├── main.ts
│   └── index.html
```

## 🧪 Credenciales de Prueba

Si usas el backend mock:
- **Email**: demo@example.com
- **Password**: 123456

## ✨ Funcionalidades Demostradas

- ✅ Login/Logout
- ✅ Registro
- ✅ Guards de ruta (authGuard)
- ✅ Signals reactivos
- ✅ Manejo de sesión
- ✅ Interceptor automático
- ✅ Componentes standalone

## 🔗 Enlaces

- [Documentación de la librería](../../libs/auth/README.md)
- [Contrato Backend](../../docs/BACKEND_CONTRACT.md)

