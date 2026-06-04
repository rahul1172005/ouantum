# Ouantum CRM Design System — Master Zoho Raised Panel Card Specifications

This document defines the absolute visual standards, CSS rules, component guidelines, and layout requirements for the **Ouantum CRM Viewports and Workspaces**. To guarantee 100% design consistency, all components, widgets, and panels in the system must strictly follow these rules.

---

## 1. Core Visual Philosophy: The Zoho Raised Card Standard

All workspace containers, panels, dashboard blocks, and control widgets must use the **Zoho Raised Panel Card (`.zoho-card`)** standard. Every card must be perfectly balanced, closed on all sides, and spacious.

### 🚫 Explicit Design Bans (Zero-Tolerance)
* **No Solid Black Borders**: Never use raw thick black outlines (`border-2 border-black`, `border-black`, or custom style overrides).
* **No Flat Hard Shadows**: Never use aggressive retro/neo-brutalist hard drop shadows (such as `shadow-[2px_2px_0px_rgba(0,0,0,1)]`).
* **No Spacing Collisions**: Content must never be crowded or touch the borders of the card or container. Keep a safety margin.
* **No Ad-hoc Spacing**: All widgets must reside inside structural Zoho Card layers rather than floating loose on the page.

### 🎨 Harmonious Color Tokens
* **Card Border**: Lighter, elegant grey (`#d4d4d4` / `1px solid`).
* **Card Body Background**: Pure white (`#ffffff`).
* **Header Bevel**: Classic Zoho light-grey bevel (`linear-gradient(180deg, #fbfbfb 0%, #ececec 100%)`).
* **Footer Background**: Light instruction grey (`#f4f5f6`).
* **Accent & Font Colors**: Strictly monochrome and deep-gray slate. Avoid raw primary greens, blues, or oranges for styling unless representing explicit alert states.

---

## 2. Standard Zoho Card Structure (`.zoho-card`)

A compliant Zoho Card consists of three distinct layers: a Header, a Body, and a Footer. This layout must be used to keep cards **properly closed** and readable.

```html
<div class="zoho-card flex flex-col">
  <!-- 1. Header (Beveled Gray Title Bar) -->
  <div class="zoho-card-header">
    <Icon className="w-4 h-4 text-gray-700 flex-shrink-0" />
    <span class="font-bold text-gray-800 text-[10.5px] uppercase tracking-wide">CARD TITLE</span>
    <div class="ml-auto"><!-- Optional Header Widgets/Badges --></div>
  </div>

  <!-- 2. Body (Pure White High-Density Container) -->
  <div class="zoho-card-body space-y-4">
    <!-- Dropdowns, range inputs, visualizations, or tables -->
  </div>

  <!-- 3. Footer (Light-Grey Help/Status Bar) -->
  <div class="zoho-card-footer">
    <span class="text-gray-500 font-semibold text-[9px] uppercase tracking-normal">
      Click highlighted items to view real-time data logs
    </span>
  </div>
</div>
```

### Component Guidelines:
1. **Header (`.zoho-card-header`)**:
   * Must have a height of `42px`, align items vertically center, and draw a thin `#c8c8c8` bottom border.
   * Text must be bold, sans-serif (Segoe UI / Tahoma), uppercase, and tracked.
2. **Body (`.zoho-card-body`)**:
   * Must feature `padding: 18px !important` to ensure ample spacing for content without covering borders.
   * Background must be pure white `#ffffff`.
3. **Footer (`.zoho-card-footer`)**:
   * Must have a height of `38px` with a thin `#d4d4d4` top border and `#f4f5f6` background.
   * Muted, descriptive instructions or status logs must reside here to guide user interaction.

---

## 3. High-Density Tables & Interactive Data Lists

To match the Zoho spreadsheet grid aesthetic, all tables inside Zoho Cards must comply with the following:
* **Zero Vertical Borders**: Strip all vertical border dividers between column headers and table cells (`border-right: none !important` or `border-r-0`).
* **Horizontal Row Dividers**: Separate entries using simple thin horizontal lines (`border-b border-[#e0e0e0]`).
* **Typewriter Typography**: Technical values, metrics, and logs must use a clean, legible monospace typewriter font (`font-mono` mapped to `Courier New`).
* **Selected State Highlights**: Use very light gray-blue backgrounds (`bg-[#f0f6ff]`) to demarcate active selections or high-variance items.

---

## 4. Premium Skeuomorphic Buttons & Form Controls

Never use flat color fills or harsh borders on buttons and inputs.
* **Tactile Buttons (`.btn-skeuo`)**: 
  * Off-white raised bevels: `linear-gradient(to bottom, #fdfdfd, #eaeaea)` with a `#b5b5b5` border.
* **Tactile Dark Buttons (`.btn-skeuo-dark`)**:
  * Rich dark grey/black gradients with white text and text shadows: `linear-gradient(to bottom, #3d3d3d, #222222)`.
* **Form Dropdowns and Inputs**:
  * Always use a light inner shadow (`box-shadow: inset 0 1px 2px rgba(0,0,0,0.05)`) with Segoe UI typography and a fine `#c8c8c8` border. On focus, outline to a solid `#000000`.

---

## 5. Development Checklist for Visual Consistency

When creating or modifying any workspace or dashboard section, you must audit against this checklist:
- [ ] Is the entire section encapsulated inside a `.zoho-card` panel structure?
- [ ] Are solid black borders (`border-black`, `border-2 border-black`) and brutalist drop shadows (`shadow-[2px_2px_0px_rgba(0,0,0,1)]`) completely eliminated?
- [ ] Does the card feature a light-grey beveled header (`.zoho-card-header`) and instruction footer (`.zoho-card-footer`)?
- [ ] Do all data lists and tables omit vertical dividers and leverage horizontal lines only?
- [ ] Is monospace styling (`font-mono`) preserved for math formulas, telemetry logs, and coordinates?
