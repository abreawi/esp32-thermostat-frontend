/* global mqtt */

// Check authentication
const token = localStorage.getItem('token');
const deviceId = localStorage.getItem('selectedDeviceId');

if (!token || !deviceId) {
  window.location.href = 'index.html';
}

// State
const state = {
  connected: false,
  connecting: false,
  currentTemp: 22.0,
  targetTemp: 22.0,
  isManualMode: true,
  relayState: false,
  schedules: [],
  device: null
};

let TOPIC_PREFIX = "";
let TOPICS = {};

let client = null;
const BROKER_URLS = [
  "wss://test.mosquitto.org:8081",
  "wss://broker.hivemq.com:8884/mqtt",
];
let activeBrokerIndex = 0;

// DOM elements
const els = {
  deviceTitle: document.getElementById("deviceTitle"),
  backBtn: document.getElementById("backBtn"),
  statusDot: document.getElementById("statusDot"),
  statusText: document.getElementById("statusText"),
  reconnectBtn: document.getElementById("reconnectBtn"),
  retryBtn: document.getElementById("retryBtn"),
  connectIcon: document.getElementById("connectIcon"),
  connectTitle: document.getElementById("connectTitle"),
  connectMessage: document.getElementById("connectMessage"),
  brokerLabel: document.getElementById("brokerLabel"),
  connectSpinner: document.getElementById("connectSpinner"),
  tabs: document.getElementById("tabs"),
  controlPanel: document.getElementById("controlPanel"),
  schedulePanel: document.getElementById("schedulePanel"),
  connectionPanel: document.getElementById("connectionPanel"),
  currentTemp: document.getElementById("currentTemp"),
  targetTempLabel: document.getElementById("targetTempLabel"),
  targetSlider: document.getElementById("targetSlider"),
  targetTooltip: document.getElementById("targetTooltip"),
  relayCard: document.getElementById("relayCard"),
  relayIcon: document.getElementById("relayIcon"),
  relayState: document.getElementById("relayState"),
  modeLabel: document.getElementById("modeLabel"),
  modeSwitch: document.getElementById("modeSwitch"),
  modeInfo: document.getElementById("modeInfo"),
  scheduleList: document.getElementById("scheduleList"),
  emptySchedules: document.getElementById("emptySchedules"),
  addScheduleBtn: document.getElementById("addScheduleBtn"),
  saveSchedulesBtn: document.getElementById("saveSchedulesBtn"),
  timeModal: document.getElementById("timeModal"),
  hourPicker: document.getElementById("hourPicker"),
  minutePicker: document.getElementById("minutePicker"),
  cancelTimeBtn: document.getElementById("cancelTimeBtn"),
  confirmTimeBtn: document.getElementById("confirmTimeBtn"),
};

const dayNames = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Load device info from backend
async function loadDeviceInfo() {
  try {
    const data = await api.getDevice(deviceId);
    state.device = data.device;

    // Set topic prefix
    TOPIC_PREFIX = state.device.topic_prefix;

    // Generate topics
    TOPICS = {
      cmdTemp: `${TOPIC_PREFIX}/command/temp`,
      cmdMode: `${TOPIC_PREFIX}/command/mode`,
      cmdSchedule: `${TOPIC_PREFIX}/command/schedule`,
      cmdRelay: `${TOPIC_PREFIX}/command/relay`,
      statusTempCurrent: `${TOPIC_PREFIX}/status/temp_current`,
      statusTempTarget: `${TOPIC_PREFIX}/status/temp_target`,
      statusMode: `${TOPIC_PREFIX}/status/mode`,
      statusRelay: `${TOPIC_PREFIX}/status/relay`,
      statusConfig: `${TOPIC_PREFIX}/status/config`,
      requestConfig: `${TOPIC_PREFIX}/request/config`,
    };

    // Update page title
    els.deviceTitle.textContent = state.device.device_alias || 'Termostato ESP32';

    // Connect to MQTT
    connect();
  } catch (error) {
    console.error('Error loading device:', error);
    alert('Error al cargar dispositivo: ' + error.message);
    window.location.href = 'dashboard.html';
  }
}

