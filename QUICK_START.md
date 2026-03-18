# Quick Start Guide

## Instalación Rápida (5 minutos)

### 1. Instalar Backend

```bash
cd backend
npm install
npm run init-db
```

### 2. Configurar Variables de Entorno

Edita `backend/.env`:

```env
JWT_SECRET=cambiar-esto-en-produccion-usar-string-seguro
PORT=3000
MQTT_BROKER=wss://broker.hivemq.com:8884/mqtt
```

### 3. Iniciar Servicios

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8080
```

### 4. Abrir Aplicación

Abre tu navegador en: http://localhost:8080

## Primera Vez - Testing

### 1. Registrarse

1. Abre http://localhost:8080
2. Click "Regístrate aquí"
3. Ingresa:
   - Nombre: Test User
   - Email: test@test.com
   - Contraseña: test1234
4. Click "Crear Cuenta"

### 2. Añadir Dispositivo de Prueba

1. En el dashboard, click "Añadir Dispositivo"
2. Ingresa MAC: `AA:BB:CC:DD:EE:FF`
3. Nombre: "Termostato Prueba"
4. Click "Añadir"

### 3. Controlar Dispositivo

1. Click en "Controlar" en la tarjeta del dispositivo
2. Verás la interfaz de control
3. Los topics MQTT serán: `ESP32_AABBCCDDEEFF/...`

## Testing con cURL

### Registrar Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test1234",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test1234"
  }'
```

Guarda el token de la respuesta.

### Listar Dispositivos

```bash
curl http://localhost:3000/api/devices \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Claim Device

```bash
curl -X POST http://localhost:3000/api/devices/claim \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "mac_address": "AA:BB:CC:DD:EE:FF",
    "device_alias": "Mi Termostato"
  }'
```

## Configuración ESP32

Para que un ESP32 funcione con este sistema:

### 1. Portal Captive (Setup WiFi)

```cpp
// ESP32 arranca en modo AP
WiFi.softAP("ESP32_Setup_AABBCCDDEEFF");
// Mostrar MAC en pantalla LCD/OLED
// Servir portal para configurar WiFi
```

### 2. Conectar MQTT

```cpp
// Obtener MAC address
String macAddress = WiFi.macAddress();
macAddress.replace(":", "");

// Topic prefix
String topicPrefix = "ESP32_" + macAddress;

// Subscribirse a comandos
client.subscribe((topicPrefix + "/command/temp").c_str());
client.subscribe((topicPrefix + "/command/mode").c_str());
client.subscribe((topicPrefix + "/command/schedule").c_str());

// Publicar estado
client.publish((topicPrefix + "/status/temp_current").c_str(), "22.5");
client.publish((topicPrefix + "/status/temp_target").c_str(), "23.0");
client.publish((topicPrefix + "/online").c_str(), "true");
```

### 3. Topics MQTT

**Suscribirse (recibir comandos):**
- `ESP32_AABBCCDDEEFF/command/temp` → Nueva temperatura objetivo
- `ESP32_AABBCCDDEEFF/command/mode` → Cambio de modo
- `ESP32_AABBCCDDEEFF/command/schedule` → Nuevas programaciones
- `ESP32_AABBCCDDEEFF/request/config` → Enviar configuración completa

**Publicar (enviar estado):**
- `ESP32_AABBCCDDEEFF/status/temp_current` → Temperatura actual
- `ESP32_AABBCCDDEEFF/status/temp_target` → Temperatura objetivo
- `ESP32_AABBCCDDEEFF/status/mode` → Modo actual (manual/programado)
- `ESP32_AABBCCDDEEFF/status/relay` → Estado relay (ON/OFF)
- `ESP32_AABBCCDDEEFF/status/config` → Configuración completa (JSON)
- `ESP32_AABBCCDDEEFF/online` → true/false

## Troubleshooting Rápido

**Error: Cannot find module**
```bash
cd backend
npm install
```

**Error: EADDRINUSE (puerto ocupado)**
```bash
# Cambiar puerto en backend/.env
PORT=3001
```

**Frontend no carga**
```bash
# Verificar que Python esté instalado
python --version

# O usar Node.js
npx serve -p 8080
```

**Token inválido**
- Cierra sesión y vuelve a iniciar
- Verifica JWT_SECRET en .env

## ¿Necesitas Ayuda?

1. Revisa logs en la consola del backend
2. Abre DevTools en el navegador (F12) para ver errores
3. Verifica que ambos servicios estén corriendo
4. Revisa README.md para más detalles

¡Listo! Ya tienes tu sistema multi-usuario funcionando. 🎉
