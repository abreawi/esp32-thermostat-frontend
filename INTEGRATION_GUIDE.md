# Guía de Integración Completa - ESP32 + Web Multi-Usuario

## 🎯 Resumen del Sistema

Has transformado tu aplicación de termostato de un sistema de un solo dispositivo a una **plataforma multi-usuario completa** donde:

- ✅ Múltiples usuarios pueden registrarse
- ✅ Cada usuario puede tener múltiples dispositivos ESP32
- ✅ Cada dispositivo se identifica por su dirección MAC única
- ✅ Control individual de cada termostato
- ✅ Sistema completamente funcional con backend y frontend

---

## 📁 Estructura del Sistema Completo

```
Sistema Multi-Usuario ESP32 Thermostat
│
├── Backend (Node.js + Express)
│   └── C:\Users\Abreawi\Git\led-controller-web-main\backend\
│       - API REST con autenticación JWT
│       - Base de datos SQLite
│       - Servicio MQTT
│       - WebSocket para real-time
│
├── Frontend (HTML/CSS/JS)
│   └── C:\Users\Abreawi\Git\led-controller-web-main\frontend\
│       - Login/Registro
│       - Dashboard de dispositivos
│       - Control de termostato
│
└── ESP32 Firmware
    └── C:\Users\Abreawi\Git\ESP32_LED_Controller\
        - Código actualizado con MAC dinámica
        - Topics MQTT basados en MAC
        - Status online/offline
```

---

## 🚀 Setup Completo Paso a Paso

### PARTE 1: Backend + Frontend

#### 1️⃣ Backend
```bash
# Terminal 1
cd C:\Users\Abreawi\Git\led-controller-web-main\backend
npm install           # Ya hecho ✅
npm run init-db       # Ya hecho ✅
npm run dev           # Iniciar servidor
```

**Deberías ver:**
```
✓ Database connected
✓ Server running on port 3000
✓ MQTT connected
```

#### 2️⃣ Frontend
```bash
# Terminal 2 (nueva)
cd C:\Users\Abreawi\Git\led-controller-web-main\frontend
python -m http.server 8080
```

**Deberías ver:**
```
Serving HTTP on :: port 8080...
```

#### 3️⃣ Verificar Web
Abre: http://localhost:8080

Deberías ver la página de login ✅

---

### PARTE 2: ESP32

#### 1️⃣ Actualizar Credenciales WiFi

Edita: `C:\Users\Abreawi\Git\ESP32_LED_Controller\src\main.cpp`

```cpp
const char* ssid = "TU_WIFI_AQUI";        // ← Cambiar
const char* password = "TU_PASSWORD_AQUI"; // ← Cambiar
```

#### 2️⃣ Compilar y Subir

**Con PlatformIO:**
```bash
cd C:\Users\Abreawi\Git\ESP32_LED_Controller
pio run --target upload
```

**Con Arduino IDE:**
- Abrir proyecto
- Seleccionar placa: ESP32 Dev Module
- Subir

#### 3️⃣ Abrir Serial Monitor

**PlatformIO:**
```bash
pio device monitor
```

**Arduino IDE:**
- Tools → Serial Monitor (115200 baud)

#### 4️⃣ Anotar la MAC

Verás algo como:
```
========================================
  DIRECCIÓN MAC DEL DISPOSITIVO
========================================
  MAC: AA:BB:CC:DD:EE:FF
========================================
```

**⚠️ ANOTA ESTA MAC** - La necesitarás en el siguiente paso

---

### PARTE 3: Integración

#### 1️⃣ Registrarte en la Web

1. Abre http://localhost:8080
2. Click "Regístrate aquí"
3. Completa el formulario:
   - Nombre: Tu Nombre
   - Email: tu@email.com
   - Contraseña: (mínimo 8 caracteres)
4. Click "Crear Cuenta"

#### 2️⃣ Añadir tu ESP32

1. En el dashboard, click "Añadir Dispositivo"
2. Ingresa:
   - **MAC:** `AA:BB:CC:DD:EE:FF` (la que anotaste del Serial)
   - **Nombre:** "Termostato Sala" (o el que quieras)
3. Click "Añadir"

#### 3️⃣ Controlar el Dispositivo

1. Verás una tarjeta con tu dispositivo
2. Click "Controlar"
3. Cambia la temperatura, modo, etc.
4. Los cambios se envían inmediatamente al ESP32

---

## 🔄 Flujo de Comunicación

