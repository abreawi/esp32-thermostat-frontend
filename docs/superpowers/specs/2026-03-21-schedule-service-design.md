# Scheduler de Programaciones para Termostato ESP32

**Fecha:** 2026-03-21
**Autor:** Claude Sonnet 4.5
**Estado:** Aprobado para implementación

## Resumen Ejecutivo

Implementar un servicio scheduler en el backend que evalúe automáticamente las programaciones de temperatura de los dispositivos ESP32 y envíe comandos MQTT cuando corresponda. El sistema debe funcionar eficientemente con ESP32 en modo deep sleep (despertar cada 3 minutos).

## Problema

Actualmente, las programaciones de temperatura se guardan en el ESP32 y este debe evaluarlas localmente. Con deep sleep cada 3 minutos:
- ESP32 no puede mantener lógica de programación compleja mientras duerme
- Consumiría más energía si tuviera que sincronizar hora NTP al despertar
- No hay una fuente única de verdad para las programaciones

## Solución

El backend será responsable de:
1. Almacenar programaciones en base de datos (fuente de verdad)
2. Detectar cuando un ESP32 despierta
3. Evaluar programaciones activas según hora actual (Europe/Madrid)
4. Enviar comandos de temperatura vía MQTT con QoS 1

## Arquitectura

### Componentes Nuevos

#### 1. `ScheduleService` (Singleton)
- Escucha eventos de despertar del ESP32 (`online: true`)
- Evalúa programaciones activas
- Publica comandos MQTT
- Mantiene estado de última temperatura aplicada

#### 2. `Schedule` Model
- CRUD de programaciones en base de datos
- Validaciones de horarios
- Consultas de programaciones activas

#### 3. API Endpoints
- `POST /api/devices/:deviceId/schedules` - Crear programación
- `GET /api/devices/:deviceId/schedules` - Listar programaciones
- `PUT /api/devices/:deviceId/schedules/:scheduleId` - Actualizar
- `DELETE /api/devices/:deviceId/schedules/:scheduleId` - Eliminar
- `POST /api/devices/:deviceId/schedules/sync` - Forzar evaluación

### Modificaciones a Componentes Existentes

#### MQTTService
- Añadir hook en `handleMessage()` para detectar `online: true`
- Notificar a `ScheduleService` cuando un dispositivo despierta
- **Nuevo:** Escuchar topic `status/mode` publicado por ESP32
  - Cuando ESP32 publica su modo actual (manual/programado)
  - Actualizar `devices.schedule_mode` en base de datos
  - Esto mantiene sincronizado el modo entre ESP32 y backend
  - **Convención MQTT:** Backend publica comandos a `command/*`, ESP32 publica estado a `status/*`

## Esquema de Base de Datos

### Nueva Tabla: `schedules`

```sql
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER NOT NULL,
  day INTEGER NOT NULL CHECK (day >= 0 AND day <= 6),
  start_hour INTEGER NOT NULL CHECK (start_hour >= 0 AND start_hour <= 23),
  start_min INTEGER NOT NULL CHECK (start_min IN (0, 15, 30, 45)),
  end_hour INTEGER NOT NULL CHECK (end_hour >= 0 AND end_hour <= 23),
  end_min INTEGER NOT NULL CHECK (end_min IN (0, 15, 30, 45)),
  temperature REAL NOT NULL CHECK (temperature >= 15 AND temperature <= 30),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_schedules_device ON schedules(device_id);
CREATE INDEX IF NOT EXISTS idx_schedules_active ON schedules(device_id, is_active);
```

**Campos:**
- `day`: 0=Lunes, 1=Martes, ..., 6=Domingo
- `start_hour`, `start_min`: Hora de inicio (Europe/Madrid)
- `end_hour`, `end_min`: Hora de fin
- `temperature`: Temperatura objetivo en °C
- `is_active`: Permite desactivar temporalmente sin borrar

### Modificación a Tabla Existente: `devices`

```sql
ALTER TABLE devices ADD COLUMN last_scheduled_temp REAL DEFAULT NULL;
ALTER TABLE devices ADD COLUMN schedule_mode VARCHAR(20) DEFAULT 'manual';
```

