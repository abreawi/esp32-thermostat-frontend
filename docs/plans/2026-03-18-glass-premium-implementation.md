# Glass Premium UI/UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform ESP32 Thermostat from muted Nature Distilled to vibrant Glass Premium design with glassmorphism effects and coral accent.

**Architecture:** Pure CSS/HTML visual redesign replacing Nature Distilled colors with high-contrast palette, adding backdrop-filter glassmorphism to all cards, vibrant coral #FF875C accent, increased spacing (+40-50%), and removing grain texture. No JavaScript changes.

**Tech Stack:** Vanilla CSS3 (backdrop-filter, gradients), HTML5, Inter font (already loaded)

**Design Reference:** `docs/plans/2026-03-18-glass-premium-redesign-design.md`

---

## Phase 1: Foundation - Colors & Backgrounds

### Task 1: Update CSS Variables to Glass Premium Palette

**Files:**
- Modify: `css/auth.css:1-50`
- Modify: `css/dashboard.css:1-50`
- Modify: `css/styles.css:1-60`

**Step 1: Update CSS variables in auth.css**

Replace `:root` section with Glass Premium palette:

```css
:root {
  /* Glass Premium Palette */
  --color-coral: #FF875C;
  --color-coral-hover: #FF6B3D;
  --color-white: #FFFFFF;
  --color-off-white: #F9FAFB;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;
  --color-gray-700: #374151;
  --color-black: #1A1A1A;

  /* Status Colors */
  --color-success: #10B981;
  --color-error: #EF4444;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-blur: blur(12px) saturate(180%);
  --glass-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  --glass-shadow-hover: 0 25px 70px rgba(0, 0, 0, 0.15);

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 20px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.12);
  --shadow-coral: 0 10px 30px rgba(255, 135, 92, 0.4);
  --shadow-green: 0 0 12px rgba(16, 185, 129, 0.6);

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 24px;

  /* Spacing (Increased) */
  --space-sm: 12px;
  --space-md: 24px;
  --space-lg: 36px;
  --space-xl: 48px;

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Transitions */
  --transition-quick: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Step 2: Copy same variables to dashboard.css and styles.css**

For styles.css, ADD temperature colors after status colors:

```css
  /* Temperature Colors (Saturated) */
  --temp-cold: #06B6D4;
  --temp-comfortable: #10B981;
  --temp-warm: #FF875C;
  --temp-hot: #EF4444;
```

**Step 3: Commit**

```bash
git add css/auth.css css/dashboard.css css/styles.css
git commit -m "feat: update CSS variables to Glass Premium palette"
```

---

### Task 2: Update Page Backgrounds & Remove Textures

**Files:**
- Modify: `css/auth.css` (body, bg-grid)
- Modify: `css/dashboard.css` (body, bg-grid)
- Modify: `css/styles.css` (body, bg-grid)
- Modify: `index.html` (remove grain-texture div)
- Modify: `dashboard.html` (remove grain-texture div)
- Modify: `device.html` (remove grain-texture div)

**Step 1: Update body background in auth.css**

Find `body` rule and update:

```css
body {
  margin: 0;
  font-family: var(--font-primary);
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-black);
  background: radial-gradient(circle at top left, #FFFFFF 0%, #F9FAFB 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 2: Remove .bg-grid styling from all CSS files**

Delete or comment out entire `.bg-grid` rule.

**Step 3: Remove grain-texture CSS from all files**

Delete or comment out `.grain-texture` rule.

**Step 4: Remove grain-texture divs from HTML files**

In index.html, dashboard.html, device.html, find and delete:
```html
<div class="grain-texture"></div>
```

**Step 5: Update body in dashboard.css and styles.css**

Apply same radial gradient background to both.

**Step 6: Commit**

```bash
git add css/ index.html dashboard.html device.html
git commit -m "feat: replace backgrounds with clean gradient, remove textures"
```

---

## Phase 2: Glassmorphism Cards

### Task 3: Add Glassmorphism to All Cards

**Files:**
- Modify: `css/auth.css` (.auth-card)
- Modify: `css/dashboard.css` (.device-card, .modal-card)
- Modify: `css/styles.css` (.card, .topbar)

**Step 1: Update .auth-card in auth.css**

```css
.auth-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: 48px 40px;
  box-shadow: var(--glass-shadow);
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateZ(0);
}

.auth-card:hover {
  box-shadow: var(--glass-shadow-hover);
}
```

**Step 2: Add glassmorphism fallback**

After .auth-card, add:

```css
@supports not (backdrop-filter: blur(12px)) {
  .auth-card {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

**Step 3: Update .card in styles.css**

```css
.card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-base);
  transform: translateZ(0);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glass-shadow-hover);
}
```

**Step 4: Update .device-card in dashboard.css**

```css
.device-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--glass-shadow);
  cursor: pointer;
  transition: all var(--transition-base);
  transform: translateZ(0);
}

