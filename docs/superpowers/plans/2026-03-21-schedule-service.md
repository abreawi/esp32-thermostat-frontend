# Schedule Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement backend scheduler service that evaluates temperature schedules and sends MQTT commands when ESP32 devices wake from deep sleep.

**Architecture:** Event-driven scheduler triggered by ESP32 wakeup events. Backend stores schedules in SQLite, evaluates active schedules based on Europe/Madrid timezone, and publishes temperature commands via MQTT with QoS 1.

**Tech Stack:** Node.js, Express, SQLite (better-sqlite3), MQTT (mqtt.js), moment-timezone

---

## Scope Check

This plan covers one cohesive subsystem: the schedule service. It includes database schema, business logic, API endpoints, and MQTT integration. All changes produce a working, testable scheduler.

## File Structure

### New Files
- `backend/database/migrations/001_add_schedules.sql` - Database migration
- `backend/src/models/Schedule.js` - Schedule CRUD operations
- `backend/src/services/scheduleService.js` - Core scheduler logic
- `backend/src/controllers/scheduleController.js` - HTTP endpoint handlers
- `backend/src/routes/schedules.js` - Express routes

### Modified Files
- `backend/package.json` - Add moment-timezone dependency
- `backend/database/schema.sql` - Add schedules table and device columns
- `backend/src/services/mqttService.js` - Add wakeup detection hook
- `backend/server.js` - Initialize ScheduleService and mount routes
- `frontend/js/app.js` - Remove MQTT schedule sending logic

---

## Task 1: Install Dependencies

**Files:**
- Modify: `backend/package.json`

- [ ] **Step 1: Install moment-timezone**

```bash
cd backend
npm install moment-timezone
```

Expected: Package added to dependencies

- [ ] **Step 2: Verify installation**

```bash
npm list moment-timezone
```

Expected: Shows installed version

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add moment-timezone dependency for schedule service

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Database Schema

**Files:**
- Modify: `backend/database/schema.sql`

- [ ] **Step 1: Add schedules table to schema.sql**

Add after the user_devices table:

```sql
-- Schedules table
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

- [ ] **Step 2: Add new columns to devices table in schema.sql**

Add after the existing devices table definition (before the INDEX):

```sql
-- Note: For existing databases, use migration file
-- last_scheduled_temp REAL DEFAULT NULL,
-- schedule_mode VARCHAR(20) DEFAULT 'manual'
```

- [ ] **Step 3: Commit**

```bash
git add database/schema.sql
git commit -m "feat: add schedules table schema

Add schedules table with constraints for day, time intervals, and temperature.
Add placeholder for new device columns (applied via migration).

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Database Migration

**Files:**
- Create: `backend/database/migrations/001_add_schedules.sql`

- [ ] **Step 1: Create migrations directory**

```bash
cd backend/database
mkdir -p migrations
```

- [ ] **Step 2: Create migration file**

Create `backend/database/migrations/001_add_schedules.sql`:

```sql
-- Migration: Add schedules table and device columns for schedule service
-- Date: 2026-03-21

-- Add new columns to devices table
ALTER TABLE devices ADD COLUMN last_scheduled_temp REAL DEFAULT NULL;
ALTER TABLE devices ADD COLUMN schedule_mode VARCHAR(20) DEFAULT 'manual';

-- Create schedules table
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

- [ ] **Step 3: Run migration manually**

```bash
sqlite3 database/thermostat.db < database/migrations/001_add_schedules.sql
```

Expected: No errors, tables/columns created

- [ ] **Step 4: Verify migration**

```bash
sqlite3 database/thermostat.db "PRAGMA table_info(devices);"
sqlite3 database/thermostat.db "PRAGMA table_info(schedules);"
```

Expected: Shows new columns in devices, schedules table structure

- [ ] **Step 5: Commit**

```bash
git add database/migrations/001_add_schedules.sql
git commit -m "feat: add database migration for schedules

Migration adds schedules table and new device columns (last_scheduled_temp, schedule_mode).
Safe default schedule_mode='manual' protects existing devices.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Schedule Model

**Files:**
- Create: `backend/src/models/Schedule.js`

- [ ] **Step 1: Create Schedule model**

Create `backend/src/models/Schedule.js`:

