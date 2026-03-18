# Sistema Multi-Usuario para Termostatos ESP32

Sistema completo de control de termostatos ESP32 con autenticación de usuarios y gestión de múltiples dispositivos.

## Características

- ✅ Sistema de autenticación (registro/login) con JWT
- ✅ Multi-usuario: cada usuario puede tener múltiples dispositivos
- ✅ Claim de dispositivos por dirección MAC
- ✅ Control individual de cada termostato
- ✅ Comunicación MQTT con topics dinámicos por dispositivo
- ✅ Updates en tiempo real vía WebSocket
- ✅ Interfaz web responsive

## Arquitectura

```
Frontend (HTML/JS) ← API REST → Backend (Express/Node.js)
                                      ↓
                                  SQLite DB
                                      ↓
                              MQTT Broker ↔ ESP32 Devices
```

## Estructura del Proyecto

```
led-controller-web-main/
├── backend/              # API Backend
│   ├── src/
│   │   ├── config/       # Configuración DB y MQTT
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Autenticación y errores
│   │   ├── models/       # Modelos de datos
│   │   ├── routes/       # Rutas de la API
│   │   ├── services/     # Servicios (MQTT)
│   │   └── utils/        # Utilidades
│   ├── database/         # Base de datos SQLite
│   ├── .env             # Variables de entorno
│   ├── package.json
│   └── server.js        # Entry point
│
└── frontend/            # Interfaz Web
    ├── css/
    │   ├── auth.css     # Estilos login/registro
    │   ├── dashboard.css # Estilos lista dispositivos
    │   └── styles.css   # Estilos control dispositivo
    ├── js/
    │   ├── api.js       # Cliente API
    │   ├── auth.js      # Lógica auth
    │   ├── dashboard.js # Lógica dashboard
    │   └── app.js       # Lógica control
    ├── index.html       # Login/Registro
    ├── dashboard.html   # Lista dispositivos
    └── device.html      # Control dispositivo
```

## Instalación y Configuración

### 1. Backend

```bash
cd backend
npm install
```

Configura las variables de entorno en `.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3000
MQTT_BROKER=wss://broker.hivemq.com:8884/mqtt
DATABASE_PATH=./database/thermostat.db
NODE_ENV=development
```

Inicializa la base de datos:

```bash
npm run init-db
```

Inicia el servidor:

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

### 2. Frontend

El frontend es estático (HTML/JS), puedes servirlo con cualquier servidor web:

```bash
cd frontend

# Opción 1: Python
python -m http.server 8080

# Opción 2: Node.js (npx)
npx serve -p 8080

# Opción 3: Live Server (VSCode extension)
```

Abre http://localhost:8080 en tu navegador.

**Importante:** Asegúrate de que el backend esté corriendo en `http://localhost:3000` o actualiza la URL en `frontend/js/api.js`.

## Flujo de Uso

### 1. Configuración ESP32

El ESP32 debe:
- Arrancar en modo AP: `ESP32_Setup_AABBCCDDEEFF`
- Servir portal captivo para configurar WiFi
- Mostrar su dirección MAC en pantalla
- Conectarse a MQTT con topics: `ESP32_AABBCCDDEEFF/*`

### 2. Registro de Usuario

1. Abre la aplicación web
2. Crea una cuenta con email y contraseña
3. Inicia sesión

### 3. Añadir Dispositivo

1. En el dashboard, click "Añadir Dispositivo"
2. Ingresa la MAC del ESP32 (impresa en carcasa)
3. Opcionalmente asigna un nombre (Ej: "Sala", "Dormitorio")
4. El dispositivo queda vinculado a tu cuenta

### 4. Controlar Dispositivo

1. Click en el dispositivo desde el dashboard
2. Controla temperatura, modo, programaciones, etc.
3. Los cambios se comunican vía MQTT al ESP32

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obtener usuario actual

### Dispositivos

- `POST /api/devices/claim` - Reclamar dispositivo
- `GET /api/devices` - Listar dispositivos del usuario
- `GET /api/devices/:id` - Obtener dispositivo
- `PUT /api/devices/:id` - Actualizar alias
- `DELETE /api/devices/:id/unclaim` - Desvincular

### MQTT

- `POST /api/mqtt/publish` - Publicar mensaje
- `WebSocket ws://localhost:3000?token=<jwt>` - Updates en tiempo real

## Topics MQTT

Cada dispositivo usa su propia MAC como prefijo:

### Comandos (Web → ESP32)
- `ESP32_AABBCCDDEEFF/command/temp` - Temperatura objetivo
- `ESP32_AABBCCDDEEFF/command/mode` - Modo (manual/programado)
- `ESP32_AABBCCDDEEFF/command/schedule` - Programaciones
- `ESP32_AABBCCDDEEFF/command/relay` - Control relay

### Estado (ESP32 → Web)
- `ESP32_AABBCCDDEEFF/status/temp_current` - Temperatura actual
- `ESP32_AABBCCDDEEFF/status/temp_target` - Temperatura objetivo
- `ESP32_AABBCCDDEEFF/status/mode` - Modo actual
- `ESP32_AABBCCDDEEFF/status/relay` - Estado relay
- `ESP32_AABBCCDDEEFF/status/config` - Configuración completa
- `ESP32_AABBCCDDEEFF/online` - Estado online/offline

## Tecnologías

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- JWT para autenticación
- bcrypt para contraseñas
- mqtt.js para MQTT
- WebSocket (ws) para real-time

**Frontend:**
- HTML5/CSS3/JavaScript vanilla
- MQTT.js para comunicación
- Diseño responsive

## Seguridad

- Contraseñas hasheadas con bcrypt (10 salt rounds)
- Autenticación JWT con expiración de 7 días
- Validación de acceso a dispositivos
- Rate limiting en endpoints de autenticación
- CORS configurado
- Queries SQL parametrizadas

## Desarrollo

### Testing Backend

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'

# Listar dispositivos (usa el token del login)
curl http://localhost:3000/api/devices \
  -H "Authorization: Bearer <TOKEN>"
```

### Base de Datos

Para explorar la base de datos SQLite:

```bash
cd backend/database
sqlite3 thermostat.db

# Comandos útiles
.tables              # Ver tablas
.schema users        # Ver schema
SELECT * FROM users; # Ver usuarios
```

## Troubleshooting

**Backend no inicia:**
- Verifica que `.env` esté configurado
- Verifica que la base de datos esté inicializada: `npm run init-db`
- Revisa logs de consola

**Frontend no conecta al backend:**
- Verifica que el backend esté corriendo en puerto 3000
- Revisa la URL en `frontend/js/api.js`
- Verifica CORS en el backend

**MQTT no conecta:**
- Verifica el broker en `.env`
- Prueba con broker alternativo (test.mosquitto.org)
- Revisa firewall/red

**Token inválido:**
- El token expira en 7 días
- Cierra sesión y vuelve a iniciar sesión

## Producción

Para producción:

1. Cambia `JWT_SECRET` a un valor seguro
2. Usa HTTPS para frontend y backend
3. Configura CORS con dominio específico
4. Considera usar broker MQTT privado
5. Implementa respaldos de la base de datos
6. Agrega logging (Winston, Morgan)
7. Usa PM2 o similar para el backend

## Licencia

MIT

## Autor

Sistema desarrollado para control multi-usuario de termostatos ESP32
