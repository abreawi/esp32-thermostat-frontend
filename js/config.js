// Configuración de la aplicación

// Detectar si estamos en desarrollo o producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// URLs del backend
const CONFIG = {
  // URL del backend en desarrollo (tu computadora)
  BACKEND_URL_DEV: 'http://localhost:3000/api',

  // URL del backend en producción (Railway)
  BACKEND_URL_PROD: 'https://esp32-thermostat-backend-production.up.railway.app/api',

  // URL actual según el entorno
  get BACKEND_URL() {
    return isProduction ? this.BACKEND_URL_PROD : this.BACKEND_URL_DEV;
  },

  // Configuración MQTT
  MQTT_BROKERS: [
    "wss://broker.hivemq.com:8884/mqtt",
    "wss://test.mosquitto.org:8081"
  ]
};

// Log para debugging
console.log('🌐 Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('🔗 Backend URL:', CONFIG.BACKEND_URL);
