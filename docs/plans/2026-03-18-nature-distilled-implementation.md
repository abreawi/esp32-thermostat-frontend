# Nature Distilled UI/UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform ESP32 Thermostat application with warm, nature-inspired design system (Nature Distilled aesthetic)

**Architecture:** Pure CSS/HTML visual redesign with no JavaScript changes. Update three CSS files (auth.css, dashboard.css, styles.css) and three HTML files for font imports. Implement new color palette (terracotta, arena, earth tones), typography (Inter), and organic components with natural shadows and animations.

**Tech Stack:** Vanilla CSS3, HTML5, Google Fonts (Inter), no frameworks

**Design Reference:** `docs/plans/2026-03-18-nature-distilled-redesign-design.md`

---

## Phase 1: Foundation

### Task 1: Setup CSS Variables & Font Import

**Files:**
- Modify: `frontend/css/auth.css:1-11`
- Modify: `frontend/css/dashboard.css:1-11`
- Modify: `frontend/css/styles.css:1-12`
- Modify: `frontend/index.html:12`
- Modify: `frontend/dashboard.html:12`
- Modify: `frontend/device.html:12`

**Step 1: Update font import in HTML files**

In `index.html`, `dashboard.html`, `device.html`, replace line 12:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Step 2: Update CSS variables in auth.css**

Replace `:root` section (lines 1-11):

```css
:root {
  /* Nature Distilled Palette */
  --color-terracotta: #C67B5C;
  --color-arcilla: #B5651D;
  --color-arena: #F5F0E1;
  --color-crema: #FAF7F2;
  --color-tierra: #3D2F2A;
  --color-madera: #8B7355;
  --color-verde-salvia: #7A9B76;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(61, 47, 42, 0.06);
  --shadow-md: 0 8px 24px rgba(61, 47, 42, 0.06), 0 2px 6px rgba(61, 47, 42, 0.04);
  --shadow-lg: 0 8px 32px rgba(61, 47, 42, 0.12);
  --shadow-button: 0 4px 12px rgba(198, 123, 92, 0.25);

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  /* Spacing */
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Transitions */
  --transition-quick: 200ms ease-out;
  --transition-base: 300ms ease-out;
}
```

**Step 3: Update CSS variables in dashboard.css**

Replace `:root` section with same variables as Step 2.

**Step 4: Update CSS variables in styles.css**

Replace `:root` section with same variables as Step 2, plus add temperature colors:

```css
:root {
  /* ... (same as above) ... */

  /* Temperature Colors */
  --temp-cold: #5B8A8F;
  --temp-comfortable: #7A9B76;
  --temp-warm: #C67B5C;
  --temp-hot: #B5651D;
}
```

**Step 5: Verify in browser**

- Open `index.html` in browser
- Open DevTools → Elements → Computed
- Verify `font-family` shows "Inter"
- Verify CSS variables are defined in `:root`

