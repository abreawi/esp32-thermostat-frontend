# 🚀 Desplegar Frontend en GitHub Pages

Esta guía te ayudará a publicar tu frontend en GitHub Pages **paso a paso**.

---

## 📋 Prerrequisitos

- [x] Cuenta de GitHub
- [x] Git instalado en tu computadora
- [x] Frontend funcionando localmente

---

## 🎯 Paso 1: Crear Repositorio en GitHub

### 1.1 Crear nuevo repositorio

1. Ve a: https://github.com/new
2. Completa:
   - **Repository name:** `esp32-thermostat-frontend` (o el nombre que prefieras)
   - **Description:** "Sistema multi-usuario de control de termostatos ESP32"
   - **Visibilidad:** Public (para usar GitHub Pages gratis)
   - **NO** marques "Initialize this repository with a README"
3. Click **"Create repository"**

### 1.2 Copiar URL del repositorio

Verás algo como:
```
https://github.com/TU-USUARIO/esp32-thermostat-frontend.git
```

**Copia esta URL**, la usarás en el siguiente paso.

---

## 🎯 Paso 2: Preparar el Código

### 2.1 Inicializar Git en el frontend

Abre PowerShell o CMD en el directorio del frontend:

```bash
cd C:\Users\Abreawi\Git\led-controller-web-main\frontend

# Inicializar Git
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: ESP32 Thermostat Frontend"
```

### 2.2 Conectar con GitHub

**Reemplaza** `TU-USUARIO` con tu usuario de GitHub:

```bash
git remote add origin https://github.com/TU-USUARIO/esp32-thermostat-frontend.git
git branch -M main
git push -u origin main
```

**Si te pide credenciales:**
- Usuario: tu usuario de GitHub
- Contraseña: usa un **Personal Access Token** (no tu contraseña)
  - Generar token: https://github.com/settings/tokens/new
  - Scopes necesarios: `repo`

---

## 🎯 Paso 3: Activar GitHub Pages

### 3.1 Configurar GitHub Pages

1. Ve a tu repositorio en GitHub:
   ```
   https://github.com/TU-USUARIO/esp32-thermostat-frontend
   ```

2. Click en **"Settings"** (⚙️ arriba a la derecha)

3. En el menú lateral, click **"Pages"**

4. En **"Source"**, selecciona:
   - Branch: **main**
   - Folder: **/ (root)**

5. Click **"Save"**

### 3.2 Esperar el deploy

- GitHub Pages tardará **1-2 minutos** en construir tu sitio
- Verás un mensaje: **"Your site is ready to be published at..."**
- Cuando esté listo: **"Your site is live at..."**

### 3.3 Tu sitio estará en:

```
https://TU-USUARIO.github.io/esp32-thermostat-frontend/
```

🎉 **¡Tu frontend ya está público!**

---

## 🎯 Paso 4: Configurar Backend (IMPORTANTE)

Tu frontend ahora está en GitHub Pages, pero necesita conectarse al backend.

### Opción A: Backend Local (Solo para pruebas)

El frontend intentará conectarse a `localhost:3000` cuando lo abras desde tu computadora.

**Limitación:** Otras personas no podrán usarlo.

### Opción B: Backend en Railway (Recomendado - Gratis)

#### 4.1 Crear cuenta en Railway

1. Ve a: https://railway.app
2. Regístrate con GitHub (es gratis)
3. Confirma tu email

#### 4.2 Desplegar Backend

```bash
# En el directorio del backend
cd C:\Users\Abreawi\Git\led-controller-web-main\backend

# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

#### 4.3 Obtener URL pública

1. Ve a tu proyecto en https://railway.app/dashboard
2. Click en tu servicio
3. Ve a **"Settings"** → **"Domains"**
4. Click **"Generate Domain"**
5. Copia la URL: `https://tu-proyecto.up.railway.app`

#### 4.4 Actualizar Frontend

Edita `frontend/js/config.js`:

