# 🚀 Desplegar Backend en Railway

Guía completa para desplegar tu backend Node.js en Railway (gratis).

---

## 📋 Prerrequisitos

- [x] Backend funcionando localmente
- [x] Cuenta de GitHub
- [ ] Cuenta de Railway (la crearemos)

---

## 🎯 Paso 1: Crear Repositorio para el Backend

### 1.1 Crear repositorio en GitHub

1. Ve a: https://github.com/new
2. Completa:
   - **Repository name:** `esp32-thermostat-backend`
   - **Visibilidad:** Public o Private (ambos funcionan)
   - **NO marques** ningún checkbox
3. Click **"Create repository"**

### 1.2 Subir el código del backend

Abre PowerShell/CMD:

```bash
# Ir al directorio del backend
cd C:\Users\Abreawi\Git\led-controller-web-main\backend

# Inicializar Git
git init

# Añadir archivos (el .gitignore ya excluye .env y node_modules)
git add .

# Commit
git commit -m "Initial commit: ESP32 Thermostat Backend"

# Conectar con GitHub
git remote add origin https://github.com/abreawi/esp32-thermostat-backend.git
git branch -M main

# Subir
git push -u origin main
```

**Si te pide credenciales:**
- Usuario: `abreawi`
- Password: Tu Personal Access Token (el mismo de antes)

---

## 🎯 Paso 2: Crear Cuenta en Railway

### 2.1 Registrarse

1. Ve a: **https://railway.app**
2. Click **"Login"** o **"Start a New Project"**
3. **Elige: "Login with GitHub"** (es más fácil)
4. Autoriza Railway a acceder a tu GitHub
5. Confirma tu email si te lo pide

### 2.2 Free Tier

Railway te da **$5 de crédito gratis al mes**, suficiente para tu backend.

---

## 🎯 Paso 3: Desplegar el Backend

### 3.1 Crear nuevo proyecto

1. En Railway dashboard, click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si no ves tus repositorios:
   - Click **"Configure GitHub App"**
   - Dale acceso a `esp32-thermostat-backend`
4. Selecciona **`abreawi/esp32-thermostat-backend`**
5. Railway empezará a desplegar automáticamente

### 3.2 Esperar el deploy (2-3 minutos)

Verás logs como:
```
Installing dependencies...
Building...
Starting application...
✓ Deployed successfully
```

---

## 🎯 Paso 4: Configurar Variables de Entorno

### 4.1 Añadir variables

1. En tu proyecto de Railway, click en el servicio (el cuadro con tu backend)
2. Ve a la pestaña **"Variables"**
3. Click **"+ New Variable"**
4. Añade las siguientes variables:

```env
JWT_SECRET=tu-super-secreto-seguro-cambiar-esto-12345
MQTT_BROKER=wss://broker.hivemq.com:8884/mqtt
NODE_ENV=production
```

**Para JWT_SECRET:** Usa una cadena aleatoria larga y segura.

**Ejemplo de JWT_SECRET seguro:**
```
JWT_SECRET=9k2jd83jf9283jf92j3f923jf923jf923jf923jf923jf
```

### 4.2 Aplicar cambios

1. Click **"Deploy"** (arriba a la derecha)
2. Railway redesplegará el backend (1-2 minutos)

---

## 🎯 Paso 5: Obtener URL Pública

### 5.1 Generar dominio

1. En tu proyecto, click en el servicio
2. Ve a la pestaña **"Settings"**
3. Scroll hasta **"Domains"**
4. Click **"Generate Domain"**
5. Railway creará un dominio como: `esp32-thermostat-backend-production.up.railway.app`

### 5.2 Copiar la URL

Copia la URL completa, la necesitarás en el siguiente paso.

Ejemplo:
```
https://esp32-thermostat-backend-production.up.railway.app
```

---

## 🎯 Paso 6: Verificar que Funciona

### 6.1 Probar en el navegador

Abre en tu navegador:
```
https://tu-app.up.railway.app/
```

Deberías ver:
```json
{
  "message": "ESP32 Thermostat API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "devices": "/api/devices",
    "mqtt": "/api/mqtt"
  }
}
```

✅ **¡Tu backend está funcionando!**

### 6.2 Ver logs

Para ver qué está pasando:
1. En Railway, click en tu servicio
2. Ve a la pestaña **"Deployments"**
3. Click en el deployment activo
4. Verás logs en tiempo real

---

## 🎯 Paso 7: Actualizar Frontend

Ahora necesitas decirle al frontend dónde está el backend.

### 7.1 Editar config.js

Edita: `frontend/js/config.js`

```javascript
const CONFIG = {
  BACKEND_URL_DEV: 'http://localhost:3000/api',

  // ← CAMBIAR ESTA LÍNEA con tu URL de Railway
  BACKEND_URL_PROD: 'https://tu-app.up.railway.app/api',

  get BACKEND_URL() {
    return isProduction ? this.BACKEND_URL_PROD : this.BACKEND_URL_DEV;
  },

  MQTT_BROKERS: [
    "wss://test.mosquitto.org:8081",
    "wss://broker.hivemq.com:8884/mqtt"
  ]
};
```

