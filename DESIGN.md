# BenchCraft Design System Specification (DESIGN.md)

> **Single Source of Truth for BenchCraft Platform UI/UX**  
> **Aesthetic Philosophy:** The Grand Synthesis — Specular Glassmorphic Instrument & Precision Ledger  
> **Synthesized From 4 Archetypes:**  
> 1. **Linear / Raycast:** Multi-layered frosted glass (`backdrop-blur-2xl`), specular top-edge light reflections, and ambient emerald/amber light refraction.  
> 2. **Supabase / Langfuse / Modal:** Interactive live telemetry cockpits, real-time volume/threshold sliders, and `zdr: true` gateway JSON trace inspectors.  
> 3. **Resend / Stripe Press:** Hybrid typography pairing crisp **Hanken Grotesk** with editorial **Newsreader** italic accents (`font-editorial`) and oversized financial numerals.  
> 4. **Vercel / Attio:** Architectural coordinate markers (`[01 // WORKBENCH]`), exposed hairline grids, and zero decorative fluff.

---

## 1. Aesthetic Thesis & Visual Direction

BenchCraft is the empirical model evaluation and right-sizing platform for technical founders who care about unit economics.

### Core Visual Principles
1. **The Precision Instrument:** Every element looks like an audited financial ledger combined with a high-status developer tool. Data has units, metrics have formulas, and tables have real provenance.
2. **Atmospheric Void & Tactile Depth:**
   - **Dark Mode (Default & High Impact):** Deep Carbon Void (`#07080B`) canvas, with razor-thin hairline borders (`rgba(255, 255, 255, 0.08)`), glass cards (`rgba(14, 16, 23, 0.75)` with `backdrop-filter: blur(20px)`), and radiant emerald/cyan telemetry bleeds.
   - **Light Mode (Crisp Precision):** Clean Alabaster (`#F8FAFC`) with pure white elevated surfaces (`#FFFFFF`), crisp slate typography (`#0F172A`), and hairline slate rules (`#E2E8F0`).
3. **No "AI Slop" Anti-Patterns:**
   - ❌ No centered 3-column card grids with pastel colored circle icons.
   - ❌ No purple-to-pink gradient buttons.
   - ❌ No vague copy like "Supercharge your AI workflow with cutting-edge intelligence".
   - ✅ Tangible interactive software cockpits directly in the hero viewport.
   - ✅ High-density data tables with tabular figures (`tabular-nums`), latency tags, and pass/fail indicators.
   - ✅ Verified dollar values (`$15.00/mo` vs `$1,500.00/mo`).

---

## 2. Typography Hierarchy

| Role | Font Family | Variable / Class | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Interface & Headings** | **Hanken Grotesk** | `var(--font-hanken)`, `font-display` | Bold (700), SemiBold (600) | Hero headlines, section titles, card labels, navigation |
| **Editorial & Numbers** | **Newsreader** | `var(--font-newsreader)`, `font-serif` | SemiBold (600), Bold (700) | Big currency metrics (`$1,485/mo`), editorial quotes |
| **Body & UI** | **Hanken Grotesk** | `font-body`, `font-sans` | Regular (400), Medium (500), SemiBold (600) | Explanatory copy, button labels, form controls, table cells |
| **Telemetry & Code** | **JetBrains Mono / SFMono** | `font-outlier`, `font-mono` | Medium (500), SemiBold (600) | Latency (`280ms`), status codes (`zdr: true`), token counts, pricing |

---

## 3. Color Tokens & Theme Invariants