**Step 6: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css frontend/css/styles.css frontend/index.html frontend/dashboard.html frontend/device.html
git commit -m "feat: add Nature Distilled CSS variables and Inter font"
```

---

### Task 2: Update Typography System

**Files:**
- Modify: `frontend/css/auth.css:18-31` (body, headings)
- Modify: `frontend/css/dashboard.css:18-31`
- Modify: `frontend/css/styles.css:19-32`

**Step 1: Update body typography in auth.css**

Replace `body` rule (around line 18):

```css
body {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-tierra);
  background: radial-gradient(circle at top left, var(--color-arena), #FBF6ED 40%, #F0E9DC 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  touch-action: manipulation;
}
```

**Step 2: Update heading styles in auth.css**

Find `.auth-header h1` (around line 83) and update:

```css
.auth-header h1 {
  margin: 0 0 10px;
  font-size: 32px;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
  line-height: 1.2;
  background: linear-gradient(135deg, var(--color-tierra) 0%, var(--color-madera) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Step 3: Update subtitle in auth.css**

Update `.subtitle` (around line 94):

```css
.subtitle {
  margin: 0;
  color: var(--color-madera);
  font-size: 15px;
  line-height: 1.6;
}
```

**Step 4: Update h2 styles in auth.css**

Find `.auth-form h2` (around line 102) and update:

```css
.auth-form h2 {
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--color-tierra);
}
```

**Step 5: Apply same typography updates to dashboard.css and styles.css**

Repeat similar changes for body, h1, h2 in both files, adapting to their existing structure.

**Step 6: Verify typography in browser**

- Open all three pages
- Check font is Inter (not Space Grotesk)
- Check headings use correct weights
- Check line-height is 1.6 for body text

**Step 7: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css frontend/css/styles.css
git commit -m "feat: update typography system to Inter with Nature Distilled hierarchy"
```

---

## Phase 2: Base Components

### Task 3: Update Button Styles

**Files:**
- Modify: `frontend/css/auth.css` (primary-btn, around line 150)
- Modify: `frontend/css/dashboard.css` (primary-btn, secondary-btn)
- Modify: `frontend/css/styles.css` (primary-btn, secondary-btn, ghost-btn)

**Step 1: Update primary button in auth.css**

Find `.primary-btn` and update:

```css
.primary-btn {
  width: 100%;
  padding: 12px 24px;
  background: var(--color-terracotta);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-quick);
  box-shadow: var(--shadow-button);
  -webkit-tap-highlight-color: rgba(198, 123, 92, 0.2);
}

.primary-btn:hover {
  background: var(--color-arcilla);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(181, 101, 29, 0.3);
}

.primary-btn:active {
  transform: scale(0.98);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Step 2: Update secondary button in dashboard.css**

Find `.secondary-btn` and update:

```css
.secondary-btn {
  padding: 10px 22px;
  background: transparent;
  color: var(--color-terracotta);
  border: 2px solid var(--color-terracotta);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-quick);
  -webkit-tap-highlight-color: rgba(198, 123, 92, 0.2);
}

.secondary-btn:hover {
  background: rgba(198, 123, 92, 0.08);
}

.secondary-btn:active {
  transform: scale(0.98);
}
```

**Step 3: Apply button styles to styles.css**

Update `.primary-btn` and `.secondary-btn` with same styles.

**Step 4: Update icon buttons in styles.css**

Find `.icon-btn` (around line 139) and update:

```css
.icon-btn {
  border: none;
  background: rgba(198, 123, 92, 0.1);
  color: var(--color-terracotta);
  font-size: 18px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-quick);
  box-shadow: var(--shadow-sm);
  min-width: 44px;
  min-height: 44px;
  -webkit-tap-highlight-color: rgba(198, 123, 92, 0.2);
}

.icon-btn:hover {
  background: rgba(198, 123, 92, 0.15);
  transform: translateY(-1px);
}

.icon-btn:active {
  transform: scale(0.98);
}
```

**Step 5: Verify buttons in browser**

- Check all pages for button appearance
- Test hover states
- Test active states (click and hold)
- Verify touch targets are 44x44px minimum

**Step 6: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css frontend/css/styles.css
git commit -m "feat: update button styles with Nature Distilled colors and interactions"
```

---

### Task 4: Update Card Styles

**Files:**
- Modify: `frontend/css/auth.css` (auth-card, around line 58)
- Modify: `frontend/css/dashboard.css` (device cards)
- Modify: `frontend/css/styles.css` (card, around line 200)

**Step 1: Update auth card in auth.css**

Find `.auth-card` (around line 58):

```css
.auth-card {
  background: var(--color-crema);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(139, 115, 85, 0.12);
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Step 2: Update card base styles in styles.css**

Find `.card` (around line 200):

```css
.card {
  background: var(--color-crema);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(139, 115, 85, 0.12);
  transition: all var(--transition-quick);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Step 3: Update device card in dashboard.css**

Find `.device-card` and update:

```css
.device-card {
  background: var(--color-crema);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(139, 115, 85, 0.12);
  cursor: pointer;
  transition: all var(--transition-quick);
  -webkit-tap-highlight-color: rgba(198, 123, 92, 0.2);
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.device-card:active {
  transform: scale(0.98);
}
```

**Step 4: Update topbar card in styles.css**

Find `.topbar` (around line 72):

```css
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-crema);
  border-radius: var(--radius-xl);
  padding: 20px 28px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(139, 115, 85, 0.12);
  margin-bottom: var(--space-lg);
}
```

**Step 5: Verify cards in browser**

- Check all pages for card styling
- Test hover animations (should lift up 2px)
- Verify shadows are subtle
- Check border radius is 16px

**Step 6: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css frontend/css/styles.css
git commit -m "feat: update card components with Nature Distilled shadows and borders"
```

---

### Task 5: Update Form Input Styles

**Files:**
- Modify: `frontend/css/auth.css` (form inputs, around line 120)
- Modify: `frontend/css/dashboard.css` (modal inputs)

**Step 1: Update input base styles in auth.css**

Find `input[type="text"]`, `input[type="email"]`, `input[type="password"]` (around line 120):

```css
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E8DED3;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 16px;
  color: var(--color-tierra);
  background: #FFFFFF;
  transition: border-color var(--transition-quick), outline var(--transition-quick);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: var(--color-terracotta);
  outline: 2px solid rgba(198, 123, 92, 0.2);
  outline-offset: 2px;
}

input[type="text"]::placeholder,
input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: var(--color-madera);
  opacity: 0.6;
}
```

**Step 2: Update label styles in auth.css**

Find `label` (around line 108):

```css
label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-tierra);
}
```

**Step 3: Update error message styles in auth.css**

Find `.error-message` (around line 140):

```css
.error-message {
  background: rgba(181, 101, 29, 0.08);
  border-left: 4px solid var(--color-arcilla);
  color: var(--color-arcilla);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  line-height: 1.5;
  margin: 16px 0;
  display: none;
}

.error-message:not(:empty) {
  display: block;
}
```

**Step 4: Apply input styles to dashboard.css modal**

Copy same input styles to dashboard.css for modal inputs.

**Step 5: Verify form inputs in browser**

- Check input border color
- Test focus state (should show terracotta border + outline)
- Verify placeholder color
- Test error message styling
- Verify touch targets are adequate

**Step 6: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css
git commit -m "feat: update form input styles with Nature Distilled colors and focus states"
```

---

## Phase 3: Page-Specific Updates

### Task 6: Complete Login/Register Page Styling

**Files:**
- Modify: `frontend/css/auth.css` (remaining elements)

**Step 1: Update background grid pattern**

Find `.bg-grid` (around line 41):

```css
.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 115, 85, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 115, 85, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
}
```

**Step 2: Update form toggle link**

Find `.form-toggle a` (around line 170):

```css
.form-toggle {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--color-madera);
}