```javascript
const db = require('../config/database');

class Schedule {
  static create({ device_id, day, start_hour, start_min, end_hour, end_min, temperature }) {
    const stmt = db.prepare(`
      INSERT INTO schedules (device_id, day, start_hour, start_min, end_hour, end_min, temperature)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(device_id, day, start_hour, start_min, end_hour, end_min, temperature);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM schedules WHERE id = ?');
    return stmt.get(id);
  }

  static findByDevice(device_id) {
    const stmt = db.prepare('SELECT * FROM schedules WHERE device_id = ? AND is_active = 1 ORDER BY day, start_hour, start_min');
    return stmt.all(device_id);
  }

  static findByDeviceAndDay(device_id, day) {
    const stmt = db.prepare('SELECT * FROM schedules WHERE device_id = ? AND day = ? AND is_active = 1 ORDER BY start_hour, start_min');
    return stmt.all(device_id, day);
  }

  static update(id, { day, start_hour, start_min, end_hour, end_min, temperature, is_active }) {
    const fields = [];
    const values = [];

    if (day !== undefined) {
      fields.push('day = ?');
      values.push(day);
    }
    if (start_hour !== undefined) {
      fields.push('start_hour = ?');
      values.push(start_hour);
    }
    if (start_min !== undefined) {
      fields.push('start_min = ?');
      values.push(start_min);
    }
    if (end_hour !== undefined) {
      fields.push('end_hour = ?');
      values.push(end_hour);
    }
    if (end_min !== undefined) {
      fields.push('end_min = ?');
      values.push(end_min);
    }
    if (temperature !== undefined) {
      fields.push('temperature = ?');
      values.push(temperature);
    }
    if (is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM schedules WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static deleteByDevice(device_id) {
    const stmt = db.prepare('DELETE FROM schedules WHERE device_id = ?');
    return stmt.run(device_id);
  }
}

module.exports = Schedule;
```

- [ ] **Step 2: Test Schedule model manually**

```bash
cd backend
node -e "
const Schedule = require('./src/models/Schedule');
const Device = require('./src/models/Device');

// Get first device for testing
const devices = Device.list();
if (devices.length === 0) {
  console.log('No devices found - create one first');
  process.exit(1);
}

const device = devices[0];
console.log('Testing with device:', device.id);

// Create schedule
const sched = Schedule.create({
  device_id: device.id,
  day: 0,
  start_hour: 8,
  start_min: 0,
  end_hour: 22,
  end_min: 0,
  temperature: 22.0
});

console.log('Created:', sched);

// Find by device
const schedules = Schedule.findByDevice(device.id);
console.log('Found', schedules.length, 'schedules');

// Update
const updated = Schedule.update(sched.id, { temperature: 23.0 });
console.log('Updated:', updated);

// Delete
const deleted = Schedule.delete(sched.id);
console.log('Deleted:', deleted);
"
```

Expected: Creates, finds, updates, and deletes schedule successfully

- [ ] **Step 3: Commit**

```bash
git add src/models/Schedule.js
git commit -m "feat: add Schedule model with CRUD operations

Model handles schedule creation, retrieval by device/day, updates, and deletion.
Includes filtering by is_active flag.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Schedule Service Core Logic

**Files:**
- Create: `backend/src/services/scheduleService.js`

- [ ] **Step 1: Create ScheduleService skeleton**

Create `backend/src/services/scheduleService.js`:

```javascript
const moment = require('moment-timezone');
const Device = require('../models/Device');
const Schedule = require('../models/Schedule');
const mqttService = require('./mqttService');
const db = require('../config/database');

const TIMEZONE = process.env.TIMEZONE || 'Europe/Madrid';

class ScheduleService {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    console.log(`✓ ScheduleService initialized (timezone: ${TIMEZONE})`);
    this.initialized = true;
  }

  // Called when ESP32 wakes up and publishes online: true
  async onDeviceWakeup(topicPrefix) {
    try {
      console.log(`[ScheduleService] Device wakeup detected: ${topicPrefix}`);

      // Find device by topic_prefix
      const stmt = db.prepare('SELECT * FROM devices WHERE topic_prefix = ?');
      const device = stmt.get(topicPrefix);

      if (!device) {
        console.warn(`[ScheduleService] Device not found: ${topicPrefix}`);
        return;
      }

      // Check if device is in programado mode
      if (device.schedule_mode !== 'programado') {
        console.debug(`[ScheduleService] Device ${device.id} is in ${device.schedule_mode} mode, skipping evaluation`);
        return;
      }

      // Evaluate schedules
      await this.evaluateAndApplySchedule(device);

    } catch (error) {
      console.error(`[ScheduleService] Error processing wakeup for ${topicPrefix}:`, error);
    }
  }

  async evaluateAndApplySchedule(device) {
    // Get current time in configured timezone
    const now = moment.tz(TIMEZONE);
    const currentDay = (now.day() + 6) % 7; // Convert Sunday=0 to Monday=0
    const currentMinutes = now.hour() * 60 + now.minute();

    console.log(`[ScheduleService] Evaluating device ${device.id} at ${now.format('YYYY-MM-DD HH:mm')} (day=${currentDay})`);

    // Get active schedules for today
    const schedules = Schedule.findByDeviceAndDay(device.id, currentDay);

    if (schedules.length === 0) {
      console.debug(`[ScheduleService] No schedules for device ${device.id} on day ${currentDay}`);

      // Clear last_scheduled_temp if set
      if (device.last_scheduled_temp !== null) {
        this.clearScheduledTemp(device.id);
      }
      return;
    }

    // Find active schedule
    const activeSchedule = this.findActiveSchedule(schedules, currentMinutes);

    if (activeSchedule) {
      console.log(`[ScheduleService] Active schedule found: ${activeSchedule.start_hour}:${activeSchedule.start_min}-${activeSchedule.end_hour}:${activeSchedule.end_min} = ${activeSchedule.temperature}°C`);

      // Check if temperature changed
      if (device.last_scheduled_temp !== activeSchedule.temperature) {
        await this.sendTemperatureCommand(device, activeSchedule.temperature);
      } else {
        console.debug(`[ScheduleService] Temperature unchanged (${activeSchedule.temperature}°C), no command sent`);
      }
    } else {
      console.debug(`[ScheduleService] No active schedule at this time`);

      // Clear last_scheduled_temp if set
      if (device.last_scheduled_temp !== null) {
        this.clearScheduledTemp(device.id);
      }
    }
  }

  findActiveSchedule(schedules, currentMinutes) {
    let activeSchedule = null;
    let latestStartTime = -1;

    for (const schedule of schedules) {
      const startMinutes = schedule.start_hour * 60 + schedule.start_min;
      const endMinutes = schedule.end_hour * 60 + schedule.end_min;

      // Normal case: start < end (does not cross midnight)
      if (startMinutes <= endMinutes) {
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          if (startMinutes > latestStartTime) {
            activeSchedule = schedule;
            latestStartTime = startMinutes;
          }
        }
      }
      // Special case: crosses midnight (start > end)
      else {
        if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
          // Normalize start time for comparison
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

  async sendTemperatureCommand(device, temperature) {
    try {
      console.log(`[ScheduleService] Sending temperature command: ${device.topic_prefix} -> ${temperature}°C`);

      // Publish MQTT command with QoS 1
      await mqttService.publish(device, 'command/temp', temperature.toFixed(1));

      // Update last_scheduled_temp in database
      const stmt = db.prepare('UPDATE devices SET last_scheduled_temp = ? WHERE id = ?');
      stmt.run(temperature, device.id);

      console.log(`[ScheduleService] ✓ Command sent and state updated`);

    } catch (error) {
      console.error(`[ScheduleService] Failed to send temperature command:`, error);
      throw error;
    }
  }

  clearScheduledTemp(device_id) {
    const stmt = db.prepare('UPDATE devices SET last_scheduled_temp = NULL WHERE id = ?');
    stmt.run(device_id);
    console.debug(`[ScheduleService] Cleared last_scheduled_temp for device ${device_id}`);
  }

  // Force evaluation (for testing/debugging)
  async forceEvaluation(device_id) {
    const device = Device.findById(device_id);
    if (!device) {
      throw new Error('Device not found');
    }

    await this.evaluateAndApplySchedule(device);

    return {
      device_id: device.id,
      schedule_mode: device.schedule_mode,
      last_scheduled_temp: device.last_scheduled_temp,
      evaluated_at: new Date().toISOString()
    };
  }
}

// Singleton instance
const scheduleService = new ScheduleService();

module.exports = scheduleService;
```

- [ ] **Step 2: Test schedule evaluation logic**

Create a test script `backend/test_schedule_service.js`:

```javascript
const moment = require('moment-timezone');
const scheduleService = require('./src/services/scheduleService');

// Test findActiveSchedule
const testSchedules = [
  { id: 1, start_hour: 8, start_min: 0, end_hour: 12, end_min: 0, temperature: 20 },
  { id: 2, start_hour: 12, start_min: 0, end_hour: 18, end_min: 0, temperature: 22 },
  { id: 3, start_hour: 18, start_min: 0, end_hour: 23, end_min: 0, temperature: 21 },
  { id: 4, start_hour: 23, start_min: 45, end_hour: 1, end_min: 15, temperature: 18 } // Crosses midnight
];

console.log('Testing findActiveSchedule...\n');

// Test cases
const testCases = [
  { time: '07:30', expected: null },
  { time: '08:00', expected: 1 },
  { time: '11:59', expected: 1 },
  { time: '12:00', expected: 2 },
  { time: '15:00', expected: 2 },
  { time: '18:00', expected: 3 },
  { time: '22:00', expected: 3 },
  { time: '23:45', expected: 4 }, // Midnight crossing
  { time: '00:30', expected: 4 }, // After midnight
  { time: '01:00', expected: 4 },
  { time: '01:15', expected: null },
  { time: '02:00', expected: null }
];

testCases.forEach(test => {
  const [hour, min] = test.time.split(':').map(Number);
  const currentMinutes = hour * 60 + min;

  const active = scheduleService.findActiveSchedule(testSchedules, currentMinutes);
  const activeId = active ? active.id : null;

  const status = activeId === test.expected ? '✓' : '✗';
  console.log(`${status} ${test.time}: expected schedule ${test.expected}, got ${activeId}`);

  if (activeId !== test.expected) {
    console.log('  Active schedule:', active);
  }
});
```

Run test:

```bash
cd backend
node test_schedule_service.js
```

Expected: All tests pass (✓)

- [ ] **Step 3: Commit**

```bash
git add src/services/scheduleService.js test_schedule_service.js
git commit -m "feat: implement ScheduleService core logic

- Event-driven evaluation on device wakeup
- Handles normal and midnight-crossing schedules
- Priority resolution for overlapping schedules
- MQTT command publishing with QoS 1
- State management (last_scheduled_temp)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Integrate with MQTT Service

**Files:**
- Modify: `backend/src/services/mqttService.js`

- [ ] **Step 1: Add hook to detect device wakeup**

In `mqttService.js`, modify the `handleMessage` method to detect `online: true`:

Find this section (around line 131-134):

```javascript
    // Handle online status
    if (subtopic === 'online') {
      this.updateDeviceOnlineStatus(topicPrefix, message === 'true' || message === '1');
    }
```

Replace with:

```javascript
    // Handle online status
    if (subtopic === 'online') {
      const isOnline = message === 'true' || message === '1';
      this.updateDeviceOnlineStatus(topicPrefix, isOnline);

      // Notify schedule service when device wakes up
      if (isOnline) {
        const scheduleService = require('./scheduleService');
        scheduleService.onDeviceWakeup(topicPrefix);
      }
    }
```

- [ ] **Step 2: Add hook to sync schedule_mode**

Add after the online status handling:

```javascript
    // Handle mode status (sync with database)
    if (subtopic === 'status/mode') {
      this.updateDeviceScheduleMode(topicPrefix, message);
    }
```

Then add the new method at the end of the class:

```javascript
  updateDeviceScheduleMode(topicPrefix, mode) {
    try {
      const db = require('../config/database');
      const stmt = db.prepare('UPDATE devices SET schedule_mode = ? WHERE topic_prefix = ?');
      const result = stmt.run(mode, topicPrefix);

      if (result.changes > 0) {
        console.log(`✓ Device ${topicPrefix} schedule_mode updated to: ${mode}`);
      }
    } catch (error) {
      console.error('Error updating device schedule_mode:', error);
    }
  }
```

- [ ] **Step 3: Test MQTT integration**

Start the server and simulate ESP32 wakeup by publishing to MQTT:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Publish test message (replace with actual device topic_prefix)
mosquitto_pub -h broker.hivemq.com -t "ESP32_AABBCCDDEEFF/online" -m "true"
```

Expected: Console shows "[ScheduleService] Device wakeup detected"

- [ ] **Step 4: Commit**

```bash
git add src/services/mqttService.js
git commit -m "feat: integrate ScheduleService with MQTT wakeup events

- Detect device wakeup (online: true) and trigger schedule evaluation
- Sync schedule_mode from ESP32 status/mode topic
- Maintains separation of concerns (MQTT routing vs schedule logic)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Schedule API Controller

**Files:**
- Create: `backend/src/controllers/scheduleController.js`

- [ ] **Step 1: Create scheduleController.js**

Create `backend/src/controllers/scheduleController.js`:

```javascript
const Schedule = require('../models/Schedule');
const Device = require('../models/Device');
const UserDevice = require('../models/UserDevice');
const scheduleService = require('../services/scheduleService');

// Validation helper
function validateSchedule({ day, start_hour, start_min, end_hour, end_min, temperature }) {
  const errors = [];

  if (day < 0 || day > 6) {
    errors.push('day must be 0-6');
  }

  if (start_hour < 0 || start_hour > 23) {
    errors.push('start_hour must be 0-23');
  }

  if (end_hour < 0 || end_hour > 23) {
    errors.push('end_hour must be 0-23');
  }

  if (![0, 15, 30, 45].includes(start_min)) {
    errors.push('start_min must be 0, 15, 30, or 45');
  }

  if (![0, 15, 30, 45].includes(end_min)) {
    errors.push('end_min must be 0, 15, 30, or 45');
  }

  if (temperature < 15 || temperature > 30) {
    errors.push('temperature must be 15-30');
  }

  // Validate duration
  const startMinutes = start_hour * 60 + start_min;
  const endMinutes = end_hour * 60 + end_min;
  let duration;

  if (startMinutes > endMinutes) {
    // Crosses midnight
    duration = (24 * 60 - startMinutes) + endMinutes;
  } else {
    duration = endMinutes - startMinutes;
  }

  if (duration < 15) {
    errors.push('schedule duration must be at least 15 minutes');
  }

  if (duration > 23 * 60 + 45) {
    errors.push('schedule duration must not exceed 23 hours 45 minutes');
  }

  return errors;
}

// Check if user has access to device
function checkDeviceAccess(userId, deviceId) {
  const userDevice = UserDevice.findByUserAndDevice(userId, deviceId);
  return userDevice !== undefined;
}

exports.createSchedule = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { day, start_hour, start_min, end_hour, end_min, temperature } = req.body;

    // Check device access
    if (!checkDeviceAccess(req.userId, deviceId)) {
      return res.status(403).json({ error: 'Access denied to this device' });
    }

    // Validate input
    const errors = validateSchedule({ day, start_hour, start_min, end_hour, end_min, temperature });
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Create schedule
    const schedule = Schedule.create({
      device_id: deviceId,
      day,
      start_hour,
      start_min,
      end_hour,
      end_min,
      temperature
    });

    res.status(201).json({ schedule });

  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

exports.listSchedules = async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Check device access
    if (!checkDeviceAccess(req.userId, deviceId)) {
      return res.status(403).json({ error: 'Access denied to this device' });
    }

    const schedules = Schedule.findByDevice(deviceId);

    res.json({ schedules });

  } catch (error) {
    console.error('Error listing schedules:', error);
    res.status(500).json({ error: 'Failed to list schedules' });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { deviceId, scheduleId } = req.params;
    const updates = req.body;

    // Check device access
    if (!checkDeviceAccess(req.userId, deviceId)) {
      return res.status(403).json({ error: 'Access denied to this device' });
    }

    // Verify schedule belongs to device
    const existingSchedule = Schedule.findById(scheduleId);
    if (!existingSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    if (existingSchedule.device_id !== parseInt(deviceId)) {
      return res.status(403).json({ error: 'Schedule does not belong to this device' });
    }

    // Validate updates if schedule time/temp fields are being changed
    if (updates.day !== undefined || updates.start_hour !== undefined ||
        updates.start_min !== undefined || updates.end_hour !== undefined ||
        updates.end_min !== undefined || updates.temperature !== undefined) {

      const merged = { ...existingSchedule, ...updates };
      const errors = validateSchedule(merged);

      if (errors.length > 0) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
    }

    // Update schedule
    const schedule = Schedule.update(scheduleId, updates);

    res.json({ schedule });

  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { deviceId, scheduleId } = req.params;

    // Check device access
    if (!checkDeviceAccess(req.userId, deviceId)) {
      return res.status(403).json({ error: 'Access denied to this device' });
    }

    // Verify schedule belongs to device
    const existingSchedule = Schedule.findById(scheduleId);
    if (!existingSchedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    if (existingSchedule.device_id !== parseInt(deviceId)) {
      return res.status(403).json({ error: 'Schedule does not belong to this device' });
    }

    // Delete schedule
    const deleted = Schedule.delete(scheduleId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Schedule not found' });
    }

  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

exports.syncSchedules = async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Check device access
    if (!checkDeviceAccess(req.userId, deviceId)) {
      return res.status(403).json({ error: 'Access denied to this device' });
    }

    // Force evaluation
    const result = await scheduleService.forceEvaluation(deviceId);

    res.json(result);

  } catch (error) {
    console.error('Error syncing schedules:', error);
    res.status(500).json({ error: error.message || 'Failed to sync schedules' });
  }
};

module.exports = exports;
```

- [ ] **Step 2: Test validation logic**

Create test script `backend/test_schedule_validation.js`:

```javascript
const { validateSchedule } = require('./src/controllers/scheduleController');

// Note: We need to extract validateSchedule or test via API
// For now, we'll test via curl after routes are set up

console.log('Validation tests will be performed via API endpoints');
```

- [ ] **Step 3: Commit**

```bash
git add src/controllers/scheduleController.js
git commit -m "feat: add Schedule API controller with validation

- CRUD endpoints for schedules
- Duration validation (15min - 23h45m)
- Midnight-crossing schedule support
- Device access authorization
- Force sync endpoint for debugging

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Schedule API Routes

**Files:**
- Create: `backend/src/routes/schedules.js`

- [ ] **Step 1: Create schedules routes**

Create `backend/src/routes/schedules.js`:

```javascript
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Schedule CRUD
router.post('/devices/:deviceId/schedules', scheduleController.createSchedule);
router.get('/devices/:deviceId/schedules', scheduleController.listSchedules);
router.put('/devices/:deviceId/schedules/:scheduleId', scheduleController.updateSchedule);
router.delete('/devices/:deviceId/schedules/:scheduleId', scheduleController.deleteSchedule);

// Force sync (debugging)
router.post('/devices/:deviceId/schedules/sync', scheduleController.syncSchedules);

module.exports = router;
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/schedules.js
git commit -m "feat: add schedule API routes

All endpoints require authentication and device access verification.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Initialize Schedule Service in Server

**Files:**
- Modify: `backend/server.js`

- [ ] **Step 1: Import and initialize ScheduleService**

In `server.js`, add after other require statements (around line 13):

```javascript
const scheduleRoutes = require('./src/routes/schedules');
const scheduleService = require('./src/services/scheduleService');
```

- [ ] **Step 2: Mount schedule routes**

Add after existing route mounts (around line 67):

```javascript
app.use('/api', scheduleRoutes);
```

- [ ] **Step 3: Initialize ScheduleService**

Add after `mqttService.connect()` (around line 153):

```javascript
// Initialize schedule service
scheduleService.initialize();
```

- [ ] **Step 4: Test server startup**

```bash
cd backend
npm run dev
```

Expected: Server starts, shows "✓ ScheduleService initialized (timezone: Europe/Madrid)"

- [ ] **Step 5: Commit**

```bash
git add src/routes/schedules.js server.js
git commit -m "feat: integrate ScheduleService with server

- Mount schedule API routes
- Initialize service on startup
- Service ready to process device wakeup events

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Test Schedule API Endpoints

**Files:**
- None (testing only)

- [ ] **Step 1: Get authentication token**

```bash
# Register or login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Save token for next steps
TOKEN="<token_from_response>"
```

- [ ] **Step 2: Get device ID**

```bash
curl http://localhost:3000/api/devices \
  -H "Authorization: Bearer $TOKEN"

# Note the device ID
DEVICE_ID=<your_device_id>
```

- [ ] **Step 3: Create schedule**

```bash
curl -X POST http://localhost:3000/api/devices/$DEVICE_ID/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": 0,
    "start_hour": 8,
    "start_min": 0,
    "end_hour": 22,
    "end_min": 0,
    "temperature": 22.0
  }'
```

Expected: 201 Created, returns schedule object

- [ ] **Step 4: List schedules**

```bash
curl http://localhost:3000/api/devices/$DEVICE_ID/schedules \
  -H "Authorization: Bearer $TOKEN"
```

Expected: 200 OK, returns array with created schedule

- [ ] **Step 5: Test validation (invalid duration)**

```bash
curl -X POST http://localhost:3000/api/devices/$DEVICE_ID/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": 0,
    "start_hour": 8,
    "start_min": 0,
    "end_hour": 8,
    "end_min": 0,
    "temperature": 22.0
  }'
```

Expected: 400 Bad Request, "schedule duration must be at least 15 minutes"

- [ ] **Step 6: Test midnight-crossing schedule**

```bash
curl -X POST http://localhost:3000/api/devices/$DEVICE_ID/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": 0,
    "start_hour": 23,
    "start_min": 45,
    "end_hour": 1,
    "end_min": 15,
    "temperature": 18.0
  }'
```

Expected: 201 Created, accepts midnight-crossing schedule

- [ ] **Step 7: Update schedule**

```bash
# Get schedule ID from list
SCHEDULE_ID=<schedule_id>

curl -X PUT http://localhost:3000/api/devices/$DEVICE_ID/schedules/$SCHEDULE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"temperature": 23.0}'
```

Expected: 200 OK, returns updated schedule

- [ ] **Step 8: Delete schedule**

```bash
curl -X DELETE http://localhost:3000/api/devices/$DEVICE_ID/schedules/$SCHEDULE_ID \
  -H "Authorization: Bearer $TOKEN"
```

Expected: 204 No Content

- [ ] **Step 9: Test force sync**

```bash
curl -X POST http://localhost:3000/api/devices/$DEVICE_ID/schedules/sync \
  -H "Authorization: Bearer $TOKEN"
```

Expected: 200 OK, returns evaluation result

---

## Task 11: Update Device Model for Schedule Mode

**Files:**
- Modify: `backend/src/models/Device.js`

- [ ] **Step 1: Add method to update schedule_mode**

Add new method to Device class:

```javascript
  static updateScheduleMode(id, mode) {
    const stmt = db.prepare(`
      UPDATE devices
      SET schedule_mode = ?
      WHERE id = ?
    `);
    stmt.run(mode, id);
  }
```

- [ ] **Step 2: Update findById to include new columns**

The existing `findById` method should already return new columns (SQLite returns all columns).
Verify by testing:

```bash
node -e "
const Device = require('./src/models/Device');
const devices = Device.list();
if (devices.length > 0) {
  console.log('Device columns:', Object.keys(devices[0]));
  console.log('Has schedule_mode:', 'schedule_mode' in devices[0]);
  console.log('Has last_scheduled_temp:', 'last_scheduled_temp' in devices[0]);
}
"
```

Expected: Shows schedule_mode and last_scheduled_temp columns

- [ ] **Step 3: Commit**

```bash
git add src/models/Device.js
git commit -m "feat: add schedule_mode support to Device model

Add method to update schedule mode. Existing methods already return new columns.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Frontend - Remove MQTT Schedule Sending

**Files:**
- Modify: `frontend/js/app.js`

- [ ] **Step 1: Remove setSchedules function MQTT publish**

In `app.js`, find the `setSchedules` function (around line 345):

```javascript
function setSchedules() {
  const payload = JSON.stringify(state.schedules.map((sched) => ({
    day: sched.day,
    startHour: sched.startHour,
    startMin: sched.startMin,
    endHour: sched.endHour,
    endMin: sched.endMin,
    temp: sched.temp,
  })));
  publish(TOPICS.cmdSchedule, payload);
}
```

Replace with a comment:

```javascript
function setSchedules() {
  // NOTE: Schedule storage is now handled by backend API, not MQTT.
  // Schedules are saved via POST /api/devices/:id/schedules
  // This function is deprecated and should be removed when frontend is updated.
  console.warn('setSchedules: This function is deprecated. Use backend API instead.');
}
```

- [ ] **Step 2: Add comment to schedule save button handler**

Find the save button handler (around line 541):

```javascript
els.saveSchedulesBtn.addEventListener("click", () => {
  if (!state.schedules.length) return;
  setSchedules();
  els.saveSchedulesBtn.textContent = "Guardado";
  setTimeout(() => {
    els.saveSchedulesBtn.textContent = "Guardar Todo";
  }, 1500);
});
```

Add comment above:

```javascript
// TODO: Update this to use backend API instead of MQTT
// Should call: POST /api/devices/:deviceId/schedules for each schedule
els.saveSchedulesBtn.addEventListener("click", () => {
```

- [ ] **Step 3: Commit**

```bash
cd ../frontend
git add js/app.js
git commit -m "chore: deprecate MQTT schedule sending in frontend

Schedules are now managed via backend API. Frontend will be updated
to use REST endpoints instead of MQTT command/schedule topic.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Integration Testing

**Files:**
- None (testing)

- [ ] **Step 1: Set device to programado mode via MQTT**

```bash
# Simulate ESP32 publishing mode change
mosquitto_pub -h broker.hivemq.com \
  -t "ESP32_AABBCCDDEEFF/status/mode" \
  -m "programado"
```

Check backend logs: Should show "Device ... schedule_mode updated to: programado"

- [ ] **Step 2: Create test schedule via API**

```bash
# Create schedule for current time +5 minutes to current time +10 minutes
CURRENT_HOUR=$(date +%H)
CURRENT_MIN=$(date +%M)

# Round to next 15-minute interval
START_MIN=$((($CURRENT_MIN / 15 + 1) * 15))
if [ $START_MIN -ge 60 ]; then
  START_MIN=0
  START_HOUR=$(($CURRENT_HOUR + 1))
else
  START_HOUR=$CURRENT_HOUR
fi

END_MIN=$(($START_MIN + 15))
END_HOUR=$START_HOUR
if [ $END_MIN -ge 60 ]; then
  END_MIN=$(($END_MIN - 60))
  END_HOUR=$(($END_HOUR + 1))
fi

curl -X POST http://localhost:3000/api/devices/$DEVICE_ID/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"day\": $(($(date +%u) - 1)),
    \"start_hour\": $START_HOUR,
    \"start_min\": $START_MIN,
    \"end_hour\": $END_HOUR,
    \"end_min\": $END_MIN,
    \"temperature\": 24.0
  }"
```

- [ ] **Step 3: Simulate ESP32 wakeup**

```bash
# Wait until schedule should be active, then publish wakeup
sleep 300  # Wait 5 minutes

mosquitto_pub -h broker.hivemq.com \
  -t "ESP32_AABBCCDDEEFF/online" \
  -m "true"
```

Expected in backend logs:
- "Device wakeup detected"
- "Active schedule found"
- "Sending temperature command: 24.0°C"
- "Command sent and state updated"

- [ ] **Step 4: Verify MQTT command was published**

```bash
# Subscribe to device commands
mosquitto_sub -h broker.hivemq.com \
  -t "ESP32_AABBCCDDEEFF/command/temp" \
  -v
```

Expected: Receives "24.0" when schedule is triggered

- [ ] **Step 5: Test with multiple overlapping schedules**

Create two overlapping schedules, verify that the one that started most recently takes priority.

- [ ] **Step 6: Test midnight-crossing schedule**

Create schedule like 23:45-01:15, wait for it to activate, trigger wakeup, verify command sent.

---

## Task 14: Documentation and Cleanup

**Files:**
- Create: `backend/docs/SCHEDULE_SERVICE.md`

- [ ] **Step 1: Create documentation**

Create `backend/docs/SCHEDULE_SERVICE.md`:

```markdown
# Schedule Service Documentation

## Overview

The Schedule Service evaluates temperature schedules and automatically sends MQTT commands to ESP32 devices when they wake from deep sleep.

## Architecture

- **Event-Driven**: Triggered by ESP32 wakeup (`online: true`)
- **Timezone**: Europe/Madrid (configurable via `TIMEZONE` env var)
- **Storage**: SQLite database (schedules table)
- **Communication**: MQTT with QoS 1 (guaranteed delivery)

## API Endpoints

### Create Schedule
```
POST /api/devices/:deviceId/schedules
```

Body:
```json
{
  "day": 0,              // 0=Monday, 6=Sunday
  "start_hour": 8,       // 0-23
  "start_min": 0,        // 0, 15, 30, 45
  "end_hour": 22,
  "end_min": 0,
  "temperature": 22.0    // 15-30°C
}
```

### List Schedules
```
GET /api/devices/:deviceId/schedules
```

### Update Schedule
```
PUT /api/devices/:deviceId/schedules/:scheduleId
```

### Delete Schedule
```
DELETE /api/devices/:deviceId/schedules/:scheduleId
```

### Force Sync (Debug)
```
POST /api/devices/:deviceId/schedules/sync
```

## How It Works

1. ESP32 wakes from deep sleep (every 3 minutes)
2. ESP32 publishes `{topic_prefix}/online = "true"`
3. MQTTService detects message, calls `scheduleService.onDeviceWakeup()`
4. ScheduleService:
   - Checks if device is in `programado` mode
   - Gets current time in Europe/Madrid timezone
   - Queries active schedules for device and current day
   - Evaluates if any schedule is active now
   - If temperature changed: publishes `command/temp` with QoS 1
   - Updates `last_scheduled_temp` in database
5. ESP32 receives command when it wakes up (QoS 1 guarantees delivery)

## Schedule Priority

When multiple schedules overlap, the **most recently started** schedule takes priority.

Example:
- Schedule A: 8:00-14:00, 20°C
- Schedule B: 12:00-18:00, 24°C
- At 13:00: Schedule B wins (started at 12:00, more recent than 8:00)

## Midnight-Crossing Schedules

Schedules can cross midnight:
- Example: 23:45-01:15 (valid)
- Duration validated: 15 minutes to 23 hours 45 minutes

## Mode Synchronization

Devices have a `schedule_mode` field:
- `manual`: Scheduler does not evaluate (user controls temperature)
- `programado`: Scheduler evaluates and sends commands

Mode is synced from ESP32:
- ESP32 publishes `{topic_prefix}/status/mode = "manual" | "programado"`
- Backend updates database

## State Management

- `last_scheduled_temp`: Tracks last temperature sent by scheduler
- Prevents duplicate commands when temperature hasn't changed
- Cleared when no schedule is active

## Configuration

Environment variables:
```
TIMEZONE=Europe/Madrid
```

## Testing

Run manual tests:
```bash
# Test schedule evaluation logic
node test_schedule_service.js

# Test API endpoints
curl http://localhost:3000/api/devices/1/schedules \
  -H "Authorization: Bearer $TOKEN"

# Simulate ESP32 wakeup
mosquitto_pub -h broker.hivemq.com \
  -t "ESP32_AABBCCDDEEFF/online" -m "true"
```

## Troubleshooting

**Schedules not triggering:**
- Check device `schedule_mode` is `programado`
- Verify schedule `is_active = 1`
- Check timezone matches device location
- Look for "[ScheduleService]" logs in console

**Commands not reaching ESP32:**
- Verify MQTT broker connection
- Check QoS 1 is enabled
- Ensure ESP32 subscribes to `command/temp`

**Overlapping schedules behaving unexpectedly:**
- Most recently started schedule wins
- Check schedule times don't have gaps
```

- [ ] **Step 2: Remove test files**

```bash
cd backend
rm test_schedule_service.js test_schedule_validation.js
```

- [ ] **Step 3: Commit**

```bash
git add docs/SCHEDULE_SERVICE.md
git add -u  # Stage deletions
git commit -m "docs: add Schedule Service documentation

Comprehensive guide covering architecture, API, behavior, and troubleshooting.
Clean up test scripts.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 15: Final Verification

**Files:**
- None (verification)

- [ ] **Step 1: Run full server**

```bash
cd backend
npm run dev
```

Expected: No errors, shows:
- "✓ Server running on port 3000"
- "✓ MQTT connected"
- "✓ ScheduleService initialized (timezone: Europe/Madrid)"

- [ ] **Step 2: Verify database schema**

```bash
sqlite3 database/thermostat.db ".schema schedules"
sqlite3 database/thermostat.db "SELECT sql FROM sqlite_master WHERE name='devices';"
```

Expected: Shows schedules table and new device columns

- [ ] **Step 3: Test full flow**

1. Create schedule via API
2. Set device to programado mode
3. Simulate wakeup via MQTT
4. Verify command published to MQTT
5. Check database state updated

- [ ] **Step 4: Review all commits**

```bash
git log --oneline --graph
```

Expected: Clean commit history with descriptive messages

- [ ] **Step 5: Push to repository**

```bash
git push origin master
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-21-schedule-service.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration. Use @superpowers:subagent-driven-development

**2. Inline Execution** - Execute tasks in this session using @superpowers:executing-plans, batch execution with checkpoints

**Which approach would you like?**