// Connection state
function setConnectionState(connected, message) {
  state.connected = connected;
  state.connecting = !connected && message === "Conectando...";
  els.statusDot.style.background = connected ? "#2ecc71" : "#d95151";
  els.statusText.textContent = message;
  els.connectTitle.textContent = connected ? "Conectado" : state.connecting ? "Conectando..." : "Sin conexión";
  els.connectMessage.textContent = state.connecting
    ? "Conectando con el ESP32"
    : "No se pudo conectar al termostato ESP32";
  els.connectIcon.textContent = state.connecting ? "⟳" : "☁";
  els.connectIcon.style.color = state.connecting ? "#ff6a1a" : "#9a8f84";
  els.connectSpinner.style.display = state.connecting ? "block" : "none";
  els.retryBtn.style.display = state.connecting ? "none" : "inline-flex";
  els.reconnectBtn.style.display = connected ? "inline-flex" : "none";

  if (connected) {
    els.tabs.style.display = "flex";
    els.controlPanel.classList.add("active");
    els.schedulePanel.classList.remove("active");
    els.connectionPanel.classList.remove("active");
  } else {
    els.tabs.style.display = "none";
    els.controlPanel.classList.remove("active");
    els.schedulePanel.classList.remove("active");
    els.connectionPanel.classList.add("active");
  }
}

function formatTemp(value) {
  return value.toFixed(1);
}

function temperatureColor(temp) {
  if (temp < 18) return "#2b6cb0";
  if (temp < 22) return "#4aa3df";
  if (temp < 24) return "#ff8f1f";
  return "#d63c3c";
}

function updateUI() {
  els.currentTemp.textContent = formatTemp(state.currentTemp);
  els.currentTemp.style.color = temperatureColor(state.currentTemp);
  els.targetTempLabel.textContent = `${formatTemp(state.targetTemp)}°C`;
  els.targetSlider.value = state.targetTemp;
  updateTargetTooltip();

  if (state.relayState) {
    els.relayCard.style.background = "#fff4e8";
    els.relayIcon.textContent = "🔥";
    els.relayState.textContent = "ENCENDIDA";
    els.relayState.style.color = "#ff6a1a";
  } else {
    els.relayCard.style.background = "#f3f3f3";
    els.relayIcon.textContent = "❄";
    els.relayState.textContent = "APAGADA";
    els.relayState.style.color = "#8a8a8a";
  }

  els.modeLabel.textContent = state.isManualMode ? "Manual" : "Programado";
  els.modeSwitch.checked = !state.isManualMode;
  els.modeInfo.textContent = state.isManualMode
    ? "En modo manual, puedes ajustar la temperatura deseada libremente."
    : "En modo programado, la temperatura se ajusta según los horarios configurados.";

  renderSchedules();
}

function updateTargetTooltip() {
  const min = Number(els.targetSlider.min);
  const max = Number(els.targetSlider.max);
  const val = Number(els.targetSlider.value);
  const percent = ((val - min) / (max - min)) * 100;
  els.targetTooltip.textContent = `${formatTemp(val)}°C`;
  els.targetTooltip.style.left = `calc(${percent}% + (${8 - percent * 0.16}px))`;
}

function connect() {
  if (client) {
    client.end(true);
  }

  setConnectionState(false, "Conectando...");
  const brokerUrl = BROKER_URLS[activeBrokerIndex];
  els.brokerLabel.textContent = `Broker: ${brokerUrl.replace("wss://", "")}`;

  client = mqtt.connect(brokerUrl, {
    clientId: `WebThermostat_${Date.now()}`,
    keepalive: 60,
    reconnectPeriod: 4000,
    connectTimeout: 10000,
  });

  client.on("connect", () => {
    setConnectionState(true, "Conectado");
    client.subscribe([
      TOPICS.statusTempCurrent,
      TOPICS.statusTempTarget,
      TOPICS.statusMode,
      TOPICS.statusRelay,
      TOPICS.statusConfig,
    ]);

    client.publish(TOPICS.requestConfig, "get");
  });

  client.on("reconnect", () => {
    setConnectionState(false, "Conectando...");
  });

  client.on("close", () => {
    setConnectionState(false, "Desconectado");
  });

  client.on("error", () => {
    setConnectionState(false, "Error de conexión");
  });

  client.on("message", (topic, payload) => {
    const message = payload.toString();
    handleMessage(topic, message);
  });
}

