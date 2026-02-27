// Auth page logic
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const loadingSpinner = document.getElementById('loadingSpinner');

// Check if already logged in
if (api.getToken()) {
  window.location.href = 'dashboard.html';
}

// Toggle between login and register forms
showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  loginError.classList.remove('show');
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  registerError.classList.remove('show');
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  loginError.classList.remove('show');
  loadingSpinner.classList.add('show');

  try {
    const data = await api.login(email, password);

    // Store token and user info
    api.setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    loginError.textContent = error.message || 'Error al iniciar sesión';
    loginError.classList.add('show');
  } finally {
    loadingSpinner.classList.remove('show');
  }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

  registerError.classList.remove('show');

  // Validate passwords match
  if (password !== passwordConfirm) {
    registerError.textContent = 'Las contraseñas no coinciden';
    registerError.classList.add('show');
    return;
  }

  // Validate password length
  if (password.length < 8) {
    registerError.textContent = 'La contraseña debe tener al menos 8 caracteres';
    registerError.classList.add('show');
    return;
  }

  loadingSpinner.classList.add('show');

  try {
    const data = await api.register(email, password, name);

    // Store token and user info
    api.setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  } catch (error) {
    registerError.textContent = error.message || 'Error al registrar usuario';
    registerError.classList.add('show');
  } finally {
    loadingSpinner.classList.remove('show');
  }
});
