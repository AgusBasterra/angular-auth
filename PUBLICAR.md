# 🚀 Guía Rápida de Publicación

## ⚠️ Problema Resuelto

El scope del paquete ha sido corregido de `@agus-auth` a `@AgusBasterra` para que coincida con tu usuario de GitHub.

## 📋 Pasos para Publicar

### 1️⃣ Crear GitHub Personal Access Token

1. Ve a: https://github.com/settings/tokens/new
2. Nombre: `npm-publish-token`
3. Expiración: Elige una (ej: 90 días)
4. Selecciona estos scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
5. Click en **"Generate token"**
6. **Copia el token inmediatamente** (no podrás verlo de nuevo)

### 2️⃣ Configurar el Token en PowerShell

Abre PowerShell y ejecuta:

```powershell
$env:GITHUB_TOKEN = "ghp_tu_token_aqui"
```

**⚠️ IMPORTANTE**: Reemplaza `ghp_tu_token_aqui` con el token real que copiaste.

### 3️⃣ Verificar que el Token Está Configurado

```powershell
echo $env:GITHUB_TOKEN
```

Debería mostrar tu token (o al menos algo, no vacío).

### 4️⃣ Publicar

Desde la carpeta del proyecto:

```powershell
cd "C:\Users\agust\Documents\Proyectos\Generic Auth\angular-auth"
npm run publish:auth
```

## ✅ Verificar Publicación

1. Ve a: https://github.com/AgusBasterra?tab=packages
2. Deberías ver `@AgusBasterra/angular-auth` publicado

## 🔄 Si el Token Expira

Solo repite el paso 2 con un nuevo token.

## 📥 Instalar en Otros Proyectos

### 1. Crear `.npmrc` en el proyecto:

```ini
@AgusBasterra:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Configurar el token (igual que antes):

```powershell
$env:GITHUB_TOKEN = "ghp_tu_token_aqui"
```

### 3. Instalar:

```bash
npm install @AgusBasterra/angular-auth@1.0.0
```

---

## 🐛 Solución de Problemas

### Error: "401 Unauthorized"
- ✅ Verifica que el token esté configurado: `echo $env:GITHUB_TOKEN`
- ✅ Verifica que el token tenga los permisos `write:packages` y `read:packages`
- ✅ Verifica que el scope del paquete sea `@AgusBasterra` (ya corregido)

### Error: "403 Forbidden"
- ✅ El scope `@AgusBasterra` debe coincidir exactamente con tu usuario de GitHub
- ✅ Verifica que el token no haya expirado

### El token se pierde al cerrar PowerShell
- ✅ Esto es normal. Vuelve a configurarlo cada vez que necesites publicar
- ✅ O crea un archivo `.env` y úsalo con un script (más avanzado)

---

## 🎯 Resumen

```powershell
# 1. Configurar token
$env:GITHUB_TOKEN = "ghp_tu_token_real"

# 2. Publicar
npm run publish:auth

# 3. Verificar
# Ve a: https://github.com/AgusBasterra?tab=packages
```

¡Listo! 🎉