### 7.2 Subir cambios a GitHub

```bash
cd C:\Users\Abreawi\Git\led-controller-web-main\frontend

git add js/config.js
git commit -m "Update backend URL for production"
git push
```

GitHub Pages se actualizará en 1-2 minutos.

---

## 🎯 Paso 8: Probar Todo el Sistema

### 8.1 Abrir tu aplicación

Ve a: `https://abreawi.github.io/esp32-thermostat-frontend/`

### 8.2 Abrir DevTools (F12)

Ve a la pestaña **Console**

Deberías ver:
```
🌐 Entorno: PRODUCCIÓN
🔗 Backend URL: https://tu-app.up.railway.app/api
📡 API Client conectando a: https://tu-app.up.railway.app/api
```

### 8.3 Registrarte

1. Click "Regístrate aquí"
2. Completa el formulario
3. Click "Crear Cuenta"

**Si funciona sin errores → ¡TODO ESTÁ LISTO! 🎉**

### 8.4 Añadir dispositivo

1. En el dashboard, click "Añadir Dispositivo"
2. Ingresa la MAC de tu ESP32
3. Dale un nombre
4. Click "Añadir"

### 8.5 Controlar el ESP32

1. Click "Controlar"
2. Cambia temperatura, modo, etc.
3. Los comandos deberían llegar al ESP32 (verifica Serial Monitor)

---

## 📊 Monitoreo

### Ver estadísticas de Railway

1. Dashboard de Railway
2. Ve a **"Metrics"**
3. Verás:
   - CPU usage
   - Memory usage
   - Network
   - Logs

### Ver logs en tiempo real

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs
```

---

## 💰 Free Tier de Railway

**Límites del plan gratuito:**
- **$5/mes** de crédito
- **500 horas de ejecución/mes**
- **100 GB transferencia/mes**

**Suficiente para:**
- ✅ Backend siempre activo
- ✅ Base de datos SQLite
- ✅ MQTT y WebSocket
- ✅ Uso personal/pequeño

---

## 🐛 Troubleshooting

### Backend no inicia

**Síntoma:** Railway muestra error en deploy

**Solución:**
1. Ve a "Deployments" → "Logs"
2. Busca errores
3. Verifica variables de entorno
4. Asegúrate que `package.json` tiene `"start": "node server.js"`

### CORS Error

**Síntoma:** En frontend ves `Access-Control-Allow-Origin`

**Solución:**
Ya configuramos CORS en el código. Si el error persiste:
1. Verifica que la URL del frontend esté en la lista de CORS
2. Redeployea el backend

### Database Error

**Síntoma:** Error relacionado con SQLite

**Solución:**
Railway ya creó la base de datos automáticamente al ejecutar `npm run build`.

### Conexión MQTT falla

**Síntoma:** ESP32 no recibe comandos

**Solución:**
1. Verifica que backend esté conectado a MQTT (check logs)
2. Verifica que ESP32 use el mismo broker
3. Prueba con otro broker: `test.mosquitto.org`

---

## 🔒 Seguridad en Producción

### Cambiar JWT_SECRET

**⚠️ IMPORTANTE:** Genera un JWT_SECRET seguro:

```javascript
// En Node.js local:
require('crypto').randomBytes(64).toString('hex')
```

Copia el resultado y úsalo en las variables de Railway.

### HTTPS

Railway proporciona HTTPS automáticamente. ✅

### Rate Limiting

Ya está configurado en el código (10 requests/15min en auth).

---

## 🔄 Actualizaciones Futuras

Cada vez que cambies el backend:

```bash
cd backend
git add .
git commit -m "Descripción del cambio"
git push
```

Railway detectará el cambio y redesplegará automáticamente.

---

## ✅ Checklist Final

- [ ] Backend en Railway funcionando
- [ ] URL pública generada
- [ ] Variables de entorno configuradas
- [ ] Frontend actualizado con URL del backend
- [ ] Puedes registrarte desde GitHub Pages
- [ ] Puedes añadir dispositivos
- [ ] ESP32 se conecta y responde a comandos

---

## 🎉 ¡Listo!

Tu sistema completo está **en producción**:

- ✅ **Frontend:** https://abreawi.github.io/esp32-thermostat-frontend/
- ✅ **Backend:** https://tu-app.up.railway.app
- ✅ **ESP32:** Conectado y funcional

**Comparte el link del frontend con quien quieras!** 🚀

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app/)
- [Railway Dashboard](https://railway.app/dashboard)
- [Railway Status](https://status.railway.app/)

---

**¿Problemas?** Revisa los logs en Railway y el console del navegador (F12).