.device-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--glass-shadow-hover);
}
```

**Step 5: Update .topbar in styles.css**

```css
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-xl);
  padding: 20px 28px;
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-md);
}
```

**Step 6: Commit**

```bash
git add css/auth.css css/dashboard.css css/styles.css
git commit -m "feat: add glassmorphism to all cards with backdrop-filter"
```

---

## Phase 3: Typography Update

### Task 4: Update Typography with Higher Contrast

**Files:**
- Modify: `css/auth.css` (h1, h2, body, subtitle)
- Modify: `css/dashboard.css` (h1, h2, body)
- Modify: `css/styles.css` (h1, body, card-title)

**Step 1: Update headings in auth.css**

```css
.auth-header h1 {
  margin: 0 0 10px;
  font-size: 36px;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--color-black);
}

.auth-form h2 {
  margin: 0 0 24px;
  font-size: 28px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--color-black);
}

.subtitle {
  margin: 0;
  color: var(--color-gray-500);
  font-size: 15px;
  line-height: 1.7;
}
```

**Step 2: Update temperature display in styles.css**

```css
.temp-display span:first-child {
  font-size: 64px;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--color-coral);
}

.temp-unit {
  font-size: 28px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-500);
}

@media (max-width: 768px) {
  .temp-display span:first-child {
    font-size: 56px;
  }
}
```

**Step 3: Update body text color in all files**

Change `color: var(--color-tierra)` to `color: var(--color-black)` in body rules.

**Step 4: Commit**

```bash
git add css/auth.css css/dashboard.css css/styles.css
git commit -m "feat: update typography with higher contrast and larger sizes"
```

---

## Phase 4: Button Redesign

### Task 5: Update Buttons with Coral Accent & Glow

**Files:**
- Modify: `css/auth.css` (.primary-btn, .secondary-btn)
- Modify: `css/dashboard.css` (.primary-btn, .secondary-btn)
- Modify: `css/styles.css` (.primary-btn, .secondary-btn, .icon-btn)

**Step 1: Update primary button**

```css
.primary-btn {
  padding: 14px 28px;
  background: var(--color-coral);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  box-shadow: var(--shadow-coral);
  transition: all var(--transition-quick);
}

.primary-btn:hover {
  background: var(--color-coral-hover);
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 135, 92, 0.5);
}

.primary-btn:active {
  transform: scale(0.97);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
```

**Step 2: Update secondary button**

```css
.secondary-btn {
  padding: 12px 26px;
  background: transparent;
  color: var(--color-coral);
  border: 2px solid var(--color-coral);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-quick);
}

.secondary-btn:hover {
  background: rgba(255, 135, 92, 0.08);
  transform: translateY(-2px);
}

.secondary-btn:active {
  transform: scale(0.97);
}
```

**Step 3: Update icon button in styles.css**

```css
.icon-btn {
  min-width: 48px;
  min-height: 48px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 135, 92, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-coral);
  font-size: 20px;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-quick);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
}
```

**Step 4: Apply to all three CSS files**

Repeat primary and secondary button styles in auth.css, dashboard.css, and styles.css.

**Step 5: Commit**

```bash
git add css/
git commit -m "feat: update buttons with coral accent and glow shadows"
```

---

## Phase 5: Input Fields

### Task 6: Update Inputs with Coral Focus & White Background

**Files:**
- Modify: `css/auth.css` (inputs, labels, errors)
- Modify: `css/dashboard.css` (inputs in modal)

**Step 1: Update input styles in auth.css**

```css
input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 14px 16px;
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 16px;
  color: var(--color-black);
  transition: all var(--transition-base);
}

input:focus,
select:focus {
  border-color: var(--color-coral);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 135, 92, 0.15);
}

input::placeholder {
  color: var(--color-gray-500);
}
```

**Step 2: Update label styles**

```css
label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-black);
}
```

**Step 3: Update error message**

```css
.error-message {
  background: rgba(239, 68, 68, 0.08);
  border-left: 4px solid var(--color-error);
  color: var(--color-error);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  line-height: 1.5;
  margin: 16px 0;
}
```

**Step 4: Apply to dashboard.css modal inputs**

Copy same input styles to dashboard.css.

**Step 5: Commit**

```bash
git add css/auth.css css/dashboard.css
git commit -m "feat: update inputs with white background and coral focus glow"
```

---

## Phase 6: Temperature Slider

### Task 7: Redesign Temperature Slider with Large Thumb & Glow

**Files:**
- Modify: `css/styles.css` (slider track, thumb, tooltip)

**Step 1: Update slider track**

```css
input[type="range"] {
  width: 100%;
  height: 6px;
  background: var(--color-gray-200);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}