.form-toggle a {
  color: var(--color-terracotta);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: color var(--transition-quick);
}

.form-toggle a:hover {
  color: var(--color-arcilla);
  text-decoration: underline;
}
```

**Step 3: Update loading spinner**

Find `.loading-spinner` (around line 185):

```css
.loading-spinner {
  border: 3px solid rgba(198, 123, 92, 0.2);
  border-top-color: var(--color-terracotta);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  display: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

**Step 4: Test login page in browser**

- Open `index.html`
- Verify overall color scheme
- Test form switching (login ↔ register)
- Check all interactive states
- Test on mobile viewport (375px)

**Step 5: Commit**

```bash
git add frontend/css/auth.css
git commit -m "feat: complete login/register page Nature Distilled styling"
```

---

### Task 7: Update Dashboard Page Styling

**Files:**
- Modify: `frontend/css/dashboard.css` (all components)

**Step 1: Update background and app container**

Find `body` and `.bg-grid`:

```css
body {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-tierra);
  background: radial-gradient(circle at top left, var(--color-arena), #FBF6ED 40%, #F0E9DC 100%);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  touch-action: manipulation;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 115, 85, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 115, 85, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
}
```

**Step 2: Update topbar in dashboard**

Update `.topbar` and child elements:

```css
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-crema);
  border-radius: var(--radius-xl);
  padding: 20px 28px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(139, 115, 85, 0.12);
  margin-bottom: var(--space-lg);
}

.topbar h1 {
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
  line-height: 1.2;
  background: linear-gradient(135deg, var(--color-tierra) 0%, var(--color-madera) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-name {
  font-size: 14px;
  color: var(--color-madera);
  font-weight: var(--font-weight-medium);
}
```

**Step 3: Update devices grid**

Find `.devices-grid`:

```css
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

@media (max-width: 768px) {
  .devices-grid {
    grid-template-columns: 1fr;
  }
}
```

**Step 4: Update device card content**

Find `.device-name`, `.device-status`:

```css
.device-name {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-tierra);
  margin: 0 0 8px;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-madera);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-verde-salvia);
}

.status-dot.offline {
  background: var(--color-madera);
}
```

**Step 5: Update empty state**

Find `.empty-state`:

```css
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--color-crema);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(139, 115, 85, 0.12);
  box-shadow: var(--shadow-sm);
}

.big-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-tierra);
}

.empty-state p {
  margin: 0 0 24px;
  font-size: 15px;
  color: var(--color-madera);
  line-height: 1.5;
}
```

**Step 6: Update modal styling**

Find `.modal-card`:

```css
.modal {
  position: fixed;
  inset: 0;
  background: rgba(61, 47, 42, 0.5);
  backdrop-filter: blur(4px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal.active {
  display: flex;
}

.modal-card {
  background: var(--color-crema);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(139, 115, 85, 0.12);
  max-width: 480px;
  width: 100%;
  animation: slideUp 0.3s ease-out;
}

@media (max-width: 768px) {
  .modal-card {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-width: none;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.modal-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-tierra);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  color: var(--color-madera);
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all var(--transition-quick);
}

.close-btn:hover {
  background: rgba(139, 115, 85, 0.1);
  color: var(--color-tierra);
}
```

**Step 7: Test dashboard in browser**

- Open `dashboard.html`
- Verify device cards styling
- Test add device modal
- Check empty state
- Test on mobile (single column)

**Step 8: Commit**

```bash
git add frontend/css/dashboard.css
git commit -m "feat: complete dashboard page Nature Distilled styling"
```

---

### Task 8: Update Device Control Page - Temperature Display

**Files:**
- Modify: `frontend/css/styles.css` (temperature card, around line 200)

**Step 1: Update temperature display card**

Find the temperature display card section:

```css
.card .row {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
}

.card-title {
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  color: var(--color-madera);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.temp-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 8px;
}

.temp-display span:first-child {
  font-size: 56px;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--color-terracotta);
}

.temp-unit {
  font-size: 24px;
  font-weight: var(--font-weight-medium);
  color: var(--color-madera);
}

@media (max-width: 768px) {
  .temp-display span:first-child {
    font-size: 48px;
  }

  .card .row {
    flex-direction: row;
    justify-content: space-between;
  }
}
```

**Step 2: Add dynamic temperature color classes**

Add temperature color utility classes:

```css
.temp-cold {
  color: var(--temp-cold) !important;
}

.temp-comfortable {
  color: var(--temp-comfortable) !important;
}

.temp-warm {
  color: var(--temp-warm) !important;
}

.temp-hot {
  color: var(--temp-hot) !important;
}
```

**Step 3: Update humidity display**

Ensure humidity uses same styling as temperature but with olive color:

```css
#currentHumidity {
  color: var(--color-verde-salvia);
}
```

**Step 4: Test temperature display in browser**

- Open `device.html`
- Verify temperature is large and bold
- Check humidity display
- Test mobile layout (2 columns)
- Verify tabular nums for consistent width

**Step 5: Commit**

```bash
git add frontend/css/styles.css
git commit -m "feat: update temperature and humidity display with Nature Distilled styling"
```

---

### Task 9: Update Device Control Page - Temperature Slider

**Files:**
- Modify: `frontend/css/styles.css` (slider section, around line 300)

**Step 1: Update target temperature label**

Find `.target-pill`:

```css
.target-pill {
  background: rgba(198, 123, 92, 0.1);
  color: var(--color-terracotta);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  border: 1px solid rgba(198, 123, 92, 0.2);
}
```

**Step 2: Update slider track and thumb**

Find `input[type="range"]` styles:

```css
.range-wrap {
  position: relative;
  margin: 24px 0;
}

input[type="range"] {
  width: 100%;
  height: 8px;
  background: #E8DED3;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 44px;
  height: 44px;
  background: var(--color-terracotta);
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 8px rgba(198, 123, 92, 0.3);
  transition: transform var(--transition-quick);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

input[type="range"]::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

input[type="range"]::-moz-range-thumb {
  width: 44px;
  height: 44px;
  background: var(--color-terracotta);
  border: none;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 2px 8px rgba(198, 123, 92, 0.3);
  transition: transform var(--transition-quick);
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.1);
}

input[type="range"]::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}
```

**Step 3: Update range tooltip**

Find `.range-tooltip`:

```css
.range-tooltip {
  position: absolute;
  top: -40px;
  background: var(--color-tierra);
  color: var(--color-crema);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  pointer-events: none;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity var(--transition-quick);
}

input[type="range"]:hover + .range-tooltip,
input[type="range"]:active + .range-tooltip {
  opacity: 1;
}
```

**Step 4: Update range marks**

Find `.range-marks`:

```css
.range-marks {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-madera);
  user-select: none;
}

.range-marks span {
  position: relative;
}

@media (max-width: 768px) {
  .range-marks {
    display: none;
  }
}
```

**Step 5: Test slider in browser**

- Verify thumb is 44x44px
- Test drag interaction
- Check tooltip appears on hover/drag
- Verify marks are hidden on mobile
- Test touch interaction on mobile

**Step 6: Commit**

```bash
git add frontend/css/styles.css
git commit -m "feat: update temperature slider with Nature Distilled styling and improved touch targets"
```

---

### Task 10: Update Device Control Page - Relay Card

**Files:**
- Modify: `frontend/css/styles.css` (relay card section)

**Step 1: Update relay card base**

Find `.relay` card:

```css
.card.relay {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 20px var(--space-lg);
  transition: all var(--transition-base);
  background: var(--color-arena);
  border-left: 4px solid transparent;
}

.card.relay.active {
  background: #FFF4ED;
  border-left-color: var(--color-terracotta);
  border: 1px solid rgba(198, 123, 92, 0.2);
  box-shadow: 0 0 24px rgba(198, 123, 92, 0.12);
}
```

**Step 2: Update relay icon**

Find `.relay-icon`:

```css
.relay-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(122, 155, 118, 0.15);
  transition: all var(--transition-base);
}

.card.relay.active .relay-icon {
  background: rgba(198, 123, 92, 0.15);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

**Step 3: Update relay state text**

Find `.relay-state`:

```css
.relay-state {
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-madera);
  margin-top: 4px;
}