```javascript
BACKEND_URL_PROD: 'https://tu-proyecto.up.railway.app/api',
```

Guarda y haz commit:

```bash
cd C:\Users\Abreawi\Git\led-controller-web-main\frontend
git add js/config.js
git commit -m "Update backend URL for production"
git push
```

**GitHub Pages se actualizará automáticamente en 1-2 minutos.**

---

## 🎯 Paso 5: Verificar que Funciona

### 5.1 Abrir tu sitio

Ve a: `https://TU-USUARIO.github.io/esp32-thermostat-frontend/`

### 5.2 Abrir DevTools (F12)

Ve a la pestaña **Console**

Deberías ver:
```
🌐 Entorno: PRODUCCIÓN
🔗 Backend URL: https://tu-proyecto.up.railway.app/api
📡 API Client conectando a: https://tu-proyecto.up.railway.app/api
```

### 5.3 Probar login

1. Click "Regístrate aquí"
2. Crea una cuenta
3. Debería funcionar sin errores

**Si ves errores de CORS:**
- Tu backend necesita permitir el dominio de GitHub Pages
- Ver [sección CORS](#-cors-configuration) más abajo

---

## 🔧 Configuración Adicional

### 🌐 CORS Configuration

Si tu backend está en otro dominio, necesitas configurar CORS.

Edita `backend/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://TU-USUARIO.github.io'
  ],
  credentials: true
}));
```

### 🔒 HTTPS para MQTT

Si usas GitHub Pages (HTTPS), tu broker MQTT también debe ser HTTPS (WSS):

En `frontend/js/config.js`:

```javascript
MQTT_BROKERS: [
  "wss://test.mosquitto.org:8081",      // ✅ WSS
  "wss://broker.hivemq.com:8884/mqtt"   // ✅ WSS
]
```

**NO uses:** `ws://` (sin S) en producción.

---

## 📝 Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
cd C:\Users\Abreawi\Git\led-controller-web-main\frontend

# Ver cambios
git status

# Añadir cambios
git add .

# Commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

---

## 🐛 Troubleshooting

### El sitio no carga

**Problema:** Ves 404 en GitHub Pages

**Solución:**
1. Verifica que GitHub Pages esté activado en Settings → Pages
2. Espera 2-3 minutos después de activarlo
3. Verifica que el branch sea **main** y la carpeta sea **/ (root)**

### CORS Error

**Problema:** En Console ves `Access-Control-Allow-Origin`

**Solución:**
1. Configura CORS en el backend (ver arriba)
2. Reinicia el backend
3. Limpia caché del navegador (Ctrl+Shift+Delete)

### Mixed Content Error

**Problema:** `Mixed Content: The page was loaded over HTTPS, but requested...`

**Solución:**
- Todos los recursos deben ser HTTPS
- Backend: usar HTTPS (Railway, Render lo hacen automático)
- MQTT: usar WSS en lugar de WS

### Backend no responde

**Problema:** Timeout al conectar al backend

**Solución:**
1. Verifica que el backend esté corriendo (Railway/Render)
2. Verifica la URL en `config.js`
3. Abre la URL del backend directamente en el navegador

---

## ✅ Checklist Final

Antes de compartir tu sitio:

- [ ] Frontend desplegado en GitHub Pages
- [ ] Backend desplegado (Railway/Render) o corriendo localmente
- [ ] CORS configurado correctamente
- [ ] config.js actualizado con URL del backend
- [ ] Puedes registrarte y login funciona
- [ ] Puedes añadir dispositivos
- [ ] El ESP32 está conectado al mismo broker MQTT

---

## 🎉 ¡Listo!

Tu aplicación está **pública en internet**. Comparte el link:

```
https://TU-USUARIO.github.io/esp32-thermostat-frontend/
```

---

## 📚 Recursos Adicionales

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Railway Docs](https://docs.railway.app/)
- [Git Tutorial](https://git-scm.com/docs/gittutorial)

---

**¿Problemas?** Abre un issue en el repositorio o consulta los logs en DevTools (F12).
