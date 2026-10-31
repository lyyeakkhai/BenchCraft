# BenchCraft Design System & Visual Specification (DESIGN.md)

> **Single Source of Truth for BenchCraft Platform UI/UX**  
> **Aesthetic Philosophy:** Anti-AI Slob · High-Status Craft · Silicon Valley Precision Ledger · Zero Data Retention

---

## 1. Aesthetic Vision & Design Philosophy

BenchCraft is the empirical model evaluation and right-sizing platform for technical founders who care about unit economics. 

### Core Principles
1. **The Precision Ledger (Financial Rigor):** Visual design must convey the authority, precision, and truth of an audited accounting ledger combined with a high-status Silicon Valley software instrument (Stripe, Linear, Raycast).
2. **Rejection of "AI Slob":**
   - No generic purple/blue gradients or generic robot imagery.
   - Every metric has units, provenance, and a real formula.
   - Text is crisp, editorial, and informative rather than fluffy marketing prose.
3. **Tactile Glass & Atmospheric Depth:**
   - Subtle frosted glass panels (`backdrop-blur-md` and `backdrop-filter: blur(16px)`).
   - Micro-accent glowing mesh backgrounds (`radial-gradient` meshes).
   - Silky micro-interactions with subtle hover elevation (`translateY(-2px)`).
4. **Dual Mode Craft:**
   - **Light Mode:** Crisp Pale Sage ledger paper (`#EDF2EF`) with deep forest pine ink (`#0A2E2B`).
   - **Dark Mode:** Deep Obsidian Emerald (`#071513`) with illuminated mint slate (`#F0F6F4`) and warm amber gold accents (`#E7B44A`).

---

## 2. Typography Hierarchy

| Role | Font Family | Variable / Class | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Headings** | **Newsreader** | `var(--font-newsreader)`, `font-serif` | SemiBold (600), Bold (700) | Hero headlines, page titles, big dollar metric displays (`$1,485/mo`) |
| **Interface / Body** | **Hanken Grotesk** | `var(--font-hanken)`, `font-sans` | Regular (400), Medium (500), SemiBold (600) | Form controls, button labels, descriptions, data tables, navigation |
| **Data / Telemetry** | **Monospace** | `font-mono` | Medium (500), SemiBold (600) | Token counts, latency metrics (`280ms`), price snapshots, status codes |

---

## 3. Color Tokens & Theme Invariants

### 3.1 Light Mode Palette (Pale Sage Ledger)
```css
:root {
  --bg: #EDF2EF;              /* Pale Sage Mist background */
  --surface: #FFFFFF;         /* Pure White card canvas */
  --surface-muted: #FAFCFB;   /* Off-white table zebra striping */
  --ink: #0A2E2B;             /* Deep Forest Pine primary typography */
  --pine: #1F5C55;            /* Mid-tone Pine for accents & active steps */
  --muted: #4B605C;           /* Muted Slate Green for secondary labels */
  --line: #D3DDD8;            /* Ledger grid rule border */
  --bar: #A9BDB7;             /* Progress bar meter track */
  
  /* Signal / Financial Gold Accents */
  --signal: #B87A14;          /* Warm Amber primary callout */
  --signal-light: #E7B44A;    /* Luminous Gold highlight */
  --signal-surface: #FBF3E2;  /* Soft Warm Gold pill background */
  --signal-dark: #8A5A0B;     /* Deep Gold typography for savings */
}
```

### 3.2 Dark Mode Palette (Obsidian Emerald Silicon Valley)
```css
.dark {
  --bg: #071513;              /* Deep Obsidian Emerald background */
  --surface: #0E2421;         /* Deep Forest Pine card canvas */
  --surface-muted: #0A1C1A;   /* Muted surface for nested tables/wells */
  --ink: #F0F6F4;             /* Crisp Off-White primary typography */
  --pine: #2E8B80;            /* Luminous Emerald accents & primary buttons */
  --muted: #9BB3AC;           /* Muted Mint Slate for secondary labels */
  --line: #183833;            /* Subtle deep emerald grid borders */
  --bar: #234E47;             /* Deep meter track */
  
  /* Signal / Gold Accents (Dark Mode) */
  --signal: #E7B44A;          /* Bright Warm Gold highlight */
  --signal-light: #F3CA68;    /* Luminous Gold text */
  --signal-surface: #221B0A;  /* Deep Gold well background */
  --signal-dark: #D4952B;     /* Amber Gold badge border */
}
```

---

## 4. Glassmorphism & Surface Elevation Standards

### Glass Panel Primitives
```css
/* Standard Frosted Glass Panel */
.glass-panel {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(211, 221, 216, 0.85);
}

.dark .glass-panel {
  background: rgba(14, 36, 33, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(28, 58, 53, 0.85);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Subtle Interactive Elevation */
.glass-panel-hover {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.glass-panel-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px -8px rgba(10, 46, 43, 0.08);
  border-color: rgba(184, 122, 20, 0.45);
}
.dark .glass-panel-hover:hover {
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.6);
  border-color: rgba(231, 180, 74, 0.5);
}
```

### Ambient Glow Gradients
```css
/* Luminous Ambient Mesh */
.mesh-glow {
  background-image: 
    radial-gradient(at 0% 0%, rgba(31, 92, 85, 0.06) 0px, transparent 55%),
    radial-gradient(at 100% 100%, rgba(184, 122, 20, 0.06) 0px, transparent 55%),
    radial-gradient(at 50% 50%, rgba(237, 242, 239, 0.5) 0px, transparent 100%);
}

.dark .mesh-glow {
  background-image: 
    radial-gradient(at 0% 0%, rgba(46, 139, 128, 0.12) 0px, transparent 55%),
    radial-gradient(at 100% 100%, rgba(231, 180, 74, 0.08) 0px, transparent 55%),
    radial-gradient(at 50% 50%, rgba(7, 21, 19, 0.6) 0px, transparent 100%);
}
```