```

**Step 2: Update slider thumb (webkit)**

```css
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 48px;
  height: 48px;
  background: var(--color-white);
  border: 3px solid var(--color-coral);
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 8px 20px rgba(255, 135, 92, 0.4);
  transition: all var(--transition-quick);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 10px 30px rgba(255, 135, 92, 0.6);
}

input[type="range"]::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}
```

**Step 3: Update slider thumb (firefox)**

```css
input[type="range"]::-moz-range-thumb {
  width: 48px;
  height: 48px;
  background: var(--color-white);
  border: 3px solid var(--color-coral);
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 8px 20px rgba(255, 135, 92, 0.4);
  transition: all var(--transition-quick);
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 10px 30px rgba(255, 135, 92, 0.6);
}

input[type="range"]::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}
```

**Step 4: Update tooltip**

```css
.range-tooltip {
  position: absolute;
  top: -48px;
  background: var(--color-black);
  color: var(--color-white);
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateX(-50%);
  pointer-events: none;
}

.range-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-black);
}
```

**Step 5: Commit**

```bash
git add css/styles.css
git commit -m "feat: redesign temperature slider with large thumb and glow"
```

---

## Phase 7: Relay Card & Status

### Task 8: Update Relay Card with Coral Glow ON State

**Files:**
- Modify: `css/styles.css` (.relay-card, .relay-icon, .relay-state)

**Step 1: Update relay card base**

```css
.card.relay {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px;
  transition: all var(--transition-base);
}
```

**Step 2: Update relay icon**

```css
.relay-icon {
  font-size: 36px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(107, 114, 128, 0.1);
  color: var(--color-gray-500);
  transition: all var(--transition-base);
}
```

**Step 3: Update relay ON state**

```css
.card.relay.active {
  background: rgba(255, 135, 92, 0.12);
  border-left: 4px solid var(--color-coral);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 40px rgba(255, 135, 92, 0.15);
}

.card.relay.active .relay-icon {
  background: rgba(255, 135, 92, 0.15);
  color: var(--color-coral);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card.relay.active .relay-state {
  color: var(--color-coral);
  font-weight: var(--font-weight-bold);
}
```

**Step 4: Update status dot**

```css
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-gray-500);
}

.status-dot.online {
  background: var(--color-success);
  box-shadow: var(--shadow-green);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.6); }
  50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
}
```

**Step 5: Commit**

```bash
git add css/styles.css
git commit -m "feat: update relay card with coral glow and pulse animation"
```

---

## Phase 8: Tabs & Switch

### Task 9: Update Tabs and Switch with Coral Active State

**Files:**
- Modify: `css/styles.css` (.tabs, .tab, .switch)

**Step 1: Update tabs container**

```css
.tabs {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px;
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-lg);
}
```

**Step 2: Update tab styles**

```css
.tab {
  flex: 1;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-family: var(--font-primary);
  font-size: 15px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-500);
  cursor: pointer;
  transition: all var(--transition-quick);
}

.tab.active {
  background: var(--color-coral);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 4px 12px rgba(255, 135, 92, 0.4);
}

.tab:hover:not(.active) {
  background: rgba(255, 135, 92, 0.08);
  color: var(--color-coral);
}
```

**Step 3: Update switch toggle**

```css
.switch {
  position: relative;
  width: 52px;
  height: 30px;
}

.switch .slider {
  position: absolute;
  inset: 0;
  background: var(--color-gray-200);
  border-radius: 15px;
  cursor: pointer;
  transition: background var(--transition-base);
}

.switch input:checked + .slider {
  background: var(--color-coral);
}

.switch .slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 3px;
  bottom: 3px;
  background: var(--color-white);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform var(--transition-base) cubic-bezier(0.4, 0, 0.2, 1);
}

.switch input:checked + .slider:before {
  transform: translateX(22px);
}
```

**Step 4: Commit**

```bash
git add css/styles.css
git commit -m "feat: update tabs and switch with coral active states"
```

---

## Phase 9: Modal & Overlays

### Task 10: Update Modal with Enhanced Glassmorphism

**Files:**
- Modify: `css/dashboard.css` (.modal, .modal-card)
- Modify: `css/styles.css` (.modal, .modal-card)

**Step 1: Update modal overlay**

```css
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal.active {
  display: flex;
}
```

**Step 2: Update modal card**

```css
.modal-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
  animation: modalAppear 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