function handleMessage(topic, payload) {
  try {
    if (topic === TOPICS.statusTempCurrent) {
      state.currentTemp = parseFloat(payload);
    } else if (topic === TOPICS.statusTempTarget) {
      state.targetTemp = parseFloat(payload);
    } else if (topic === TOPICS.statusMode) {
      state.isManualMode = payload === "manual";
    } else if (topic === TOPICS.statusRelay) {
      state.relayState = payload === "ON";
    } else if (topic === TOPICS.statusConfig) {
      const config = JSON.parse(payload);
      state.currentTemp = Number(config.currentTemp);
      state.targetTemp = Number(config.targetTemp);
      state.isManualMode = config.mode === "manual";
      state.relayState = config.relayState === true;
      if (Array.isArray(config.schedules)) {
        state.schedules = config.schedules.map((sched) => ({
          day: sched.day,
          startHour: sched.startHour,
          startMin: sched.startMin,
          endHour: sched.endHour,
          endMin: sched.endMin,
          temp: Number(sched.temp),
        }));
      }
    }
  } catch (err) {
    console.error("Error procesando mensaje", err);
  }

  updateUI();
}

function publish(topic, value) {
  if (!client || !state.connected) return;
  client.publish(topic, value);
}

function setTargetTemperature(value) {
  publish(TOPICS.cmdTemp, value.toFixed(1));
}

function setMode(isManual) {
  publish(TOPICS.cmdMode, isManual ? "manual" : "programado");
}

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

function renderSchedules() {
  els.scheduleList.innerHTML = "";
  els.emptySchedules.style.display = state.schedules.length ? "none" : "block";
  els.saveSchedulesBtn.disabled = !state.schedules.length;

  state.schedules.forEach((sched, index) => {
    const card = document.createElement("div");
    card.className = "schedule-card";

    const header = document.createElement("div");
    header.className = "schedule-header";

    const title = document.createElement("div");
    title.textContent = `Programación ${index + 1}`;
    title.style.fontWeight = "600";

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.addEventListener("click", () => {
      state.schedules.splice(index, 1);
      updateUI();
    });

    header.appendChild(title);
    header.appendChild(del);
    card.appendChild(header);

    const dayLabel = document.createElement("div");
    dayLabel.textContent = "Día de la semana:";
    dayLabel.style.marginTop = "8px";
    card.appendChild(dayLabel);

    const daySelect = document.createElement("select");
    daySelect.style.marginTop = "6px";
    daySelect.style.padding = "8px";
    daySelect.style.width = "100%";
    daySelect.style.borderRadius = "8px";
    daySelect.style.border = "1px solid #ddd";

    dayNames.forEach((name, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = name;
      if (i === sched.day) opt.selected = true;
      daySelect.appendChild(opt);
    });

    daySelect.addEventListener("change", (e) => {
      sched.day = Number(e.target.value);
    });

    card.appendChild(daySelect);

    const timeRow = document.createElement("div");
    timeRow.className = "schedule-row";

    const startBox = document.createElement("div");
    startBox.className = "time-box";
    startBox.textContent = `Desde: ${formatTime(sched.startHour, sched.startMin)}`;
    startBox.addEventListener("click", () => openTimeModal(sched, true));

    const endBox = document.createElement("div");
    endBox.className = "time-box blue";
    endBox.textContent = `Hasta: ${formatTime(sched.endHour, sched.endMin)}`;
    endBox.addEventListener("click", () => openTimeModal(sched, false));

    timeRow.appendChild(startBox);
    timeRow.appendChild(endBox);
    card.appendChild(timeRow);

    const tempLabel = document.createElement("div");
    tempLabel.style.marginTop = "12px";
    tempLabel.textContent = `Temperatura: ${formatTemp(sched.temp)}°C`;
    card.appendChild(tempLabel);

    const tempSlider = document.createElement("input");
    tempSlider.type = "range";
    tempSlider.min = "15";
    tempSlider.max = "30";
    tempSlider.step = "0.5";
    tempSlider.value = sched.temp;
    tempSlider.addEventListener("input", (e) => {
      sched.temp = Number(e.target.value);
      tempLabel.textContent = `Temperatura: ${formatTemp(sched.temp)}°C`;
    });

    card.appendChild(tempSlider);
    els.scheduleList.appendChild(card);
  });
}