**Nuevos campos:**
- `last_scheduled_temp`: Última temperatura enviada por programación (para evitar duplicados)
- `schedule_mode`: 'manual' (default) o 'programado' (controla si el scheduler actúa)
  - **Default 'manual':** Protege dispositivos existentes durante migración

## Algoritmo de Evaluación

### Flujo Principal

```
1. ESP32 publica: ESP32_AABBCCDDEEFF/online = "true"
2. MQTTService detecta el mensaje
3. MQTTService.handleMessage() → ScheduleService.onDeviceWakeup(topicPrefix)
4. ScheduleService:
   a. Buscar device por topic_prefix
   b. Verificar schedule_mode == 'programado'
      - Si schedule_mode != 'programado': **salir sin procesar** (log debug, no error)
      - Esto permite que el usuario controle el dispositivo manualmente
   c. Obtener hora actual en Europe/Madrid
   d. Consultar programaciones activas para device_id y día actual
   e. Evaluar si hay programación activa en este momento
   f. Si temperatura cambió vs last_scheduled_temp:
      - Publicar comando MQTT: command/temp con QoS 1
      - Actualizar last_scheduled_temp en BD
   g. Si NO hay programación activa y last_scheduled_temp != NULL:
      - Limpiar last_scheduled_temp (set NULL)
      - NO enviar comando de temperatura (usuario retoma control manual)
```

### Evaluación de Programaciones Activas

```javascript
function evaluateActiveSchedule(schedules, currentTime) {
  const now = currentTime; // Moment en Europe/Madrid
  const currentMinutes = now.hour() * 60 + now.minute();

  let activeSchedule = null;
  let latestStartTime = -1;

  for (const schedule of schedules) {
    const startMinutes = schedule.start_hour * 60 + schedule.start_min;
    const endMinutes = schedule.end_hour * 60 + schedule.end_min;

    // Caso normal (no cruza medianoche)
    if (startMinutes <= endMinutes) {
      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        if (startMinutes > latestStartTime) {
          activeSchedule = schedule;
          latestStartTime = startMinutes;
        }
      }
    }
    // Caso especial: cruza medianoche (23:45 - 01:15)
    else {
      if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
        // Para schedules que cruzan medianoche, normalizar el startTime
        // Ejemplo: 23:45 se trata como si fuera más reciente que 08:00
        const normalizedStart = startMinutes >= 12 * 60 ? startMinutes : startMinutes + 24 * 60;
        if (normalizedStart > latestStartTime) {
          activeSchedule = schedule;
          latestStartTime = normalizedStart;
        }
      }
    }
  }

  return activeSchedule;
}
```

### Casos Especiales

**1. Múltiples programaciones solapadas:**
- Prioridad: última programación que inició
- Ejemplo: 8:00-12:00 (20°C) y 10:00-14:00 (22°C) → a las 11:00 aplicar 22°C

**2. Programación que cruza medianoche:**
- Ejemplo: 23:45-01:15 → evaluar en ambos días
- A las 00:30 → verificar programación del día anterior

**3. Sin programación activa:**
- Si `last_scheduled_temp != NULL` → limpiar estado (set NULL)
- NO enviar comando de temperatura (usuario mantiene control manual)

**4. Primera evaluación tras cambio a modo programado:**
- Evaluar inmediatamente
- Enviar temperatura si hay programación activa

## API Endpoints

### POST /api/devices/:deviceId/schedules
**Descripción:** Crear nueva programación

**Request:**
```json
{
  "day": 0,
  "start_hour": 8,
  "start_min": 0,
  "end_hour": 22,
  "end_min": 0,
  "temperature": 22.0
}
```