```
[Usuario Web] → [Frontend] → [Backend API] → [MQTT Broker]
                                                    ↓
                                                [ESP32]
                                                    ↓
                                            [Control Relay]

[ESP32] → [MQTT Broker] → [Backend] → [WebSocket] → [Frontend] → [Usuario ve update]
```

---

## 📡 Topics MQTT por Dispositivo

### Ejemplo con MAC: `AA:BB:CC:DD:EE:FF`

**Comandos (Web → ESP32):**
```
ESP32_AABBCCDDEEFF/command/temp       → "23.5"
ESP32_AABBCCDDEEFF/command/mode       → "manual"
ESP32_AABBCCDDEEFF/command/schedule   → [JSON]
ESP32_AABBCCDDEEFF/command/relay      → "ON"
```

**Estado (ESP32 → Web):**
```
ESP32_AABBCCDDEEFF/status/temp_current  → "22.0"
ESP32_AABBCCDDEEFF/status/temp_target   → "23.5"
ESP32_AABBCCDDEEFF/status/mode          → "manual"
ESP32_AABBCCDDEEFF/status/relay         → "ON"
ESP32_AABBCCDDEEFF/status/config        → {JSON completo}
ESP32_AABBCCDDEEFF/online               → "true"
```

---

## 🧪 Testing del Sistema Completo

### Test 1: Comunicación Web → ESP32

1. **En la web:** Cambia temperatura a 25°C
2. **En Serial Monitor del ESP32:** Deberías ver:
   ```
   Mensaje [ESP32_AABBCCDDEEFF/command/temp]: 25.0
   Nueva temperatura objetivo: 25.0°C
   Configuración guardada
   ```

### Test 2: Comunicación ESP32 → Web

1. **El ESP32 publica** temperatura cada 10 segundos
2. **En la web:** Deberías ver actualizarse la temperatura actual
3. **En DevTools (F12) Console:** Verás mensajes MQTT

### Test 3: Estado Online/Offline

1. **Desconecta el ESP32** (quítale alimentación)
2. **En la web:** Debería aparecer "Desconectado" (puede tardar ~60 seg)
3. **Reconecta el ESP32**
4. **En la web:** Debería volver a "En línea"

### Test 4: Múltiples Dispositivos

1. **Si tienes 2 ESP32:**
   - Sube el código a ambos
   - Cada uno mostrará su propia MAC
   - Añade ambos a tu cuenta con diferentes nombres
   - Controla cada uno independientemente
2. **Los topics serán diferentes:**
   - ESP32 #1: `ESP32_AABBCCDDEEFF/...`
   - ESP32 #2: `ESP32_112233445566/...`

---

## 🔍 Verificación Visual

### En el Serial Monitor del ESP32:

```
=== Termostato ESP32 Multi-Usuario ===

========================================
  DIRECCIÓN MAC DEL DISPOSITIVO
========================================
  MAC: AA:BB:CC:DD:EE:FF
========================================

Topic Prefix: ESP32_AABBCCDDEEFF

Conectando a DIGIFIBRA-kfcT....
WiFi conectado
Dirección IP: 192.168.1.100

Configuración cargada:
  Temperatura objetivo: 22.0°C
  Modo: Manual
  Programaciones: 0

=== Sistema Iniciado ===
Esperando conexión MQTT...

Intentando conexión MQTT...conectado
Estado online: true
Suscrito a topics de comandos
Configuración publicada

[Cada 10 seg]
Publicando temperatura: 22.0°C
```

### En la Consola del Backend:

```
✓ Database connected
✓ Server running on port 3000
🔌 Connecting to MQTT broker: test.mosquitto.org
✓ MQTT connected

📨 MQTT message: ESP32_AABBCCDDEEFF/status/config = {...}
📨 MQTT message: ESP32_AABBCCDDEEFF/status/temp_current = 22.0
📨 MQTT message: ESP32_AABBCCDDEEFF/online = true
```

### En el Navegador (DevTools Console):

```
🔌 Connecting to MQTT broker...
✓ MQTT connected
📡 Subscribed to: ESP32_AABBCCDDEEFF/status/temp_current
📨 Message received: {"topic": "ESP32_AABBCCDDEEFF/status/temp_current", "message": "22.0"}
```

---

## ⚠️ Problemas Comunes y Soluciones

### 1. Backend no conecta a MQTT
**Síntoma:** Backend inicia pero no ve mensajes del ESP32