function formatTime(hour, minute) {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${hh}:${mm}`;
}

let pendingSchedule = null;
let pendingIsStart = true;

function openTimeModal(schedule, isStart) {
  pendingSchedule = schedule;
  pendingIsStart = isStart;
  const hour = isStart ? schedule.startHour : schedule.endHour;
  const minute = isStart ? schedule.startMin : schedule.endMin;

  els.hourPicker.innerHTML = "";
  els.minutePicker.innerHTML = "";

  for (let i = 0; i < 24; i += 1) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = String(i).padStart(2, "0");
    if (i === hour) opt.selected = true;
    els.hourPicker.appendChild(opt);
  }

  for (let i = 0; i < 60; i += 1) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = String(i).padStart(2, "0");
    if (i === minute) opt.selected = true;
    els.minutePicker.appendChild(opt);
  }

  els.timeModal.style.display = "flex";
}

function closeTimeModal() {
  els.timeModal.style.display = "none";
  pendingSchedule = null;
}

// Event listeners
els.backBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

els.confirmTimeBtn.addEventListener("click", () => {
  if (!pendingSchedule) return;
  const hour = Number(els.hourPicker.value);
  const minute = Number(els.minutePicker.value);
  if (pendingIsStart) {
    pendingSchedule.startHour = hour;
    pendingSchedule.startMin = minute;
  } else {
    pendingSchedule.endHour = hour;
    pendingSchedule.endMin = minute;
  }
  closeTimeModal();
  updateUI();
});

els.cancelTimeBtn.addEventListener("click", () => closeTimeModal());

els.targetSlider.addEventListener("input", (e) => {
  state.targetTemp = Number(e.target.value);
  els.targetTempLabel.textContent = `${formatTemp(state.targetTemp)}°C`;
  updateTargetTooltip();
});

els.targetSlider.addEventListener("change", (e) => {
  setTargetTemperature(Number(e.target.value));
});

els.modeSwitch.addEventListener("change", (e) => {
  setMode(!e.target.checked);
});

els.addScheduleBtn.addEventListener("click", () => {
  state.schedules.push({
    day: 0,
    startHour: 8,
    startMin: 0,
    endHour: 22,
    endMin: 0,
    temp: 22.0,
  });
  updateUI();
});

els.saveSchedulesBtn.addEventListener("click", () => {
  if (!state.schedules.length) return;
  setSchedules();
  els.saveSchedulesBtn.textContent = "Guardado";
  setTimeout(() => {
    els.saveSchedulesBtn.textContent = "Guardar Todo";
  }, 1500);
});

els.retryBtn.addEventListener("click", () => {
  activeBrokerIndex = (activeBrokerIndex + 1) % BROKER_URLS.length;
  connect();
});

els.reconnectBtn.addEventListener("click", () => connect());

els.tabs.addEventListener("click", (e) => {
  if (!e.target.classList.contains("tab")) return;
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
  e.target.classList.add("active");
  const tab = e.target.dataset.tab;
  if (tab === "control") {
    els.controlPanel.classList.add("active");
    els.schedulePanel.classList.remove("active");
  } else {
    els.controlPanel.classList.remove("active");
    els.schedulePanel.classList.add("active");
  }
});

// Initialize
function init() {
  setConnectionState(false, "Desconectado");
  loadDeviceInfo();
  updateUI();
}

init();