.card.relay.active .relay-state {
  color: var(--color-terracotta);
}
```

**Step 4: Test relay card in browser**

- Check OFF state (arena background, green icon tint)
- Check ON state (warm background, terracotta border, pulse animation)
- Verify border-left animation (0 → 4px)
- Test transition smoothness (300ms)

**Step 5: Commit**

```bash
git add frontend/css/styles.css
git commit -m "feat: update relay card with Nature Distilled ON/OFF states and animations"
```

---

### Task 11: Update Device Control Page - Mode Switch & Tabs

**Files:**
- Modify: `frontend/css/styles.css` (switch and tabs)

**Step 1: Update switch toggle**

Find `.switch` and `.slider`:

```css
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch .slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #E8DED3;
  border-radius: 14px;
  transition: background var(--transition-base);
}

.switch .slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(61, 47, 42, 0.2);
  transition: transform var(--transition-base) cubic-bezier(0.4, 0, 0.2, 1);
}

.switch input:checked + .slider {
  background: var(--color-terracotta);
}

.switch input:checked + .slider:before {
  transform: translateX(20px);
}

.switch input:focus + .slider {
  outline: 2px solid rgba(198, 123, 92, 0.2);
  outline-offset: 2px;
}
```

**Step 2: Update mode info box**

Find `.info-box`:

```css
.info-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(122, 155, 118, 0.08);
  border-left: 4px solid var(--color-verde-salvia);
  border-radius: var(--radius-sm);
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-tierra);
  margin-top: var(--space-lg);
}

