# 📦 Guía de Publicación en GitHub Packages

Esta guía te ayudará a publicar `@agus-auth/angular-auth` en GitHub Packages.

## 📋 Prerrequisitos

1. **Cuenta de GitHub** con el repositorio `AgusBasterra/angular-auth`
2. **GitHub Personal Access Token (PAT)** con permisos:
   - `write:packages`
   - `read:packages`
   - `delete:packages` (opcional, para eliminar versiones)

## 🔑 Paso 1: Crear GitHub Personal Access Token

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Nombre: `npm-publish-token`
4. Selecciona los scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `delete:packages` (opcional)
5. Click en "Generate token"
6. **Copia el token inmediatamente** (no podrás verlo de nuevo)

## 🔧 Paso 2: Configurar el Token

### Opción A: Variable de Entorno (Recomendado)

**Windows (PowerShell):**
```powershell
$env:GITHUB_TOKEN = "tu_token_aqui"
```

**Windows (CMD):**
```cmd
set GITHUB_TOKEN=tu_token_aqui
```

**Linux/Mac:**
```bash
export GITHUB_TOKEN=tu_token_aqui
```

### Opción B: .npmrc Global (Alternativa)

Crea o edita `~/.npmrc` (o `C:\Users\TuUsuario\.npmrc` en Windows):

```ini
@agus-auth:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=tu_token_aqui
```

⚠️ **Nota de Seguridad**: No commitees este archivo con el token. Si lo haces, revoca el token inmediatamente.

## 📝 Paso 3: Verificar Configuración

El `package.json` del dist ya tiene configurado:

```json
{
  "name": "@agus-auth/angular-auth",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

El `.npmrc` en `dist/libs/auth` también está configurado.

## 🚀 Paso 4: Publicar

### Opción 1: Usar el Script (Recomendado)

Desde la raíz del proyecto:

```bash
npm run publish:auth
```

Este script:
1. Compila la librería (`nx build auth`)
2. Navega a `dist/libs/auth`
3. Publica en GitHub Packages

### Opción 2: Manual

```bash
# 1. Compilar
npx nx build auth

# 2. Ir a la carpeta del dist
cd dist/libs/auth

# 3. Publicar
npm publish
```

### Opción 3: Dry Run (Probar sin publicar)

```bash
npm run publish:auth:dry-run
```

Esto te mostrará qué se publicaría sin hacerlo realmente.

## ✅ Paso 5: Verificar Publicación

1. Ve a tu repositorio en GitHub: `https://github.com/AgusBasterra/angular-auth`
2. Click en "Packages" (en el menú derecho)
3. Deberías ver `@agus-auth/angular-auth` publicado

O visita directamente:
```
https://github.com/AgusBasterra?tab=packages
```

## 📥 Paso 6: Instalar en Otros Proyectos

### 1. Crear `.npmrc` en el proyecto que usará la librería

```ini
@agus-auth:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Configurar la variable de entorno

```bash
export GITHUB_TOKEN=tu_token_aqui  # Linux/Mac
# o
$env:GITHUB_TOKEN = "tu_token_aqui"  # Windows PowerShell
```

### 3. Instalar

```bash
npm install @agus-auth/angular-auth@1.0.0
```

## 🔄 Actualizar Versión

Para publicar una nueva versión:

1. **Actualizar versión en `libs/auth/package.json`**:
   ```json
   {
     "version": "1.0.1"  // o 1.1.0, 2.0.0, etc.
   }
   ```

2. **Recompilar y publicar**:
   ```bash
   npm run publish:auth
   ```

3. **O usar npm version** (recomendado):
   ```bash
   cd libs/auth
   npm version patch  # 1.0.0 → 1.0.1
   # o
   npm version minor  # 1.0.0 → 1.1.0
   # o
   npm version major  # 1.0.0 → 2.0.0
   cd ../..
   npm run publish:auth
   ```

## 🐛 Solución de Problemas

### Error: "You must be logged in to publish packages"

**Solución**: Configura el token en la variable de entorno `GITHUB_TOKEN` o en `.npmrc`.

### Error: "403 Forbidden"

**Solución**: 
- Verifica que el token tenga los permisos correctos
- Verifica que el nombre del paquete coincida con tu usuario/organización de GitHub
- El scope `@agus-auth` debe coincidir con tu usuario `AgusBasterra`

### Error: "Package name must match repository name"

**Solución**: El nombre del paquete debe ser `@agus-auth/angular-auth` donde `agus-auth` es tu usuario de GitHub o una organización a la que perteneces.

### Error: "Version already exists"

**Solución**: Incrementa la versión en `libs/auth/package.json` antes de publicar.

## 🔐 Seguridad

- ✅ **NUNCA** commitees tokens en `.npmrc` o código
- ✅ Usa variables de entorno para tokens
- ✅ Revoca tokens si se comprometen
- ✅ Usa tokens con permisos mínimos necesarios

## 📚 Recursos

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [npm publish Documentation](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)

---

## 🎯 Resumen Rápido

```bash
# 1. Configurar token
export GITHUB_TOKEN=tu_token

# 2. Publicar
npm run publish:auth

# 3. Instalar en otro proyecto
# (crear .npmrc con el token)
npm install @agus-auth/angular-auth@1.0.0
```

¡Listo! 🎉
