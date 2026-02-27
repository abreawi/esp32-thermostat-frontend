# ESP32 Thermostat - Frontend

Sistema de control multi-usuario para termostatos ESP32.

## 🌐 Demo en Vivo

[Ver Demo](https://tu-usuario.github.io/esp32-thermostat-frontend/)

## ✨ Características

- ✅ Autenticación de usuarios (registro/login)
- ✅ Dashboard de dispositivos
- ✅ Control individual de termostatos ESP32
- ✅ Interfaz responsive
- ✅ Updates en tiempo real vía MQTT

## 🚀 Tecnologías

- HTML5 / CSS3 / JavaScript (Vanilla)
- MQTT.js para comunicación IoT
- LocalStorage para persistencia

## 📦 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/esp32-thermostat-frontend.git
cd esp32-thermostat-frontend

# Servir con cualquier servidor web
python -m http.server 8080
# O
npx serve -p 8080
```

Abre http://localhost:8080

## ⚙️ Configuración

### Backend URL

Edita `js/config.js` para cambiar la URL del backend:

```javascript
const CONFIG = {
  BACKEND_URL_PROD: 'https://tu-backend.railway.app/api'
};
```

### MQTT Brokers

Los brokers MQTT están configurados en `js/config.js`:

```javascript
MQTT_BROKERS: [
  "wss://test.mosquitto.org:8081",
  "wss://broker.hivemq.com:8884/mqtt"
]
```

## 🔐 Requisitos

**Para funcionar completamente, necesitas:**

1. ✅ Backend API corriendo (ver [backend README](../backend/README.md))
2. ✅ Broker MQTT accesible
3. ✅ ESP32 con el firmware actualizado

## 📱 Páginas

- `index.html` - Login / Registro
- `dashboard.html` - Lista de dispositivos
- `device.html` - Control de termostato

## 🎨 Personalización

### Colores

Edita las variables CSS en `css/auth.css`, `css/dashboard.css`, o `css/styles.css`:

```css
:root {
  --accent: #ff6a1a;    /* Color principal */
  --accent-2: #1d8bfd;  /* Color secundario */
}
```

## 📄 Licencia

MIT

## 👤 Autor

Tu nombre - [GitHub](https://github.com/tu-usuario)

---

Desarrollado con ❤️ para IoT