.info-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: var(--color-verde-salvia);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
}
```

**Step 3: Update tabs navigation**

Find `.tabs` and `.tab`:

```css
.tabs {
  display: flex;
  gap: var(--space-sm);
  background: var(--color-crema);
  padding: 8px;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.tab {
  flex: 1;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 15px;
  font-weight: var(--font-weight-medium);
  color: var(--color-madera);
  cursor: pointer;
  transition: all var(--transition-quick);
  -webkit-tap-highlight-color: rgba(198, 123, 92, 0.2);
}

.tab.active {
  background: var(--color-terracotta);
  color: #FFFFFF;
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-sm);
}

.tab:hover:not(.active) {
  background: rgba(198, 123, 92, 0.08);
  color: var(--color-tierra);
}
```

**Step 4: Test mode switch and tabs in browser**

- Test switch toggle animation
- Verify switch thumb slides smoothly
- Check tab active state styling
- Test tab switching
- Verify info box styling

**Step 5: Commit**

```bash
git add frontend/css/styles.css
git commit -m "feat: update mode switch and tabs with Nature Distilled styling"
```

---

### Task 12: Update Device Control Page - Status & Connection

**Files:**
- Modify: `frontend/css/styles.css` (status, connection panel)

**Step 1: Update status dot and text**

Find `.status-dot` and `.status-text`:

```css
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-madera);
  margin-top: 4px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-madera);
  transition: background var(--transition-base);
}

.status-dot.online {
  background: var(--color-verde-salvia);
  box-shadow: 0 0 8px rgba(122, 155, 118, 0.4);
}

.status-text {
  font-weight: var(--font-weight-medium);
}
```

**Step 2: Update connection panel**

Find `.connection-card`:

```css
.connection-card {
  text-align: center;
  padding: 60px 20px;
  background: var(--color-crema);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(139, 115, 85, 0.12);
  box-shadow: var(--shadow-sm);
}

.connection-card .big-icon {
  font-size: 64px;
  color: var(--color-madera);
  margin-bottom: 16px;
  transition: all var(--transition-base);
}

.connection-card .big-icon.connecting {
  color: var(--color-terracotta);
  animation: spin 2s linear infinite;
}

.connection-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-tierra);
}

.connection-card p {
  margin: 0 0 8px;
  font-size: 15px;
  color: var(--color-madera);
  line-height: 1.5;
}