**Solución:**
- Verifica que ambos usen el mismo broker
- ESP32 usa: `test.mosquitto.org`
- Backend usa: configurado en `.env` (MQTT_BROKER)

### 2. ESP32 no conecta a MQTT
**Síntoma:** Serial muestra "falló, rc=-2"

**Solución:**
```cpp
// Intenta con otro broker
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
```

### 3. Web no ve el dispositivo online
**Síntoma:** Dispositivo siempre aparece "Desconectado"

**Verificar:**
1. Backend recibe mensajes MQTT (check logs)
2. MAC en la web coincide con MAC del ESP32
3. Topic online se está publicando: `ESP32_AABBCCDDEEFF/online`

### 4. Cambios en web no llegan al ESP32
**Síntoma:** Cambias temperatura en web pero ESP32 no responde

**Verificar:**
1. Backend está corriendo
2. ESP32 conectado a MQTT (check Serial)
3. Topics coinciden (check logs de ambos lados)
4. Usuario tiene acceso al dispositivo (backend valida)

---

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Login     │  │  Dashboard   │  │   Control    │  │
│  │ (index.html) │  │(dashboard.html)│ │(device.html) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                          │                              │
│                      API REST                           │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                     HTTP/WebSocket
                           │
┌──────────────────────────┼──────────────────────────────┐
│                    BACKEND (Node.js)                    │
│  ┌────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │    Auth    │   │   Devices    │   │     MQTT     │  │
│  │ Controller │   │  Controller  │   │   Service    │  │
│  └─────┬──────┘   └──────┬───────┘   └──────┬───────┘  │
│        │                 │                   │          │
│        └────────┬────────┴───────┬───────────┘          │
│                 │                │                      │
│         ┌───────▼───────┐  ┌─────▼──────┐              │
│         │  SQLite DB    │  │MQTT Broker │              │
│         │  (users,      │  │  (cloud)   │              │
│         │   devices)    │  └─────┬──────┘              │
│         └───────────────┘        │                      │
└──────────────────────────────────┼──────────────────────┘
                                   │
                              MQTT Topics
                       ESP32_AABBCCDDEEFF/*
                                   │
┌──────────────────────────────────┼──────────────────────────────┐
│                          ESP32 DEVICE                           │
│  ┌────────────┐   ┌──────────────┐   ┌──────────────┐          │
│  │   WiFi     │   │  MQTT Client │   │    Relay     │          │
│  │ Connection │──▶│   (Topics)   │──▶│   Control    │          │
│  └────────────┘   └──────────────┘   └──────────────┘          │
│                                                                  │
│  MAC: AA:BB:CC:DD:EE:FF                                         │
│  Topics: ESP32_AABBCCDDEEFF/*                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎉 ¡Sistema Completo!

Si has llegado hasta aquí y todo funciona:

✅ Backend corriendo y conectado a MQTT
✅ Frontend accesible en navegador
✅ ESP32 conectado a WiFi y MQTT
✅ Dispositivo registrado en la web
✅ Puedes controlar el ESP32 desde la web
✅ Ves actualizaciones en tiempo real

**¡FELICIDADES! Tienes un sistema multi-usuario completamente funcional** 🎊

---

## 📚 Documentación Adicional

- `README.md` - Documentación principal del proyecto
- `QUICK_START.md` - Guía rápida (5 min)
- `IMPLEMENTATION_SUMMARY.md` - Resumen técnico detallado
- `ESP32_LED_Controller/README_MULTI_USER.md` - Guía específica del ESP32

---

## 🔮 Próximos Pasos Opcionales

### 1. Portal Captive WiFi en ESP32
Para no tener que recompilar al cambiar de red:
- ESP32 arranca en modo AP si no tiene WiFi configurado
- Usuario se conecta al AP del ESP32
- Portal web para ingresar credenciales WiFi
- ESP32 guarda credenciales y se conecta

### 2. Sensor de Temperatura Real
Integrar DHT22 o DS18B20:
```cpp
#include <DHT.h>
DHT dht(DHT_PIN, DHT22);
currentTemp = dht.readTemperature();
```

### 3. Modo Programado Funcional
- Obtener hora actual (NTP)
- Verificar programaciones activas
- Activar/desactivar según horario

### 4. Deploy en Producción
- Backend: Heroku, Railway, DigitalOcean
- Frontend: Netlify, Vercel
- HTTPS obligatorio
- Broker MQTT privado

---

**¿Todo funcionando? ¡Disfruta tu sistema multi-usuario!** 🚀