**Validaciones:**
- Usuario tiene acceso al dispositivo
- day: 0-6
- start_min, end_min: 0, 15, 30, 45
- start_hour, end_hour: 0-23
- temperature: 15-30
- **Horarios que cruzan medianoche:** Permitidos. Ejemplo: 23:45-01:15 es válido.
  - Detección: si `(start_hour * 60 + start_min) > (end_hour * 60 + end_min)` entonces cruza medianoche
  - **Validación de duración:**
    ```javascript
    const startMinutes = start_hour * 60 + start_min;
    const endMinutes = end_hour * 60 + end_min;
    let duration;

    if (startMinutes > endMinutes) {
      // Cruza medianoche: suma hasta medianoche + tiempo después de medianoche
      duration = (24 * 60 - startMinutes) + endMinutes;
    } else {
      // Normal: diferencia directa
      duration = endMinutes - startMinutes;
    }

    // Validar:
    if (duration < 15) return error("Duración mínima: 15 minutos");
    if (duration > 23 * 60 + 45) return error("Duración máxima: 23h 45min");
    ```
  - Ejemplo válido: 23:45-01:15 → duración = 90 minutos ✓
  - Ejemplo inválido: 23:50-23:55 → duración = 1445 minutos (>23h45m) ✗

**Response 201:**
```json
{
  "schedule": {
    "id": 1,
    "device_id": 5,
    "day": 0,
    "start_hour": 8,
    "start_min": 0,
    "end_hour": 22,
    "end_min": 0,
    "temperature": 22.0,
    "is_active": true,
    "created_at": "2026-03-21T10:00:00Z"
  }
}
```

### GET /api/devices/:deviceId/schedules
**Descripción:** Listar todas las programaciones del dispositivo

**Response 200:**
```json
{
  "schedules": [
    {
      "id": 1,
      "day": 0,
      "start_hour": 8,
      "start_min": 0,
      "end_hour": 22,
      "end_min": 0,
      "temperature": 22.0,
      "is_active": true
    }
  ]
}
```

### PUT /api/devices/:deviceId/schedules/:scheduleId
**Descripción:** Actualizar programación existente

**Request:** (campos opcionales)
```json
{
  "temperature": 23.0,
  "is_active": false
}
```

**Response 200:** Schedule actualizado

### DELETE /api/devices/:deviceId/schedules/:scheduleId
**Descripción:** Eliminar programación

**Response 204:** Sin contenido

### POST /api/devices/:deviceId/schedules/sync
**Descripción:** Forzar evaluación inmediata (útil para testing/debugging)

**Response 200:**
```json
{
  "evaluated": true,
  "active_schedule": { ... },
  "command_sent": true,
  "temperature": 22.0
}
```

## Integración con Frontend

### Modificación en app.js

**Eliminación de lógica de programación local:**
- Frontend YA NO envía programaciones via MQTT al ESP32
- Frontend solo lee/crea/edita programaciones via API REST
- Backend es responsable de aplicarlas

**Flujo en frontend:**
1. Usuario crea programación → `POST /api/devices/:id/schedules`
2. Backend guarda en BD
3. Usuario cambia a modo "Programado" → `MQTT: command/mode = "programado"`
4. Backend detecta próximo despertar → evalúa y envía temperatura

### Cambio en device.html

**Modo programado/manual:**
- Switch envía comando MQTT: `command/mode` = "manual" o "programado"
- ESP32 recibe el comando y actualiza su modo local
- ESP32 publica su modo actual de vuelta (echo): `status/mode` = "manual" o "programado"
- Backend escucha `status/mode` y actualiza `devices.schedule_mode` en BD
- Scheduler solo actúa si `schedule_mode == 'programado'`

**Nota:** El flujo es: Frontend → ESP32 → Backend. Esto asegura que el backend solo actúa cuando el ESP32 confirma el cambio de modo.

## Manejo de Errores

### Errores de Evaluación
- **Device no encontrado:** Log warning, skip evaluación
- **Programaciones inválidas en BD:** Log error, skip schedule específico
- **Zona horaria inaccesible:** Fallback a UTC, log error

### Errores de Publicación MQTT
- **MQTT desconectado:** Log error, mensaje se perderá
- **QoS 1 timeout:** MQTT library reintenta automáticamente
- **Device offline:** Broker guarda mensaje (QoS 1), entrega al despertar

### Logging

**Niveles:**
- `INFO`: "Schedule evaluated for device X, temp=22°C, command sent"
- `WARN`: "Device X not found for topic prefix Y"
- `ERROR`: "Failed to publish MQTT command for device X"
- `DEBUG`: "Evaluating schedules for device X at 10:30, found 2 active"

**Formato:**
```
[YYYY-MM-DD HH:mm:ss] [LEVEL] [ScheduleService] Message
```