---

## 5. Layout Shell Separation (Zero Contamination)

The platform is strictly segmented into two isolated shells via `components/navigation/app-shell-provider.tsx`:

### 5.1 The Marketing Shell
- **Routes:** `/`, `/product`, `/how-it-works`, `/pricing`, `/case-study`
- **Structure:**
  1. Sticky frosted glass navigation bar (`h-14 bg-white/80 dark:bg-[#071513]/85 backdrop-blur-md`).
  2. Centered content container: `max-w-7xl mx-auto px-4 sm:px-6 py-10`.
  3. Comprehensive multi-column enterprise footer with live operational status pill, 4-column navigation, and OpenRouter ZDR badge.

### 5.2 The SaaS Application Workspace Shell
- **Routes:** `/dashboard`, `/dashboard/evaluations/*`, `/dashboard/spending`, `/dashboard/models`, `/dashboard/settings`
- **Structure:**
  1. Strict full-screen viewport: `h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#EDF2EF] dark:bg-[#071513]`.
  2. Left fixed sidebar (`w-64 h-screen flex-shrink-0 bg-white dark:bg-[#0E2421] border-r`):
     - Adaptive brand logo (`BrandLogo`).
     - Workspace identifier with pulsing green `ZDR Active` badge.
     - `+ New Evaluation` primary action button.
     - Nav items (Overview, Evaluations, Spend Analytics, Model Catalog, Settings).
     - Monthly usage quota meter (e.g. `0 / 20 Evaluations`).
     - Clerk user profile button and active user badge.
  3. Top control plane subheader (`h-14 bg-white dark:bg-[#0E2421] border-b border-[#D3DDD8] dark:border-[#1C3A35] px-6 flex items-center justify-between`):
     - Dynamic breadcrumbs (`Dashboard / Evaluations / ...`).
     - Live `Zero Data Retention Enforced` security badge.
     - Theme toggle button (`ThemeToggle`).
     - Rapid `+ Evaluate` action trigger.
  4. Scrollable canvas (`flex-1 overflow-y-auto p-4 sm:p-8`):
     - `max-w-6xl mx-auto space-y-8`.
  5. **Contamination Rule:** The SaaS application shell NEVER renders the marketing navbar or the marketing footer.

---

## 6. The 3-Step Evaluation Flow Architecture

The core evaluation product lives strictly inside the SaaS workspace under `/dashboard/evaluations/`:

```
┌────────────────────────────────────────────────────────┐
│ Step 1: Domain Grounding (/dashboard/evaluations/new)  │
│ - Upload FAQs, policies, guidelines (PDF/Word/Text)    │
│ - Set monthly conversation scale & priority            │
│ - Live projected savings calculation in real-time      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Step 1b: Scenario Review (.../[id]/review)             │
│ - Review 8 synthesized edge scenarios & rubrics        │
│ - Adjust Quality Bar fader (e.g. 8.0/10)               │
│ - Candidate lineup randomized for blinded arena        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Step 2: Blinded Parallel Arena (.../[id]/arena)        │
│ - Candidate models run simultaneously in parallel      │
│ - Temp-0 LLM Judge evaluates line-by-line rubrics      │
│ - Real-time progress animation HUD cockpit             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Step 3: Right-Sizing Decision & Ledger (.../[id])      │
│ - Top 3 models side-by-side with Quality Needle Bar    │
│ - "What You Save" financial ledger ($/mo, $/yr, 2x vol)│
│ - Direct procurement links to AWS, GCP, OpenRouter     │
│ - Exportable Executive Memo (.../[id]/report)          │
└────────────────────────────────────────────────────────┘
```

---

## 7. Component Library & Button Invariants

### 7.1 Primary Action (`.btn-ledger`)
- **Light:** `#0A2E2B` background, `#FFFFFF` text, hover: `#1F5C55`.
- **Dark:** `#1F5C55` background, `#FFFFFF` text, hover: `#2E8B80`.
- **Properties:** `rounded-xl`, `font-semibold`, `text-xs` or `text-sm`, `box-shadow` with 0.2s cubic-bezier ease.

### 7.2 Secondary Action (`.btn-ledger-ghost`)
- **Light:** `#FFFFFF` background, `#0A2E2B` text, 1.5px border `#0A2E2B`, hover: `#EDF2EF`.
- **Dark:** Transparent background, `#F0F6F4` text, 1.5px border `#234E47`, hover: `#0E2421`.

### 7.3 Badges & Recommendation Pills
- **Standard Pill (`.pill`):** Rounded pill with 1px border.
- **Recommended Pill (`.pill.rec`):**
  - **Light:** `#E7B44A` background with `#8A5A0B` text.
  - **Dark:** `#221B0A` background with `#F3CA68` text and `#8A5A0B` border.

### 7.4 Quality Bar Needle Marker
- Visual needle line (`absolute -top-1 w-[2px] h-4 bg-[#0A2E2B] dark:bg-[#F0F6F4]`) indicating the founder's exact threshold on a candidate's 0-100 score bar.

---

## 8. Zero Data Retention (ZDR) Trust Manifest

All UI components communicating privacy must adhere to the ZDR specification:
- OpenRouter ZDR header active (`"HTTP-Referer": "https://benchcraft.dev"`, `"X-Title": "BenchCraft"`, `"data_collection": "deny"`).
- Files parsed in memory and discarded immediately after domain scenario formulation.
- Clear visual badges (`● Zero Data Retention Active`) present on:
  1. Marketing header
  2. Footer compliance banner
  3. SaaS sidebar workspace card
  4. Decision and printable executive memos
