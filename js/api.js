// API Client
class APIClient {
  constructor(baseURL = null) {
    // Usar CONFIG si está disponible, sino localhost
    this.baseURL = baseURL || (typeof CONFIG !== 'undefined' ? CONFIG.BACKEND_URL : 'http://localhost:3000/api');
    console.log('📡 API Client conectando a:', this.baseURL);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedDeviceId');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          this.clearToken();
          window.location.href = 'index.html';
        }

        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Device endpoints
  async claimDevice(mac_address, device_alias) {
    return this.request('/devices/claim', {
      method: 'POST',
      body: JSON.stringify({ mac_address, device_alias })
    });
  }

  async getDevices() {
    return this.request('/devices');
  }

  async getDevice(id) {
    return this.request(`/devices/${id}`);
  }

  async updateDevice(id, device_alias) {
    return this.request(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ device_alias })
    });
  }

  async unclaimDevice(id) {
    return this.request(`/devices/${id}/unclaim`, {
      method: 'DELETE'
    });
  }

  // MQTT endpoint
  async publishMQTT(device_id, topic, message) {
    return this.request('/mqtt/publish', {
      method: 'POST',
      body: JSON.stringify({ device_id, topic, message })
    });
  }

  // WebSocket connection for real-time updates
  connectWebSocket() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const wsURL = this.baseURL.replace('http', 'ws').replace('/api', '');
    const ws = new WebSocket(`${wsURL}?token=${token}`);

    return ws;
  }
}

// Global API client instance
const api = new APIClient();