## Consideraciones de Performance

### Escalabilidad
- Evaluación por device, no global
- Solo evalúa cuando device despierta (evento-driven)
- Sin polling periódico
- Índices en BD para consultas rápidas

### Memoria
- ScheduleService singleton, sin estado acumulativo
- Consultas a BD bajo demanda
- Sin caché de programaciones (BD es rápida para volumen esperado)

### Concurrencia
- Node.js single-threaded, sin problemas de race conditions
- Evaluaciones secuenciales por device
- MQTT publish es async, no bloquea

## Testing

### Casos de Prueba

**1. Programación simple activa:**
- Lunes 8:00-22:00, 22°C
- Despertar a las 10:00 → enviar 22°C
- Despertar a las 23:00 → no enviar (fuera de horario)

**2. Múltiples programaciones solapadas:**
- Lunes 8:00-14:00, 20°C
- Lunes 12:00-18:00, 24°C
- Despertar a las 13:00 → enviar 24°C (última que inició)

**3. Programación cruza medianoche:**
- Lunes 23:45-01:15, 18°C
- Despertar martes 00:30 → enviar 18°C

**4. Cambio de programación:**
- Temp anterior: 20°C, nueva: 22°C
- Despertar → enviar 22°C

**5. Sin cambio:**
- last_scheduled_temp = 22°C, actual = 22°C
- Despertar → no enviar comando (evitar duplicado)

**6. Modo manual:**
- schedule_mode = 'manual'
- Despertar → no evaluar programaciones

## Migración

### Datos Existentes
- Programaciones actualmente en ESP32 no se migran automáticamente
- Usuario debe reconfigurar programaciones via frontend
- Backend es nueva fuente de verdad

### Modo Por Defecto en Migración
- **IMPORTANTE:** Dispositivos existentes tendrán `schedule_mode = 'manual'` por defecto
- Esto asegura que el backend NO interfiere con programaciones existentes en ESP32
- Solo cuando usuario cambia explícitamente a modo "programado" en la app:
  1. Backend comienza a evaluar programaciones
  2. Si no hay programaciones en backend → no envía comandos (ESP32 mantiene control)
  3. Usuario debe crear programaciones en frontend para que backend tome control

### Compatibilidad
- ESP32 sigue aceptando comando `command/schedule` (retrocompatibilidad)
- Backend NO usa este comando, solo envía `command/temp` directamente
- Modo manual sigue funcionando igual
- **Transición gradual:** Usuario puede migrar programaciones de forma incremental

## Dependencias

### Nuevas Librerías
- `moment-timezone`: Manejo de zonas horarias
  ```bash
  npm install moment-timezone
  ```

### Configuración
- Nueva variable de entorno: `TIMEZONE=Europe/Madrid` (en `.env`)

## Próximos Pasos (Fuera de Scope)

- Notificaciones push cuando cambia temperatura por programación
- Logs de histórico de comandos enviados
- UI para visualizar programaciones en calendario
- Soporte para múltiples zonas horarias por usuario
- Optimización anticipada (enviar comando 1 minuto antes del horario)

## Resumen de Archivos a Crear/Modificar

### Crear:
1. `backend/src/services/scheduleService.js` - Servicio principal
2. `backend/src/models/Schedule.js` - Modelo de programaciones
3. `backend/src/controllers/scheduleController.js` - Endpoints API
4. `backend/src/routes/schedules.js` - Rutas API
5. `backend/database/migrations/001_add_schedules.sql` - Migración BD

### Modificar:
1. `backend/src/services/mqttService.js` - Hook para detectar despertar
2. `backend/server.js` - Inicializar ScheduleService
3. `backend/database/schema.sql` - Añadir tabla schedules
4. `frontend/js/app.js` - Eliminar envío de programaciones via MQTT
5. `backend/package.json` - Añadir moment-timezone

## Conclusión

Este diseño convierte al backend en el cerebro del sistema de programaciones, permitiendo que el ESP32 se enfoque únicamente en ejecutar comandos y ahorrar energía. La arquitectura event-driven asegura eficiencia y el uso de QoS 1 garantiza que los comandos se entreguen incluso durante deep sleep.
