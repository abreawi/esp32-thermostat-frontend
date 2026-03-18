# 🚀 Deploy Rápido a GitHub Pages (5 minutos)

## Resumen para Gente con Prisa

### 1️⃣ Crear repositorio en GitHub
```
https://github.com/new
- Nombre: esp32-thermostat-frontend
- Public
- NO marques "Add a README"
- Create repository
```

### 2️⃣ Subir código (PowerShell/CMD)
```bash
cd C:\Users\Abreawi\Git\led-controller-web-main\frontend

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU-USUARIO/esp32-thermostat-frontend.git
git branch -M main
git push -u origin main
```

### 3️⃣ Activar GitHub Pages
```
1. Ve a tu repo → Settings → Pages
2. Source: main branch, / (root)
3. Save
4. Espera 2 minutos
```

### 4️⃣ Tu sitio está en:
```
https://TU-USUARIO.github.io/esp32-thermostat-frontend/
```

---

## ⚠️ Importante

**El frontend necesita el backend para funcionar.**

### Opciones:

**A) Backend local (solo tú puedes usarlo):**
- Deja corriendo: `cd backend && npm run dev`
- Funciona desde tu computadora

**B) Backend público (todos pueden usarlo):**
1. Deploy backend en Railway: https://railway.app
2. Actualiza `frontend/js/config.js`:
   ```javascript
   BACKEND_URL_PROD: 'https://tu-app.railway.app/api'
   ```
3. Sube cambios:
   ```bash
   git add js/config.js
   git commit -m "Update backend URL"
   git push
   ```

---

## 🔄 Actualizaciones

Cada vez que cambies algo:

```bash
cd frontend
git add .
git commit -m "Descripción del cambio"
git push
```

GitHub Pages se actualiza solo en 1-2 minutos.

---

## 🎉 ¡Listo!

Ahora puedes compartir tu app con el link de GitHub Pages.

**Documentación completa:** Ver `DEPLOY_GITHUB_PAGES.md`
