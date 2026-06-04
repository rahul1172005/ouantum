# Ouantum CRM — Design System & Complete Fix Guide

> **Standard:** Corporate-grade, benchmarked against AWS Console and Zoho CRM  
> **Stack:** Next.js (App Router) + Tailwind CSS  
> **Last updated:** June 2026

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System — Tokens](#2-color-system--tokens)
3. [Typography Scale](#3-typography-scale)
4. [Spacing & Grid](#4-spacing--grid)
5. [Core Component: ZohoCard](#5-core-component-zohocard)
6. [Navigation Architecture](#6-navigation-architecture)
7. [Top Header Bar](#7-top-header-bar)
8. [Dashboard & KPI Panels](#8-dashboard--kpi-panels)
9. [Tables](#9-tables)
10. [Forms & Inputs](#10-forms--inputs)
11. [Buttons](#11-buttons)
12. [Empty States](#12-empty-states)
13. [Breadcrumbs](#13-breadcrumbs)
14. [Notification System](#14-notification-system)
15. [What to Delete — Zero-Tolerance Violations](#15-what-to-delete--zero-tolerance-violations)
16. [Tailwind Config (Full)](#16-tailwind-config-full)
17. [Shared Component Library Checklist](#17-shared-component-library-checklist)
18. [Page Layout Template](#18-page-layout-template)
19. [Fix Priority Order](#19-fix-priority-order)

---

## 1. Design Philosophy

Ouantum CRM follows the **Zoho Raised Panel Card Standard** as its base visual language, elevated with the structural clarity of AWS Console's information architecture.

### Core Principles

| Principle | Rule |
|-----------|------|
| **Structure first** | Navigation and hierarchy before decoration |
| **Density with clarity** | High-information density is good; crowding is not |
| **Monochrome base** | No bright accent colors except for explicit semantic states |
| **Card containment** | All content lives inside a ZohoCard — nothing floats loose |
| **Data legibility** | Monospace for numbers, metrics, IDs, timestamps |
| **One primary action** | Every screen has exactly one primary CTA |

### What This System Is NOT

- Not flat minimal (Notion style)
- Not neo-brutalist (bold black borders)
- Not dark-mode-first
- Not a marketing UI — this is a data-entry and data-reading tool

---

## 2. Color System — Tokens

Add these to `tailwind.config.js` under `theme.extend.colors`. **Never use raw hex in components.**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // --- Surface tokens ---
        surface: {
          page:   '#f0f1f3',   // App background (like AWS console bg)
          body:   '#ffffff',   // Card body
          header: '#f5f5f5',   // Card header bevel (light grey)
          footer: '#f4f5f6',   // Card footer / status bar
          hover:  '#f0f6ff',   // Row hover, selection highlight
          input:  '#ffffff',   // Form inputs
        },
        // --- Border tokens ---
        border: {
          default: '#d4d4d4',  // Standard card border
          header:  '#c8c8c8',  // Card header bottom line
          input:   '#c8c8c8',  // Input border
          focus:   '#000000',  // Input focus ring
          hover:   '#b0b0b0',  // Elevated hover state
          error:   '#d93025',  // Error state
          success: '#1e7e34',  // Success state
        },
        // --- Text tokens ---
        text: {
          primary:   '#1a1a1a',  // Body, headings
          secondary: '#555555',  // Labels, captions
          muted:     '#888888',  // Hints, placeholders
          link:      '#0073e6',  // Links, primary actions
          danger:    '#c62828',  // Error text
          success:   '#2e7d32',  // Success text
          warning:   '#e65100',  // Warning text
        },
        // --- Semantic state tokens ---
        state: {
          error:   '#fdecea',  // Error background
          warning: '#fff8e1',  // Warning background
          success: '#e8f5e9',  // Success background
          info:    '#e3f2fd',  // Info background
        },
        // --- Button tokens ---
        btn: {
          primary:      '#0073e6',  // Primary fill
          'primary-hv': '#005bb5',  // Primary hover
          danger:       '#d32f2f',  // Destructive fill
          'danger-hv':  '#b71c1c',  // Destructive hover
        },
      },
    },
  },
}
```

### Semantic Color Usage Rules

| Context | Color Token | Never Use |
|---------|-------------|-----------|
| Active nav item bg | `surface.hover` | Raw blue fills |
| Row hover | `surface.hover` | Yellow, green |
| Error input border | `border.error` | `border-red-500` |
| Primary button | `btn.primary` | `bg-blue-500` |
| Card border | `border.default` | `border-black`, `border-2` |
| Card header bg | `surface.header` | `bg-gray-200` |
| Page background | `surface.page` | `bg-gray-100` |

---

## 3. Typography Scale

**Only 4 levels. Nothing else is allowed.**

```css
/* globals.css or tailwind layer */
@layer base {
  body {
    font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #1a1a1a;
  }
}
```

| Level | Size | Weight | Usage | Tailwind Class |
|-------|------|--------|-------|----------------|
| Page Title | 18px | 500 | Module heading (Contacts, Pipeline) | `text-[18px] font-medium` |
| Section Header | 13px | 600 | Card headers, table column heads — UPPERCASE + tracked | `text-[13px] font-semibold uppercase tracking-wide` |
| Body | 13px | 400 | Table cells, form values, descriptions | `text-[13px] font-normal` |
| Caption / Hint | 12px | 400 | Card footers, placeholder help text, timestamps | `text-[12px] font-normal text-text-muted` |

**Monospace rule:** Apply `font-mono text-[13px]` to:
- All numeric metric values
- Phone numbers
- Record IDs
- Timestamps
- Coordinates, telemetry values

**Absolute minimum font size: 12px.** Delete any `text-[10.5px]`, `text-[9px]`, `text-[11px]` from the codebase.

---

## 4. Spacing & Grid

### Base Unit

All spacing uses a **4px base grid.** Use only multiples of 4.

```
4px   → gap-1, p-1  (icon internal padding only)
8px   → gap-2, p-2  (tight component internals)
12px  → gap-3, p-3  (badge padding, chip padding)
16px  → gap-4, p-4  (card body minimum padding)
20px  → gap-5, p-5  (card body preferred padding)
24px  → gap-6, p-6  (section separation inside cards)
32px  → gap-8, p-8  (page-level vertical rhythm)
```

### Layout Grid

```
Sidebar width:          220px (fixed, always visible)
Top header height:       52px (fixed)
Card border-radius:       6px (never 0, never >8px)
Input height:            36px
Button height (primary): 34px
Button height (small):   28px
Table row height:        40px
KPI card height:         80px
```

### Page Shell Layout (CSS)

```css
.app-shell {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 52px 1fr;
  height: 100vh;
}
.top-header  { grid-column: 1 / -1; grid-row: 1; }
.left-sidebar { grid-column: 1; grid-row: 2; }
.main-content { grid-column: 2; grid-row: 2; overflow-y: auto; }
```

---

## 5. Core Component: ZohoCard

This is the **single most important component in the system.** Every panel, widget, data section, and form must live inside a ZohoCard. No exceptions.

### Structure

```
┌─────────────────────────────────────┐
│  [Icon] CARD TITLE          [Badge] │  ← Header (42px, bevel bg, border-bottom)
├─────────────────────────────────────┤
│                                     │
│  Card body content here             │  ← Body (white, p-5, flex-1)
│                                     │
├─────────────────────────────────────┤
│  Click items to view data logs      │  ← Footer (38px, light bg, help text)
└─────────────────────────────────────┘
```

### React Component

Create this file: `src/components/ui/ZohoCard.jsx`

```jsx
// src/components/ui/ZohoCard.jsx
export function ZohoCard({ children, className = '' }) {
  return (
    <div className={`flex flex-col rounded-[6px] border border-border-default bg-surface-body shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

export function ZohoCardHeader({ icon: Icon, title, children }) {
  return (
    <div className="flex items-center gap-2 px-4 h-[42px] bg-gradient-to-b from-[#fbfbfb] to-[#ececec] border-b border-border-header rounded-t-[6px] flex-shrink-0">
      {Icon && <Icon className="w-4 h-4 text-text-secondary flex-shrink-0" />}
      <span className="text-[13px] font-semibold text-text-primary uppercase tracking-wide">
        {title}
      </span>
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function ZohoCardBody({ children, className = '' }) {
  return (
    <div className={`flex-1 bg-surface-body p-5 ${className}`}>
      {children}
    </div>
  );
}

export function ZohoCardFooter({ children }) {
  return (
    <div className="flex items-center px-4 h-[38px] bg-surface-footer border-t border-border-default rounded-b-[6px] flex-shrink-0">
      <span className="text-[12px] text-text-muted">
        {children}
      </span>
    </div>
  );
}
```

### Usage Example

```jsx
import { ZohoCard, ZohoCardHeader, ZohoCardBody, ZohoCardFooter } from '@/components/ui/ZohoCard';
import { Users } from 'lucide-react';

<ZohoCard>
  <ZohoCardHeader icon={Users} title="Recent Contacts">
    <button className="btn-secondary text-[12px] px-3 h-7">View All</button>
  </ZohoCardHeader>
  <ZohoCardBody>
    {/* your content */}
  </ZohoCardBody>
  <ZohoCardFooter>
    Last updated 3 minutes ago
  </ZohoCardFooter>
</ZohoCard>
```

### CSS for ZohoCard (globals.css additions)

```css
.zoho-card {
  border: 1px solid #d4d4d4;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}

.zoho-card-header {
  height: 42px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(180deg, #fbfbfb 0%, #ececec 100%);
  border-bottom: 1px solid #c8c8c8;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;
}

.zoho-card-body {
  padding: 20px !important;
  background: #ffffff;
  flex: 1;
}

.zoho-card-footer {
  height: 38px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background: #f4f5f6;
  border-top: 1px solid #d4d4d4;
  border-radius: 0 0 6px 6px;
  flex-shrink: 0;
  font-size: 12px;
  color: #888888;
}
```

---

## 6. Navigation Architecture

### Left Sidebar (Persistent — Fixed)

Create: `src/components/layout/Sidebar.jsx`

```jsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Briefcase, BarChart2,
  Settings, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/dashboard',  icon: LayoutDashboard },
  { label: 'Contacts',   href: '/contacts',   icon: Users },
  { label: 'Pipeline',   href: '/pipeline',   icon: Briefcase },
  { label: 'Reports',    href: '/reports',    icon: BarChart2 },
  { label: 'Settings',   href: '/settings',   icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] h-full bg-white border-r border-border-default flex flex-col">
      {/* Logo */}
      <div className="h-[52px] flex items-center px-5 border-b border-border-default flex-shrink-0">
        <span className="text-[16px] font-semibold text-text-primary tracking-tight">
          Ouantum
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 h-[38px] mx-2 rounded-[4px] text-[13px] transition-colors
                ${active
                  ? 'bg-surface-hover text-btn-primary font-medium border-l-2 border-btn-primary'
                  : 'text-text-secondary hover:bg-surface-footer hover:text-text-primary'
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom workspace indicator */}
      <div className="px-4 py-3 border-t border-border-default">
        <p className="text-[11px] text-text-muted uppercase tracking-wide">Workspace</p>
        <p className="text-[13px] text-text-primary font-medium mt-0.5">My Organization</p>
      </div>
    </aside>
  );
}
```

### Sidebar Rules

- Active item: left `border-l-2 border-btn-primary` + `bg-surface-hover` + primary text color
- Inactive item: `text-text-secondary`, hover → `bg-surface-footer`
- Icon size: always 16×16px (`w-4 h-4`)
- Nav item height: 38px fixed
- Group labels (if needed): 11px uppercase, muted, 8px margin-top, non-clickable

---

## 7. Top Header Bar

Create: `src/components/layout/Header.jsx`

```jsx
'use client';
import { Search, Bell, ChevronDown } from 'lucide-react';

export function Header({ user = { name: 'Riya Sharma', initials: 'RS' } }) {
  return (
    <header className="h-[52px] bg-white border-b border-border-default flex items-center px-5 gap-4 flex-shrink-0">

      {/* Global search */}
      <div className="flex-1 max-w-[420px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search contacts, deals, companies… (⌘K)"
            className="w-full h-[34px] pl-9 pr-3 text-[13px] border border-border-input rounded-[4px]
                       bg-surface-input text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-surface-footer text-text-secondary">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 px-2 h-8 rounded-[4px] hover:bg-surface-footer">
          <div className="w-7 h-7 rounded-full bg-btn-primary flex items-center justify-center">
            <span className="text-[11px] font-semibold text-white">{user.initials}</span>
          </div>
          <span className="text-[13px] text-text-primary">{user.name}</span>
          <ChevronDown className="w-3 h-3 text-text-muted" />
        </button>
      </div>
    </header>
  );
}
```

### Header Rules

- Height: exactly 52px
- Background: white, `border-b border-border-default`
- Search: max-width 420px, left-aligned, includes keyboard shortcut hint
- Right side: notifications bell → user avatar (always in this order)
- No decorative gradients or shadows on the header itself

---

## 8. Dashboard & KPI Panels

### KPI Summary Bar

Always the first element on any module page. Non-negotiable.

```jsx
// src/components/ui/KPIBar.jsx
export function KPIBar({ metrics }) {
  // metrics = [{ label, value, trend, trendDir }]
  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {metrics.map(({ label, value, trend, trendDir }) => (
        <div key={label} className="zoho-card p-4">
          <p className="text-[12px] text-text-muted mb-1">{label}</p>
          <p className="text-[22px] font-medium text-text-primary font-mono leading-tight">{value}</p>
          {trend && (
            <p className={`text-[12px] mt-1 ${trendDir === 'up' ? 'text-text-success' : 'text-text-danger'}`}>
              {trendDir === 'up' ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Example usage:**
```jsx
<KPIBar metrics={[
  { label: 'Total Contacts',  value: '1,482',  trend: '+12 this week', trendDir: 'up' },
  { label: 'Open Deals',      value: '38',     trend: '−3 this week',  trendDir: 'down' },
  { label: 'Revenue (MTD)',   value: '₹4.2L',  trend: '+8.4%',         trendDir: 'up' },
  { label: 'Tasks Due Today', value: '7',      trend: null },
]} />
```

### KPI Card Rules

- 4 cards per row on desktop, 2 on tablet, 1 on mobile
- Value: 22px, `font-mono`, `font-medium`
- Label: 12px, muted, above the value
- Trend: 12px, green (up) or red (down), below value
- Background: white zoho-card, no colored backgrounds on KPI cards

---

## 9. Tables

### Standard CRM Table

```jsx
// src/components/ui/DataTable.jsx
'use client';
import { useState } from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

export function DataTable({ columns, rows, onRowClick }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState([]);

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-surface-header border-b border-border-default">
            <th className="w-10 px-3 py-0 h-[40px]">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-border-input cursor-pointer" />
            </th>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-3 h-[40px] text-left text-[11px] font-semibold text-text-secondary uppercase tracking-wide cursor-pointer select-none"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  <span className="text-text-muted opacity-50">
                    {sortCol === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                </div>
              </th>
            ))}
            <th className="w-12 px-3 h-[40px]" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-[#e0e0e0] hover:bg-surface-hover cursor-pointer transition-colors"
              onClick={() => onRowClick?.(row)}
            >
              <td className="px-3 py-0 h-[40px]" onClick={e => e.stopPropagation()}>
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-border-input cursor-pointer" />
              </td>
              {columns.map(col => (
                <td key={col.key} className={`px-3 h-[40px] text-text-primary ${col.mono ? 'font-mono' : ''}`}>
                  {row[col.key]}
                </td>
              ))}
              <td className="px-3 h-[40px]" onClick={e => e.stopPropagation()}>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-footer text-text-muted">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Table Rules

| Rule | Detail |
|------|--------|
| No vertical borders | `border-collapse`, horizontal `border-b` only |
| Row height | Always 40px fixed |
| Header row height | Always 40px fixed |
| Header text | 11px, uppercase, tracked, muted |
| Hover state | `bg-surface-hover` (#f0f6ff) |
| Active/selected row | `bg-surface-hover` + checkbox checked |
| Sortable indicator | Always visible, shows `↕` when unsorted |
| Row actions | 3-dot menu on far right, appears on hover |
| Checkboxes | Left-most column for bulk select |
| Monospace columns | IDs, phone numbers, amounts, dates |

---

## 10. Forms & Inputs

### Standard Input Pattern

**Always label-above-input (stacked layout). No exceptions.**

```jsx
// src/components/ui/FormField.jsx
export function FormField({ label, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-text-secondary">
        {label}
        {required && <span className="text-state-error ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[12px] text-text-muted">{hint}</p>
      )}
      {error && (
        <p className="text-[12px] text-text-danger flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
```

### Input CSS (globals.css)

```css
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"],
input[type="search"],
select,
textarea {
  height: 36px;
  padding: 0 10px;
  font-size: 13px;
  font-family: inherit;
  border: 1px solid #c8c8c8;
  border-radius: 4px;
  background: #ffffff;
  color: #1a1a1a;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.08);
}

input.error { border-color: #d93025; }
input.error:focus { box-shadow: 0 0 0 2px rgba(217,48,37,0.15); }

input.success { border-color: #1e7e34; }

textarea { height: auto; min-height: 80px; padding: 8px 10px; resize: vertical; }
select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
```

### Validation States

```jsx
// Always show validation feedback inline — never alert() or page reload
const [errors, setErrors] = useState({});

function validate(field, value) {
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Enter a valid email address';
  }
  if (field === 'phone' && !/^\+?[\d\s\-]{10,}$/.test(value)) {
    return 'Enter a valid phone number';
  }
  return null;
}
```

---

## 11. Buttons

### Three-tier system. One primary per page/modal. Maximum.

```css
/* globals.css — Button system */

/* Primary — filled, high emphasis */
.btn-primary {
  height: 34px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  background: #0073e6;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-primary:hover { background: #005bb5; }
.btn-primary:active { background: #004fa3; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

/* Secondary — outlined bevel */
.btn-secondary {
  height: 34px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 400;
  border-radius: 4px;
  border: 1px solid #b5b5b5;
  background: linear-gradient(to bottom, #fdfdfd, #eaeaea);
  color: #333333;
  cursor: pointer;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-secondary:hover { background: linear-gradient(to bottom, #f5f5f5, #e0e0e0); }
.btn-secondary:active { background: #e0e0e0; }

/* Tertiary — text only, no background */
.btn-tertiary {
  height: 34px;
  padding: 0 10px;
  font-size: 13px;
  background: none;
  border: none;
  color: #0073e6;
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-tertiary:hover { background: #f0f6ff; }

/* Destructive — danger action */
.btn-danger {
  height: 34px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  background: #d32f2f;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-danger:hover { background: #b71c1c; }

/* Small variant (for use inside cards, table rows) */
.btn-sm { height: 28px; padding: 0 10px; font-size: 12px; }
```

### Button Hierarchy Rules

- One `.btn-primary` per page or modal — maximum
- Destructive actions always in `.btn-danger`, always the rightmost button
- Cancel/close always in `.btn-secondary` or `.btn-tertiary`
- Button groups: `[Secondary] [Primary]` — secondary left, primary right

---

## 12. Empty States

Every list, table, and data panel needs an empty state. Non-negotiable.

```jsx
// src/components/ui/EmptyState.jsx
import { Plus } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-footer flex items-center justify-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-text-muted" />}
      </div>
      <h3 className="text-[14px] font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-[13px] text-text-muted mb-5 max-w-[280px]">{description}</p>
      {actionLabel && (
        <button className="btn-primary" onClick={onAction}>
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

**Usage:**
```jsx
{contacts.length === 0 && (
  <EmptyState
    icon={Users}
    title="No contacts yet"
    description="Add your first contact to start building your pipeline."
    actionLabel="Add Contact"
    onAction={() => setShowModal(true)}
  />
)}
```

---

## 13. Breadcrumbs

Required on all detail pages (Contact detail, Deal detail, any nested view).

```jsx
// src/components/ui/Breadcrumb.jsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ crumbs }) {
  // crumbs = [{ label, href }] — last item is current page (no href)
  return (
    <nav className="flex items-center gap-1 text-[12px] text-text-muted mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
          {crumb.href
            ? <Link href={crumb.href} className="hover:text-text-primary transition-colors">{crumb.label}</Link>
            : <span className="text-text-primary font-medium">{crumb.label}</span>
          }
        </span>
      ))}
    </nav>
  );
}
```

**Usage:**
```jsx
<Breadcrumb crumbs={[
  { label: 'Contacts', href: '/contacts' },
  { label: 'Riya Sharma' }  // current page — no href
]} />
```

---

## 14. Notification System

```jsx
// src/components/ui/NotificationDropdown.jsx
'use client';
import { useState } from 'react';
import { Bell, X } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'Deal with Acme Corp moved to Proposal stage', time: '2 min ago', read: false },
  { id: 2, text: 'Riya Sharma replied to your email',           time: '18 min ago', read: false },
  { id: 3, text: 'Task "Follow up with TechCo" is due today',   time: '1 hr ago', read: true },
];

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        className="relative w-8 h-8 flex items-center justify-center rounded hover:bg-surface-footer text-text-secondary"
        onClick={() => setOpen(o => !o)}
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[320px] zoho-card z-50 shadow-lg">
          <div className="zoho-card-header flex items-center justify-between">
            <span className="text-[13px] font-semibold uppercase tracking-wide">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {MOCK_NOTIFICATIONS.map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-[#e0e0e0] text-[13px] ${!n.read ? 'bg-state-info' : ''}`}>
                <p className="text-text-primary leading-snug">{n.text}</p>
                <p className="text-[12px] text-text-muted mt-1">{n.time}</p>
              </div>
            ))}
          </div>
          <div className="zoho-card-footer">
            <button className="text-[12px] text-btn-primary hover:underline">Mark all as read</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 15. What to Delete — Zero-Tolerance Violations

Run these searches across the entire codebase and eliminate every match:

### Banned CSS Classes (Search & Destroy)

```bash
# Run from project root
grep -rn "border-black\|border-2 border\|border-\[.*black\]" src/
grep -rn "shadow-\[2px\|shadow-\[4px" src/
grep -rn "text-\[9px\]\|text-\[10px\]\|text-\[10\.5px\]\|text-\[11px\]" src/
grep -rn "border-white border-2\|border-gray-900" src/
```

### Replacements

| Found | Replace With |
|-------|-------------|
| `border-black` | `border-border-default` |
| `border-2 border-*` | `border border-border-default` |
| `shadow-[2px_2px_0px...]` | `shadow-sm` (0 1px 3px rgba) |
| `text-[9px]` | Delete or `text-[12px]` |
| `text-[10.5px]` | `text-[12px]` |
| `p-1` on cards | `p-5` |
| Raw `#000000` borders | `border-border-default` |

### Add to ESLint (`.eslintrc.js`)

```js
// Install: npm install -D eslint-plugin-tailwindcss
module.exports = {
  plugins: ['tailwindcss'],
  rules: {
    'tailwindcss/no-custom-classname': ['warn', {
      whitelist: ['zoho-card', 'zoho-card-header', 'zoho-card-body', 'zoho-card-footer', 'btn-primary', 'btn-secondary', 'btn-tertiary', 'btn-danger', 'btn-sm'],
    }],
  },
};
```

---

## 16. Tailwind Config (Full)

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          page:   '#f0f1f3',
          body:   '#ffffff',
          header: '#f5f5f5',
          footer: '#f4f5f6',
          hover:  '#f0f6ff',
          input:  '#ffffff',
        },
        border: {
          default: '#d4d4d4',
          header:  '#c8c8c8',
          input:   '#c8c8c8',
          focus:   '#000000',
          hover:   '#b0b0b0',
          error:   '#d93025',
          success: '#1e7e34',
        },
        text: {
          primary:   '#1a1a1a',
          secondary: '#555555',
          muted:     '#888888',
          link:      '#0073e6',
          danger:    '#c62828',
          success:   '#2e7d32',
          warning:   '#e65100',
        },
        state: {
          error:   '#fdecea',
          warning: '#fff8e1',
          success: '#e8f5e9',
          info:    '#e3f2fd',
        },
        btn: {
          primary:      '#0073e6',
          'primary-hv': '#005bb5',
          danger:       '#d32f2f',
          'danger-hv':  '#b71c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      borderRadius: {
        card:  '6px',
        input: '4px',
        btn:   '4px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.06)',
        dropdown: '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
```

---

## 17. Shared Component Library Checklist

Build these in order. Each must be used consistently before moving to the next.

```
Priority 1 — Must exist before shipping
☐ ZohoCard, ZohoCardHeader, ZohoCardBody, ZohoCardFooter
☐ Sidebar (persistent, with active state)
☐ Header (search + notifications + user avatar)
☐ AppShell (layout wrapper using Sidebar + Header)

Priority 2 — Core CRM functionality
☐ KPIBar (4-up metric cards)
☐ DataTable (sortable, selectable, with row actions)
☐ FormField (label + input + error + hint)
☐ EmptyState (icon + message + CTA)

Priority 3 — Polish and usability
☐ Breadcrumb
☐ NotificationDropdown
☐ Modal (with header/body/footer, focus trap, ESC close)
☐ Badge (status labels: Active, Closed, Pending)
☐ StatusPill (color-coded: green/amber/red)
☐ ConfirmDialog (for destructive actions)
```

---

## 18. Page Layout Template

Every module page must follow this structure:

```jsx
// src/app/contacts/page.jsx — template pattern
import { AppShell } from '@/components/layout/AppShell';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { KPIBar } from '@/components/ui/KPIBar';
import { ZohoCard, ZohoCardHeader, ZohoCardBody, ZohoCardFooter } from '@/components/ui/ZohoCard';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users, Plus } from 'lucide-react';

export default function ContactsPage() {
  const contacts = []; // your data

  return (
    <AppShell>
      {/* 1. Breadcrumb */}
      <Breadcrumb crumbs={[{ label: 'Contacts' }]} />

      {/* 2. Page title + primary action */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[18px] font-medium text-text-primary">Contacts</h1>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* 3. KPI bar — always first */}
      <KPIBar metrics={[
        { label: 'Total', value: '1,482', trend: '+12 this week', trendDir: 'up' },
        { label: 'Active', value: '934' },
        { label: 'New (30d)', value: '127', trend: '+18%', trendDir: 'up' },
        { label: 'Unassigned', value: '23' },
      ]} />

      {/* 4. Main content card */}
      <ZohoCard>
        <ZohoCardHeader icon={Users} title="All Contacts">
          <input type="search" placeholder="Filter…" className="h-7 px-2 text-[12px] border border-border-input rounded w-[180px]" />
        </ZohoCardHeader>
        <ZohoCardBody className="p-0">
          {contacts.length > 0
            ? <DataTable columns={COLUMNS} rows={contacts} />
            : <EmptyState
                icon={Users}
                title="No contacts yet"
                description="Add your first contact to start building your CRM."
                actionLabel="Add Contact"
                onAction={() => {}}
              />
          }
        </ZohoCardBody>
        <ZohoCardFooter>
          {contacts.length} contacts · Sorted by last modified
        </ZohoCardFooter>
      </ZohoCard>
    </AppShell>
  );
}
```

---

## 19. Fix Priority Order

Execute in this exact sequence. Do not start step N+1 until step N is done and committed.

| # | Fix | Time Estimate | Impact |
|---|-----|--------------|--------|
| 1 | Purge all banned borders and shadows (`grep` + replace) | 1 hour | High |
| 2 | Add design tokens to `tailwind.config.js` | 1 hour | High |
| 3 | Build `ZohoCard` component, replace all ad-hoc panels | 3 hours | Very High |
| 4 | Build `AppShell` with `Sidebar` + `Header` | 2 hours | Very High |
| 5 | Set up `src/app/layout.js` to use `AppShell` for all auth pages | 30 min | Very High |
| 6 | Fix all font sizes (remove sub-12px, set body to 13px) | 30 min | High |
| 7 | Build `KPIBar`, add to all module pages | 1.5 hours | High |
| 8 | Upgrade `DataTable` with sort, row hover, checkboxes, row actions | 2 hours | High |
| 9 | Build `EmptyState`, add to all lists | 1 hour | Medium |
| 10 | Add `Breadcrumb` to all detail pages | 30 min | Medium |
| 11 | Standardize button system (3 classes, 1 primary per page) | 1 hour | Medium |
| 12 | Fix all form inputs (stacked label, inline validation) | 2 hours | Medium |
| 13 | Add `NotificationDropdown` | 1 hour | Low |
| 14 | Add eslint rule to prevent banned classes re-entering | 30 min | Preventive |

**Total estimated time: ~18 hours of focused work.**  
After step 5, the product will look and feel corporate-grade. Steps 6–14 are polish.

---

*This document is the single source of truth for Ouantum CRM's UI/UX system. All components, pages, and future features must conform to these rules before being merged.*

---

## 20. Active Integration & Refactoring Plan

We are executing a codebase-wide clean-up of the 20 workspace files in `src/components/workspaces/` to purge banned styling attributes (offset brutalist shadows, raw black borders, sub-12px font classes) as specified in Section 15.

### Steps of Execution:
1. **Automated Refactoring Utility**: Write a Node.js utility script inside the scratch directory (`refactor_workspaces.js`) to scan, parse, and safely perform regex replaces for standard CSS classes across the workspaces folder.
2. **Execute Replacements**: Replace banned classes (`border-black`, `border-2 border-black`, `border-gray-900`) with `border-border-default` or `border border-border-default`, and scale up sub-12px Tailwind font sizes (`text-[9px]`, `text-[10px]`, `text-[11px]`, `text-[8px]`, `text-[9.5px]`) to `text-[12px]`.
3. **Verify Build**: Execute `npm run build` after refactoring is completed to confirm that all files continue to compile without syntax or compiler errors.

