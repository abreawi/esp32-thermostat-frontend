# 🚀 Deploy Backend Rápido (10 minutos)

## Resumen Ultra Rápido

### 1️⃣ Subir Backend a GitHub (3 min)

```bash
cd C:\Users\Abreawi\Git\led-controller-web-main\backend

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/abreawi/esp32-thermostat-backend.git
git branch -M main
git push -u origin main
```

**Crear repo primero en:** https://github.com/new
- Nombre: `esp32-thermostat-backend`

---

### 2️⃣ Desplegar en Railway (4 min)

1. Ve a: **https://railway.app**
2. **Login with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. Selecciona: `abreawi/esp32-thermostat-backend`
5. Espera 2-3 minutos

---

### 3️⃣ Configurar Variables (1 min)

En Railway → Tu proyecto → **Variables** → Añadir:

```env
JWT_SECRET=9k2jd83jf9283jf92j3f923jf923jf923jf923jf923jf
MQTT_BROKER=wss://broker.hivemq.com:8884/mqtt
NODE_ENV=production
```

Click **Deploy**

---

### 4️⃣ Obtener URL (1 min)

En Railway → **Settings** → **Domains** → **Generate Domain**

Copia la URL (algo como):
```
https://esp32-thermostat-backend-production.up.railway.app
```

---

### 5️⃣ Actualizar Frontend (1 min)

Edita: `frontend/js/config.js`

```javascript
BACKEND_URL_PROD: 'https://tu-app.up.railway.app/api',
```

Sube cambios:

```bash
cd frontend
git add js/config.js
git commit -m "Update backend URL"
git push
```

---

## ✅ Probar

1. Abre: https://abreawi.github.io/esp32-thermostat-frontend/
2. Regístrate
3. Añade dispositivo
4. ¡Controla tu ESP32!

---

## 🎉 ¡Listo en 10 minutos!

**Documentación completa:** `DEPLOY_BACKEND_RAILWAY.md`