**Step 3: Add mobile slide-up animation**

```css
@media (max-width: 768px) {
  .modal-card {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: none;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    padding: 32px 24px;
    animation: modalSlideUp 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modalSlideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
```

**Step 4: Apply to both dashboard.css and styles.css**

Copy modal styles to both files.

**Step 5: Commit**

```bash
git add css/dashboard.css css/styles.css
git commit -m "feat: update modal with enhanced glassmorphism and animations"
```

---

## Phase 10: Polish & Accessibility

### Task 11: Add Focus States and Reduced Motion

**Files:**
- Modify: `css/auth.css`
- Modify: `css/dashboard.css`
- Modify: `css/styles.css`

**Step 1: Add global focus-visible styles to all files**

Add after `:root`:

```css
/* Accessibility - Focus States */
*:focus-visible {
  outline: 3px solid var(--color-coral);
  outline-offset: 2px;
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  box-shadow: 0 0 0 3px rgba(255, 135, 92, 0.15);
}
```

**Step 2: Add reduced motion support to all files**

Add at end of each CSS file:

```css
/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 3: Commit**

```bash
git add css/
git commit -m "feat: add focus states and reduced motion support"
```

---

## Phase 11: Responsive Adjustments

### Task 12: Fine-tune Mobile Responsiveness

**Files:**
- Modify: `css/styles.css` (media queries)
- Modify: `css/dashboard.css` (media queries)

**Step 1: Update mobile media queries in styles.css**

Add/update:

```css
@media (max-width: 768px) {
  .app {
    padding: 32px 20px 48px;
  }

  .card {
    padding: 24px;
  }

  .temp-display span:first-child {
    font-size: 56px;
  }

  .topbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  /* Reduce glassmorphism blur slightly for performance */
  .card {
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
  }
}
```

**Step 2: Update dashboard grid for mobile**

```css
@media (max-width: 768px) {
  .devices-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

**Step 3: Commit**

```bash
git add css/styles.css css/dashboard.css
git commit -m "feat: fine-tune mobile responsiveness and performance"
```

---

## Phase 12: Final Verification

### Task 13: Test and Push to GitHub

**Files:**
- None (testing and deployment)

**Step 1: Visual verification**

Open each page in browser:
- [ ] index.html - Check glassmorphism, coral buttons, white inputs
- [ ] dashboard.html - Check device cards have glass effect
- [ ] device.html - Check slider, relay card, temperature display

**Step 2: Responsive test**

Test at:
- [ ] 375px (mobile)
- [ ] 768px (tablet)
- [ ] 1024px (desktop)

Verify:
- [ ] Glassmorphism visible on all sizes
- [ ] Modal slides from bottom on mobile
- [ ] All text readable
- [ ] Touch targets 48x48px minimum

**Step 3: Accessibility test**

- [ ] Tab through all interactive elements
- [ ] Focus rings visible with coral color
- [ ] Test with reduced motion enabled

**Step 4: Performance check**

- [ ] No jank during animations
- [ ] Page loads in <2s
- [ ] Hover states responsive

**Step 5: Push to GitHub**

```bash
git push origin main
```

**Step 6: Verify GitHub Pages**

- Wait 2 minutes for rebuild
- Visit: `https://abreawi.github.io/esp32-thermostat-frontend/`
- Hard refresh: `Ctrl + Shift + R`

---

## Implementation Complete

**Summary of Changes:**
- ✅ Replaced Nature Distilled with Glass Premium palette
- ✅ Added glassmorphism with backdrop-filter to all cards
- ✅ Updated to coral #FF875C accent throughout
- ✅ Increased spacing by 40-50%
- ✅ Enhanced shadows and glow effects
- ✅ Redesigned slider with large white thumb + coral border
- ✅ Updated relay card with coral glow when ON
- ✅ Removed grain texture and grid pattern
- ✅ Pure white backgrounds with gradient
- ✅ Enhanced typography with higher contrast
- ✅ Added focus states and accessibility features
- ✅ Mobile-optimized with slide-up modals

**Total Commits:** 13 atomic commits
**Files Modified:** 6 (3 CSS + 3 HTML)
**Estimated Time:** 2-3 hours

**Visual Result:**
- High contrast, vibrant design
- Professional glassmorphism effects
- Coral accent creates energy
- Clean, modern, "wow factor"
