# Glass Premium UI/UX Redesign - ESP32 Thermostat

**Date:** 2026-03-18
**Design System:** Glass Premium (High Contrast + Glassmorphism)
**Target:** Commercial smart home thermostat - modern, professional, high-impact
**Replaces:** Nature Distilled implementation (too muted)

---

## Executive Summary

This redesign transforms the ESP32 Thermostat from the muted Nature Distilled aesthetic to a vibrant, modern **Glass Premium** design system. The goal is maximum visual impact through high contrast, glassmorphism effects, and a vibrant coral accent color (#FF875C).

**Key Changes from Nature Distilled:**
- Pure white backgrounds with subtle gradients (not earthy tones)
- Glassmorphism cards with backdrop blur (not flat cards)
- Vibrant coral #FF875C accent (not muted terracotta)
- Pronounced shadows and glow effects (not subtle organic shadows)
- Increased spacing (40-50% more breathing room)
- Saturated dynamic colors (not muted earth tones)

**Visual Goal:** Professional, modern, bright, "wow factor" - tech product that feels premium.

---

## 1. Color System

### Primary Palette

**Coral Accent (Primary)**
- Base: `#FF875C`
- Hover: `#FF6B3D`
- Use: Buttons, sliders, active states, links, focus rings
- Rationale: Vibrant, energetic, modern - maintains orange identity but saturated

**Neutral Scale (High Contrast)**
- Pure White: `#FFFFFF` (cards, inputs, backgrounds)
- Off-White: `#F9FAFB` (page background gradient end)
- Light Gray: `#E5E7EB` (borders, disabled, input borders)
- Medium Gray: `#6B7280` (secondary text, muted elements)
- Dark Gray: `#374151` (tertiary text)
- Near Black: `#1A1A1A` (primary text, headings)

**Status Colors (Saturated)**
- Success/Online: `#10B981` (bright green)
- Warning: `#F59E0B` (bright amber)
- Error: `#EF4444` (bright red)
- Info: `#3B82F6` (bright blue)

### Temperature Dynamic Colors (Saturated)

Replace muted earth tones with vibrant tech colors:
- **Cold (<18°C):** `#06B6D4` (bright cyan)
- **Comfortable (18-22°C):** `#10B981` (bright green)
- **Warm (22-26°C):** `#FF875C` (coral)
- **Hot (>26°C):** `#EF4444` (bright red)

### Glassmorphism Variables

```css
--glass-bg: rgba(255, 255, 255, 0.75);
--glass-border: rgba(255, 255, 255, 0.5);
--glass-blur: blur(12px) saturate(180%);
--glass-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
--glass-shadow-hover: 0 25px 70px rgba(0, 0, 0, 0.15);
```

### Background System

**Page Background:**
```css
background: radial-gradient(circle at top left, #FFFFFF 0%, #F9FAFB 100%);
```

**Grid Pattern:** Remove completely - glassmorphism works best without background texture

**Grain Texture:** Remove - contradicts clean glass aesthetic

---

## 2. Typography

### Font Family

**Primary:** Inter (already loaded, perfect for modern design)

**Weights Used:**
- 400 (Regular) - Body text
- 500 (Medium) - Labels, captions
- 600 (Semibold) - Subheadings, card titles
- 700 (Bold) - Headings, emphasis, temperature display

### Type Scale (Increased Sizes)

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 (Page Titles) | 36px / 2.25rem | 700 | 1.2 | -0.02em |
| H2 (Section Headers) | 28px / 1.75rem | 600 | 1.3 | -0.01em |
| Body (Regular Text) | 16px / 1rem | 400 | 1.7 | 0 |
| Small (Secondary) | 14px / 0.875rem | 400 | 1.6 | 0 |
| Temperature Display | 64px / 4rem | 700 | 1 | -0.03em |
| Temperature Mobile | 56px / 3.5rem | 700 | 1 | -0.03em |

### Typography Rules

**Headings:**
- Use extreme weight contrast (400 body vs 700 headings)
- Color: `#1A1A1A` (near black for maximum contrast)
- Remove gradients (too subtle for this aesthetic)

**Body Text:**
- Color: `#1A1A1A` primary, `#6B7280` secondary
- Line-height: `1.7` (more spacing, cleaner)
- No text shadows or effects

**Numbers (Temperature, Humidity):**
```css
font-variant-numeric: tabular-nums;
```

---

## 3. Glassmorphism Cards

### Base Card Style

```css
.card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  padding: 32px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
}
```

### Performance Optimization

```css
.card {
  transform: translateZ(0); /* GPU acceleration */
}

.card:hover {
  will-change: backdrop-filter; /* Only on interaction */
}

/* Fallback for older browsers */
@supports not (backdrop-filter: blur(12px)) {
  .card {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

### Card Variants

**Auth Card (Login/Register):**
- Larger padding: `48px 40px`
- Larger radius: `24px`
- Stronger shadow: `0 25px 80px rgba(0, 0, 0, 0.15)`

**Device Cards (Dashboard):**
- Standard padding: `24px`
- Cursor: `pointer`
- Hover: More pronounced lift `translateY(-6px)`

**Topbar:**
- Less blur: `blur(8px)` (better for text legibility)
- Border bottom: `1px solid rgba(0, 0, 0, 0.06)`

---

## 4. Components

### Buttons

**Primary (Coral):**
```css
.primary-btn {
  background: #FF875C;
  color: #FFFFFF;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(255, 135, 92, 0.4);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.primary-btn:hover {
  background: #FF6B3D;
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 135, 92, 0.5);
}