### 3.1 Light Mode Palette (Crisp Alabaster Precision)
```css
:root {
  --color-paper: #F8FAFC;         /* Clean Alabaster background canvas */
  --color-paper-2: #FFFFFF;       /* Pure White elevated card */
  --color-paper-3: #F1F5F9;       /* Nested well / table zebra track */
  --color-ink: #0F172A;           /* Deep Obsidian Charcoal primary text */
  --color-ink-2: #1E293B;         /* Secondary Slate Charcoal text */
  --color-muted: #64748B;         /* Technical Slate for labels & metadata */
  --color-rule: #E2E8F0;          /* Hairline card & grid border */
  --color-rule-2: #CBD5E1;        /* Emphasized divider & interactive border */
  
  /* Luminous Precision Accents (WCAG AA Certified >= 4.5:1) */
  --color-accent: #047857;        /* Precision Emerald (5.24:1 contrast on alabaster) */
  --color-accent-ink: #FFFFFF;    /* White text on accent (5.48:1 contrast) */
  --color-signal: #B45309;        /* Calibrated Amber Gold for savings & ROI (4.80:1 contrast) */
  --color-signal-bg: #FEF3C7;     /* Soft warm gold background */
  --color-signal-border: #FDE68A; /* Warm gold rule */
  --color-focus: #047857;         /* High-contrast focus outline */
}
```

### 3.2 Dark Mode Palette (Deep Carbon Obsidian)
```css
.dark {
  --color-paper: #07080B;         /* Deep Carbon Void background */
  --color-paper-2: #0E1017;       /* Obsidian glass card surface */
  --color-paper-3: #151822;       /* Inner well / nested panel */
  --color-ink: #F8FAFC;           /* Luminous Crisp White text */
  --color-ink-2: #E2E8F0;         /* Secondary Light Slate text */
  --color-muted: #94A3B8;         /* Technical Muted Slate for secondary labels */
  --color-rule: rgba(255, 255, 255, 0.08); /* 1px razor-sharp hairline */
  --color-rule-2: rgba(255, 255, 255, 0.14); /* Hover border */
  
  /* Precision Neon Accents (Dark Mode) */
  --color-accent: #10B981;        /* Luminous Mint/Emerald for pass rates */
  --color-accent-ink: #07080B;    /* Black ink on accent */
  --color-signal: #F59E0B;        /* High-voltage Amber Gold for ROI */
  --color-signal-bg: rgba(245, 158, 11, 0.12); /* Gold glow surface */
  --color-signal-border: rgba(245, 158, 11, 0.32); /* Gold border */
  --color-focus: #10B981;
}
```

---

## 4. Component Standards

### 4.1 Buttons (`.btn-ledger` & `.btn-ledger-ghost`)
- **Primary (`.btn-ledger`):** High-contrast solid button. In dark mode, pure crisp `#F8FAFC` with `#07080B` ink and a 20px ambient white glow on hover (`box-shadow: 0 0 24px -2px rgba(255, 255, 255, 0.45)`). In light mode, deep dark obsidian with white ink.
- **Secondary (`.btn-ledger-ghost`):** Frosted glass surface (`backdrop-filter: blur(8px)`) with hairline border and subtle lift on hover (`transform: translateY(-1px)`).
- **Size Standards:** Height 44px (default), 36px (`.btn-sm`).

### 4.2 Cards & Surfaces (`.ledger-surface` & `.ledger-well`)
- Frosted glass cards with `backdrop-filter: blur(20px)` and 1px crisp rule.
- Micro-elevations on hover for interactive items.

### 4.3 Data Matrix & Telemetry Tables
- `tabular-nums` on all numbers, currency figures, and latencies.
- Color-coded badges for model tiers (Recommended, Frontier, Lightweight, Open Source).
- Live filtering tabs directly on the client side without page reload.

---

## 5. Modern UI Inspiration & Reference Sources

1. **VoltAgent/awesome-design-md (`github.com/voltagent/awesome-design-md`):** Plain-text codified design specifications for AI coding agents.
2. **Godly (`godly.website`):** Top 1% curated modern web design gallery.
3. **Mobbin (`mobbin.com`):** Real-world production iOS & web app workflows.
4. **Minimal Gallery (`minimal.gallery`):** Clean, typography-focused, elegant web instruments.
5. **Dark Mode Design (`darkmode.design`):** Elite dark themes, contrast, and glow choreography.