.connection-card .mono {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
  font-size: 13px;
  color: var(--color-madera);
  background: rgba(139, 115, 85, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin: 8px 0 16px;
}

.connection-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.spinner {
  border: 3px solid rgba(198, 123, 92, 0.2);
  border-top-color: var(--color-terracotta);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
```

**Step 3: Update info verification box**

Find verification info box in connection panel:

```css
.connection-card .info-box {
  background: rgba(122, 155, 118, 0.08);
  border-left: 4px solid var(--color-verde-salvia);
  text-align: left;
  margin-top: 24px;
}

.connection-card .info-box .info-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-tierra);
  margin-bottom: 8px;
}

.connection-card .info-box ul {
  margin: 0;
  padding-left: 20px;
  list-style: disc;
}

.connection-card .info-box li {
  margin-bottom: 4px;
  color: var(--color-tierra);
}
```

**Step 4: Test connection states in browser**

- Check disconnected state (gray dot)
- Check connected state (green dot with glow)
- Verify connection panel appears when disconnected
- Test spinner animation
- Check verification list styling

**Step 5: Commit**

```bash
git add frontend/css/styles.css
git commit -m "feat: update status indicators and connection panel with Nature Distilled styling"
```

---

### Task 13: Update Device Control Page - Schedule Panel

**Files:**
- Modify: `frontend/css/styles.css` (schedule section)

**Step 1: Update schedule empty state**

Find schedule empty state:

```css
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--color-crema);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(139, 115, 85, 0.12);
  box-shadow: var(--shadow-sm);
}

.empty-state .calendar {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state > div:nth-child(2) {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-tierra);
  margin-bottom: 8px;
}

.empty-state .muted {
  font-size: 15px;
  color: var(--color-madera);
}
```

**Step 2: Update schedule cards**

Find `.schedule-card`:

```css
.schedule-card {
  background: var(--color-crema);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  border: 1px solid rgba(139, 115, 85, 0.12);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-md);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.delete-btn {
  background: rgba(181, 101, 29, 0.1);
  border: none;
  color: var(--color-arcilla);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-quick);
}

.delete-btn:hover {
  background: rgba(181, 101, 29, 0.2);
  transform: scale(1.1);
}
```

**Step 3: Update schedule form elements**

Find schedule select and inputs:

```css
.schedule-card select,
.schedule-card input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #E8DED3;
  border-radius: var(--radius-sm);
  font-family: var(--font-primary);
  font-size: 15px;
  color: var(--color-tierra);
  background: #FFFFFF;
  margin-top: 8px;
  transition: border-color var(--transition-quick);
}

.schedule-card select:focus,
.schedule-card input:focus {
  border-color: var(--color-terracotta);
  outline: 2px solid rgba(198, 123, 92, 0.2);
  outline-offset: 2px;
}
```

**Step 4: Update schedule action buttons**

Find `.schedule-actions`:

```css
.schedule-actions {
  display: flex;
  gap: 12px;
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid rgba(139, 115, 85, 0.12);
}

.schedule-actions button {
  flex: 1;
}

.schedule-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

**Step 5: Update time picker modal**

Find `.time-pickers`:

```css
.time-pickers {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
}

.time-pickers select {
  padding: 12px 16px;
  border: 2px solid #E8DED3;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-tierra);
  background: #FFFFFF;
  min-width: 80px;
  text-align: center;
  transition: border-color var(--transition-quick);
}

.time-pickers select:focus {
  border-color: var(--color-terracotta);
  outline: 2px solid rgba(198, 123, 92, 0.2);
  outline-offset: 2px;
}

.colon {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--color-tierra);
}

.ghost-btn {
  background: transparent;
  border: none;
  color: var(--color-terracotta);
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-quick);
}

.ghost-btn:hover {
  background: rgba(198, 123, 92, 0.08);
}
```

**Step 6: Test schedule panel in browser**

- Check empty state
- Test adding schedule
- Verify delete button
- Test time picker modal
- Check form element focus states

**Step 7: Commit**

```bash
git add frontend/css/styles.css
git commit -m "feat: update schedule panel and time picker with Nature Distilled styling"
```

---

## Phase 4: Polish & Final Touches

### Task 14: Add Responsive Adjustments

**Files:**
- Modify: `frontend/css/styles.css` (media queries)
- Modify: `frontend/css/dashboard.css` (media queries)
- Modify: `frontend/css/auth.css` (media queries)

**Step 1: Consolidate mobile breakpoints in styles.css**

Add/update media query section at end of file:

```css
/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .app {
    padding: 20px 16px 32px;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 16px;
  }

  .topbar .actions {
    width: 100%;
    justify-content: flex-end;
  }

  .card {
    padding: 20px 16px;
  }

  .temp-display span:first-child {
    font-size: 48px;
  }

  .card .row {
    gap: 12px;
  }

  .range-marks {
    display: none;
  }

  .modal-card {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-width: none;
    animation: slideUpMobile 0.3s ease-out;
  }

  @keyframes slideUpMobile {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}

@media (max-width: 480px) {
  .topbar h1 {
    font-size: 22px;
  }

  .temp-display span:first-child {
    font-size: 40px;
  }

  .card {
    padding: 16px;
  }
}
```

**Step 2: Add dashboard responsive rules**

In `dashboard.css`, consolidate mobile styles:

```css
@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    gap: 12px;
  }

  .devices-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .modal-card {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-width: none;
  }
}
```

**Step 3: Add auth page responsive rules**

In `auth.css`, update mobile styles:

```css
@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }

  .auth-header h1 {
    font-size: 28px;
  }
}
```

**Step 4: Test responsive behavior**

- Test at 375px (iPhone SE)
- Test at 768px (iPad portrait)
- Test at 1024px (iPad landscape)
- Test at 1440px (desktop)
- Verify all touch targets are 44x44px minimum
- Check modal behavior on mobile (slide up from bottom)

**Step 5: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css frontend/css/styles.css
git commit -m "feat: add responsive adjustments for mobile, tablet, and desktop"
```

---

### Task 15: Add Accessibility Enhancements

**Files:**
- Modify: `frontend/css/auth.css` (focus states)
- Modify: `frontend/css/dashboard.css` (focus states)
- Modify: `frontend/css/styles.css` (focus states, reduced motion)

**Step 1: Add global focus styles**

Add to all three CSS files after the `:root` section:

```css
/* ============================================
   ACCESSIBILITY
   ============================================ */

*:focus-visible {
  outline: 2px solid var(--color-arcilla);
  outline-offset: 2px;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
.tab:focus-visible {
  outline: 2px solid var(--color-arcilla);
  outline-offset: 2px;
}
```

**Step 2: Add reduced motion support**

Add at end of each CSS file:

```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 3: Add high contrast mode support**

Add after reduced motion:

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  .primary-btn,
  .secondary-btn {
    border-width: 2px;
  }

  .card {
    border-width: 2px;
  }
}
```

**Step 4: Verify accessibility in browser**

- Test keyboard navigation (Tab through all elements)
- Verify focus rings are visible on all interactive elements
- Test with DevTools forced colors mode
- Check contrast ratios in DevTools
- Test with screen reader (NVDA/VoiceOver) if available

**Step 5: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css frontend/css/styles.css
git commit -m "feat: add accessibility enhancements - focus states and reduced motion support"
```

---

### Task 16: Add Optional Grain Texture (Enhancement)

**Files:**
- Modify: `frontend/css/auth.css` (add grain)
- Modify: `frontend/css/dashboard.css` (add grain)
- Modify: `frontend/css/styles.css` (add grain)

**Step 1: Create grain texture SVG**

Add after `.bg-grid` in each CSS file:

```css
.grain-texture {
  position: fixed;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.03"/></svg>');
  pointer-events: none;
  z-index: 1;
  opacity: 1;
}
```

**Step 2: Add grain div to HTML files**

This step requires adding HTML, add after `<div class="bg-grid"></div>` in each HTML file:

```html
<div class="grain-texture"></div>
```

Files to modify:
- `frontend/index.html:16`
- `frontend/dashboard.html:16`
- `frontend/device.html:16`

**Step 3: Test grain texture**

- Verify texture is barely visible (should be subtle)
- Check performance (no lag)
- Test on mobile devices
- If too visible, reduce opacity to 0.02

**Step 4: Commit**

```bash
git add frontend/css/auth.css frontend/css/dashboard.css frontend/css/styles.css frontend/index.html frontend/dashboard.html frontend/device.html
git commit -m "feat: add optional subtle grain texture for artisanal Nature Distilled feel"
```

**Note:** This step is optional. If grain texture causes performance issues or is too visible, skip or remove it.

---

### Task 17: Final Verification & Testing

**Files:**
- None (testing only)

**Step 1: Visual regression testing**

Open each page and verify:

**Login Page (`index.html`):**
- [ ] Nature Distilled color palette applied
- [ ] Inter font loaded
- [ ] Card shadows subtle and natural
- [ ] Buttons terracotta with proper hover states
- [ ] Input focus states visible
- [ ] Form toggle link styled correctly
- [ ] Loading spinner terracotta colored
- [ ] Mobile responsive (375px)

**Dashboard Page (`dashboard.html`):**
- [ ] Topbar with Nature Distilled styling
- [ ] Device cards with proper shadows
- [ ] Empty state styled correctly
- [ ] Add device modal opens properly
- [ ] Modal inputs have focus states
- [ ] Buttons styled consistently
- [ ] Mobile: single column, modal slides from bottom