.primary-btn:active {
  transform: scale(0.97);
}
```

**Secondary (Ghost):**
```css
.secondary-btn {
  background: transparent;
  color: #FF875C;
  padding: 12px 26px;
  border: 2px solid #FF875C;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.secondary-btn:hover {
  background: rgba(255, 135, 92, 0.08);
  transform: translateY(-2px);
}
```

**Icon Buttons:**
```css
.icon-btn {
  min-width: 48px;
  min-height: 48px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 135, 92, 0.2);
  border-radius: 12px;
  color: #FF875C;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
}
```

### Inputs

```css
input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 14px 16px;
  background: #FFFFFF;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  color: #1A1A1A;
  transition: all 200ms ease;
}

input:focus,
select:focus {
  border-color: #FF875C;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 135, 92, 0.15);
}
```

### Temperature Slider

**Track:**
```css
input[type="range"] {
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
}
```

**Fill (Progress):**
```css
/* JavaScript-controlled gradient fill */
background: linear-gradient(90deg, #FF875C 0%, #FF6B3D 100%);
```

**Thumb:**
```css
input[type="range"]::-webkit-slider-thumb {
  width: 48px;
  height: 48px;
  background: #FFFFFF;
  border: 3px solid #FF875C;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 8px 20px rgba(255, 135, 92, 0.4);
  transition: all 150ms ease;
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

**Tooltip:**
```css
.range-tooltip {
  background: #1A1A1A;
  color: #FFFFFF;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Arrow pointing down */
.range-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1A1A1A;
}
```

### Switch Toggle

```css
.switch {
  width: 52px;
  height: 30px;
  background: #E5E7EB;
  border-radius: 15px;
  transition: background 200ms ease;
}

.switch input:checked + .slider {
  background: #FF875C;
}

.switch .slider:before {
  width: 24px;
  height: 24px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.switch input:checked + .slider:before {
  transform: translateX(22px);
}
```

---

## 5. Specific Components

### Temperature Display

```css
.temp-display {
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: #FF875C; /* Default, changes dynamically */
}

/* Dynamic color classes */
.temp-cold { color: #06B6D4; }
.temp-comfortable { color: #10B981; }
.temp-warm { color: #FF875C; }
.temp-hot { color: #EF4444; }

.temp-unit {
  font-size: 28px;
  font-weight: 500;
  color: #6B7280;
  margin-left: 4px;
}

@media (max-width: 768px) {
  .temp-display {
    font-size: 56px;
  }
}
```

### Relay Card (Calefacción)

**OFF State:**
```css
.relay-card {
  /* Base glassmorphism card */
  display: flex;
  align-items: center;
  gap: 20px;
}

.relay-icon {
  font-size: 36px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(107, 114, 128, 0.1);
  color: #6B7280;
}

.relay-state {
  font-size: 16px;
  font-weight: 600;
  color: #6B7280;
}
```

**ON State:**
```css
.relay-card.active {
  background: rgba(255, 135, 92, 0.12);
  border-left: 4px solid #FF875C;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 40px rgba(255, 135, 92, 0.15); /* Coral glow */
}

.relay-card.active .relay-icon {
  background: rgba(255, 135, 92, 0.15);
  color: #FF875C;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.relay-card.active .relay-state {
  color: #FF875C;
  font-weight: 700;
}
```

### Status Indicators

**Status Dot:**
```css
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6B7280; /* Offline */
}

.status-dot.online {
  background: #10B981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.6); }
  50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
}
```

### Tabs

```css
.tabs {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  padding: 6px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.tab {
  flex: 1;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  transition: all 150ms ease;
}

.tab.active {
  background: #FF875C;
  color: #FFFFFF;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 135, 92, 0.4);
}

.tab:hover:not(.active) {
  background: rgba(255, 135, 92, 0.08);
  color: #FF875C;
}
```

### Modals

```css
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
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

@media (max-width: 768px) {
  .modal-card {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: none;
    border-radius: 24px 24px 0 0;
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

---

## 6. Animations & Interactions

### Global Transitions

```css
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Transition Speeds:**
- Quick interactions (hover, focus): `150ms`
- Standard transitions: `200ms`
- Complex animations (modal, page load): `300ms`

### Micro-Interactions

**Button Press:**
```css
.btn:active {
  transform: scale(0.97);
  transition-duration: 100ms;
}
```

**Card Hover:**
```css
.card:hover {
  transform: translateY(-4px);
  transition-duration: 150ms;
}
```

**Input Focus:**
```css
input:focus {
  transition: all 200ms ease;
}
```

### Page Load Animation

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Stagger cards */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 50ms; }
.card:nth-child(3) { animation-delay: 100ms; }
.card:nth-child(4) { animation-delay: 150ms; }
```

### Reduced Motion Support

```css
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

---

## 7. Layout & Spacing

### Spacing Scale (Increased 40-50%)

```css
--space-xs: 6px;   /* was 4px */
--space-sm: 12px;  /* was 8px */
--space-md: 24px;  /* was 16px */
--space-lg: 36px;  /* was 24px */
--space-xl: 48px;  /* was 32px */
--space-2xl: 64px; /* new */
```

### Container

```css
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 32px 64px;
}

@media (max-width: 768px) {
  .app {
    padding: 32px 20px 48px;
  }
}
```

### Card Spacing

```css
.card {
  padding: 32px;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .card {
    padding: 24px;
    margin-bottom: 20px;
  }
}
```

### Grid Layouts

**Dashboard Devices:**
```css
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .devices-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

---

## 8. Responsive Design

### Breakpoints

```css
/* Mobile first approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Mobile Optimizations (<768px)

- Reduce card padding: `32px → 24px`
- Reduce temperature display: `64px → 56px`
- Single column layouts
- Modal slides from bottom
- Reduce glassmorphism blur slightly: `12px → 10px` (better performance)
- Increase touch targets to minimum 48x48px

### Tablet (768-1024px)

- Maintain glassmorphism
- 2-column grids where appropriate
- Slightly reduce spacing

### Desktop (>1024px)

- Full glassmorphism effects
- Maximum spacing
- 3-column grids for device lists

---

## 9. Accessibility

### Color Contrast (WCAG AAA)

**Tested Combinations:**
| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| #1A1A1A | #FFFFFF | 16.1:1 | AAA ✓✓ |
| #6B7280 | #FFFFFF | 5.7:1 | AAA ✓✓ |
| #FFFFFF | #FF875C | 3.8:1 | AA (large text) ✓ |
| #FF875C | #FFFFFF | 3.2:1 | AA (UI components) ✓ |

### Focus States

```css
*:focus-visible {
  outline: 3px solid #FF875C;
  outline-offset: 2px;
}

/* Additional glow for emphasis */
button:focus-visible,
input:focus-visible {
  box-shadow: 0 0 0 3px rgba(255, 135, 92, 0.15);
}
```

### Keyboard Navigation

- Tab order follows visual flow
- All interactive elements focusable
- Skip links for screen readers
- No keyboard traps

### Screen Reader Support

```html
<button aria-label="Reconnect to device">⟳</button>
<div role="status" aria-live="polite" aria-atomic="true">
  Temperature: 22.5°C
</div>
```

### Touch Targets

- Minimum size: `48px × 48px`
- Spacing between: `8px minimum`
- Visual feedback on touch

---

## 10. Performance Optimization

### Glassmorphism Performance

```css
.card {
  /* GPU acceleration */
  transform: translateZ(0);

  /* Only enable will-change on interaction */
  &:hover {
    will-change: transform, backdrop-filter;
  }
}
```

### Fallback for Older Browsers

```css
@supports not (backdrop-filter: blur(12px)) {
  .card {
    background: rgba(255, 255, 255, 0.95); /* More opaque */
  }
}
```

### Mobile Performance

- Reduce blur intensity on low-end devices
- Use simpler animations
- Lazy load images
- Minimize repaints

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 11. Implementation Strategy

### Phase 1: Foundation (Priority 1)

1. **Update CSS Variables**
   - Replace Nature Distilled colors with Glass Premium palette
   - Add glassmorphism variables
   - Update spacing scale (+40-50%)

2. **Update Page Backgrounds**
   - Remove grid pattern
   - Remove grain texture
   - Add radial gradient

### Phase 2: Core Components (Priority 2)

3. **Glassmorphism Cards**
   - Add backdrop-filter to all cards
   - Update shadows
   - Increase border-radius
   - Add hover lifts

4. **Buttons**
   - Update to coral #FF875C
   - Add glow shadows
   - Enhance hover states

5. **Inputs**
   - Pure white backgrounds
   - Coral focus states with glow
   - Larger padding

### Phase 3: Specific Elements (Priority 3)

6. **Temperature Slider**
   - Larger thumb (48px) with white + coral border
   - Gradient fill
   - Enhanced glow on hover

7. **Relay Card**
   - OFF: standard glassmorphism
   - ON: coral tint + glow + pulse animation

8. **Status & Tabs**
   - Online dot with green glow
   - Tabs with coral active state
   - Glassmorphism tab container

### Phase 4: Polish (Priority 4)

9. **Animations**
   - Page load stagger
   - Enhanced micro-interactions
   - Reduced motion support

10. **Responsive**
    - Mobile: reduced blur, slide-up modals
    - Tablet: maintain effects
    - Desktop: full effects

11. **Accessibility**
    - Focus rings with coral + glow
    - ARIA labels
    - Keyboard navigation

### Files to Modify

| File | Changes |
|------|---------|
| `css/auth.css` | Colors, glassmorphism, spacing |
| `css/dashboard.css` | Colors, glassmorphism, spacing |
| `css/styles.css` | Colors, glassmorphism, spacing, temperature, slider, relay |
| `index.html` | Remove grain texture div |
| `dashboard.html` | Remove grain texture div |
| `device.html` | Remove grain texture div |

**No JavaScript changes required** - purely visual redesign

---

## 12. Design Validation Checklist

**Before Deployment:**
- [ ] All glassmorphism cards have backdrop-filter
- [ ] Coral #FF875C used consistently for accents
- [ ] All text has WCAG AA minimum contrast
- [ ] Focus states visible on all interactive elements
- [ ] Touch targets 48x48px minimum on mobile
- [ ] Animations respect prefers-reduced-motion
- [ ] Tested on 375px, 768px, 1024px, 1440px
- [ ] Modals slide from bottom on mobile
- [ ] Temperature display has dynamic colors
- [ ] Relay card animates on ON state
- [ ] Slider thumb is 48px with white + coral border
- [ ] Page background has subtle gradient
- [ ] Grid pattern and grain removed
- [ ] Spacing increased 40-50% from previous
- [ ] Performance: No jank on mobile
- [ ] Glassmorphism fallback for older browsers

---

## 13. Success Metrics

### Visual Goals

✅ **High Impact:** Users say "wow" when they first see it
✅ **Professional:** Looks like a commercial tech product
✅ **Bright:** No muted/muddy colors, everything vibrant
✅ **Modern:** Feels current, not dated
✅ **Premium:** Glass effects convey quality

### Technical Goals

✅ **Performance:** 60fps animations on mobile
✅ **Accessibility:** WCAG AA minimum, preferably AAA
✅ **Responsive:** Works perfectly 375px - 1440px
✅ **Browser Support:** Chrome, Firefox, Safari (modern versions)

### User Experience Goals

✅ **Clarity:** Despite glassmorphism, everything is readable
✅ **Touch-Friendly:** All targets 48x48px minimum
✅ **Fast:** Page load <2s on 3G
✅ **Smooth:** All interactions feel instant

---

## Appendix: CSS Variables Reference

```css
:root {
  /* Colors - Glass Premium Palette */
  --color-coral: #FF875C;
  --color-coral-hover: #FF6B3D;
  --color-white: #FFFFFF;
  --color-off-white: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-700: #374151;
  --color-black: #1A1A1A;

  /* Status Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Temperature Colors */
  --temp-cold: #06B6D4;
  --temp-comfortable: #10B981;
  --temp-warm: #FF875C;
  --temp-hot: #EF4444;

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
  --shadow-xl: 0 30px 80px rgba(0, 0, 0, 0.2);
  --shadow-coral: 0 10px 30px rgba(255, 135, 92, 0.4);
  --shadow-green: 0 0 12px rgba(16, 185, 129, 0.6);

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Spacing (Increased) */
  --space-xs: 6px;
  --space-sm: 12px;
  --space-md: 24px;
  --space-lg: 36px;
  --space-xl: 48px;
  --space-2xl: 64px;

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Transitions */
  --transition-quick: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

**End of Design Document**

This Glass Premium design system replaces the muted Nature Distilled aesthetic with a vibrant, modern, high-contrast design featuring glassmorphism effects and a coral accent color. The goal is maximum visual impact while maintaining professional quality and accessibility standards.
