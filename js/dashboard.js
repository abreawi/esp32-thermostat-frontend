// Dashboard logic
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const addDeviceBtn = document.getElementById('addDeviceBtn');
const addDeviceBtnEmpty = document.getElementById('addDeviceBtnEmpty');
const devicesGrid = document.getElementById('devicesGrid');
const emptyState = document.getElementById('emptyState');
const loadingSpinner = document.getElementById('loadingSpinner');
const claimModal = document.getElementById('claimModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelClaimBtn = document.getElementById('cancelClaimBtn');
const claimForm = document.getElementById('claimForm');
const claimError = document.getElementById('claimError');

// Check authentication
if (!api.getToken()) {
  window.location.href = 'index.html';
}

// Load user info
function loadUserInfo() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    userName.textContent = user.name || user.email;
  }
}

// Load devices
async function loadDevices() {
  loadingSpinner.classList.add('show');
  devicesGrid.innerHTML = '';

  try {
    const data = await api.getDevices();
    const devices = data.devices;

    if (devices.length === 0) {
      emptyState.style.display = 'block';
      devicesGrid.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      devicesGrid.style.display = 'grid';

      devices.forEach(device => {
        const card = createDeviceCard(device);
        devicesGrid.appendChild(card);
      });
    }
  } catch (error) {
    console.error('Error loading devices:', error);
    alert('Error al cargar dispositivos: ' + error.message);
  } finally {
    loadingSpinner.classList.remove('show');
  }
}

// Create device card
function createDeviceCard(device) {
  const card = document.createElement('div');
  card.className = 'device-card';

  const isOnline = device.is_online;
  const statusClass = isOnline ? 'online' : 'offline';
  const statusText = isOnline ? 'En línea' : 'Desconectado';

  card.innerHTML = `
    <div class="device-header">
      <div class="device-icon">🌡️</div>
      <div class="device-status ${statusClass}">
        <span class="status-indicator"></span>
        ${statusText}
      </div>
    </div>
    <h3 class="device-name">${device.device_alias || 'Termostato'}</h3>
    <p class="device-mac">${device.mac_address}</p>
    <div class="device-actions">
      <button class="device-btn control-btn" data-id="${device.id}">Controlar</button>
      <button class="device-btn unclaim-btn" data-id="${device.id}">Desvincular</button>
    </div>
  `;

  // Add event listeners
  const controlBtn = card.querySelector('.control-btn');
  const unclaimBtn = card.querySelector('.unclaim-btn');

  controlBtn.addEventListener('click', () => openDevice(device.id));
  unclaimBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    confirmUnclaim(device);
  });

  return card;
}

// Open device control page
function openDevice(deviceId) {
  localStorage.setItem('selectedDeviceId', deviceId);
  window.location.href = 'device.html';
}

// Confirm unclaim device
function confirmUnclaim(device) {
  const confirmed = confirm(
    `¿Estás seguro de que deseas desvincular "${device.device_alias || 'este dispositivo'}"?\n\nMAC: ${device.mac_address}`
  );

  if (confirmed) {
    unclaimDevice(device.id);
  }
}

// Unclaim device
async function unclaimDevice(deviceId) {
  try {
    await api.unclaimDevice(deviceId);
    loadDevices(); // Reload devices list
  } catch (error) {
    alert('Error al desvincular dispositivo: ' + error.message);
  }
}

// Show claim modal
function showClaimModal() {
  claimModal.classList.add('show');
  claimError.classList.remove('show');
  claimForm.reset();
}

// Hide claim modal
function hideClaimModal() {
  claimModal.classList.remove('show');
}

// Format MAC address as user types
const macInput = document.getElementById('macAddress');
macInput.addEventListener('input', (e) => {
  let value = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');

  // Format as AA:BB:CC:DD:EE:FF
  if (value.length > 12) {
    value = value.substring(0, 12);
  }

  const formatted = value.match(/.{1,2}/g)?.join(':') || value;
  e.target.value = formatted;
});

// Claim device form submission
claimForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const macAddress = document.getElementById('macAddress').value.trim();
  const deviceAlias = document.getElementById('deviceAlias').value.trim();

  claimError.classList.remove('show');

  try {
    await api.claimDevice(macAddress, deviceAlias || null);
    hideClaimModal();
    loadDevices(); // Reload devices list
  } catch (error) {
    claimError.textContent = error.message || 'Error al añadir dispositivo';
    claimError.classList.add('show');
  }
});

// Event listeners
logoutBtn.addEventListener('click', () => {
  const confirmed = confirm('¿Estás seguro de que deseas cerrar sesión?');
  if (confirmed) {
    api.clearToken();
    window.location.href = 'index.html';
  }
});

addDeviceBtn.addEventListener('click', showClaimModal);
addDeviceBtnEmpty.addEventListener('click', showClaimModal);
closeModalBtn.addEventListener('click', hideClaimModal);
cancelClaimBtn.addEventListener('click', hideClaimModal);

// Close modal when clicking outside
claimModal.addEventListener('click', (e) => {
  if (e.target === claimModal) {
    hideClaimModal();
  }
});

// Initialize
loadUserInfo();
loadDevices();