**Device Control Page (`device.html`):**
- [ ] Temperature display large and bold
- [ ] Humidity display styled
- [ ] Temperature slider has 44px thumb
- [ ] Slider tooltip appears on hover/drag
- [ ] Relay card OFF state (arena bg, green tint)
- [ ] Relay card ON state (warm bg, terracotta border, animation)
- [ ] Mode switch animated smoothly
- [ ] Tabs styled with active state
- [ ] Status dot shows correct colors
- [ ] Connection panel styled when disconnected
- [ ] Schedule panel empty state
- [ ] Schedule cards styled properly
- [ ] Time picker modal styled

**Step 2: Interaction testing**

Test all interactive elements:
- [ ] All buttons clickable and responsive
- [ ] All hover states work
- [ ] Slider draggable smoothly
- [ ] Switch toggle animates
- [ ] Tabs switch panels correctly
- [ ] Modals open/close properly
- [ ] Form submissions work
- [ ] All transitions smooth (200-300ms)

**Step 3: Responsive testing**

Test at breakpoints:
- [ ] 375px (iPhone SE) - Mobile layout
- [ ] 768px (iPad portrait) - Tablet layout
- [ ] 1024px (iPad landscape) - Desktop layout
- [ ] 1440px (Desktop) - Wide layout

**Step 4: Accessibility testing**

- [ ] Tab through all pages (keyboard navigation)
- [ ] Focus states visible on all interactive elements
- [ ] Test with reduced motion preference enabled
- [ ] Verify WCAG AA contrast ratios
- [ ] Test with screen reader (optional)

**Step 5: Performance testing**

- [ ] Page load <3s on 3G
- [ ] No jank during animations
- [ ] Smooth scrolling
- [ ] Hover states responsive (<100ms)

**Step 6: Cross-browser testing** (if possible)

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (Chrome Android, Safari iOS)

**Step 7: Document any issues**

Create a list of any bugs or issues found:
- Screenshot the issue
- Note the page and viewport size
- Describe expected vs actual behavior

**Step 8: Final commit (if fixes needed)**

If you made any fixes during testing:

```bash
git add [modified files]
git commit -m "fix: address [description of fixes] found during final testing"
```

---

### Task 18: Push to GitHub

**Files:**
- None (git push)

**Step 1: Review all commits**

```bash
git log --oneline origin/main..HEAD
```

Expected: 15-18 commits following the Nature Distilled implementation.

**Step 2: Push to GitHub**

```bash
git push origin main
```

**Step 3: Verify on GitHub Pages**

- Wait 1-2 minutes for GitHub Pages to rebuild
- Visit: `https://abreawi.github.io/esp32-thermostat-frontend/`
- Perform quick smoke test:
  - Open login page
  - Register/login
  - View dashboard
  - Open device control
- Verify Nature Distilled styling is live

**Step 4: Create summary comment**

Document what was accomplished:
- Nature Distilled design system implemented
- New color palette (terracotta, arena, earth tones)
- Inter typography
- Organic shadows and borders
- Improved accessibility
- Enhanced responsive design
- Optional grain texture
- All pages styled consistently

**Step 5: Final verification**

```bash
git status
```

Expected: "nothing to commit, working tree clean"

---

## Implementation Complete

All tasks completed. The ESP32 Thermostat application now features the Nature Distilled design system with:

✅ Warm earth-tone color palette (terracotta, arena, arcilla)
✅ Inter typography with proper hierarchy
✅ Organic cards with natural shadows
✅ Smooth animations and transitions
✅ Improved accessibility (WCAG AA, focus states, reduced motion)
✅ Enhanced responsive design for mobile, tablet, desktop
✅ Consistent styling across all pages
✅ Optional subtle grain texture for artisanal feel

The design maintains all existing functionality while transforming the visual aesthetic to be warm, professional, and nature-inspired—perfect for a commercial smart home product.

---

**Total Estimated Time:** 3-4 hours for complete implementation
**Commits:** 15-18 atomic commits
**Files Modified:** 6 (3 CSS + 3 HTML)
**Lines Changed:** ~1000-1500 LOC

**Testing Checklist:**
- [ ] Visual regression on all pages
- [ ] Interaction testing on all elements
- [ ] Responsive testing at all breakpoints
- [ ] Accessibility testing (keyboard, contrast, motion)
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Live on GitHub Pages

**Documentation:**
- Design document: `docs/plans/2026-03-18-nature-distilled-redesign-design.md`
- Implementation plan: `docs/plans/2026-03-18-nature-distilled-implementation.md`
