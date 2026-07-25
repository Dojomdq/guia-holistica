---
name: ui-ux-designer
description: Use when creating or modifying UI components, layouts, styling, design systems, or visual UX in this project. Covers Tailwind CSS, component architecture, responsive design, animations, color palettes, typography, and design tokens.
---

# UI/UX Designer Skill

## Design Principles

- **Minimalism first**: Every element must earn its place. Remove anything that doesn't serve a clear purpose.
- **Warm earth tones**: This project uses a warm palette (cream, sage, clay, sand, warmblack). Never use cold blues/grays unless explicitly requested.
- **Editorial feel**: Think Apple, Linear, Studio Freight — clean typography, generous whitespace, subtle animations.
- **Mobile-first**: Design for small screens first, then scale up with Tailwind breakpoints (sm, md, lg).

## Color Palette

| Token | Use | Hex |
|---|---|---|
| `warmblack` | Primary text, dark backgrounds | `#1A1510` |
| `cream-50` to `cream-300` | Backgrounds, borders, subtle surfaces | Warm off-whites |
| `sage-100` to `sage-900` | Accent backgrounds, CTAs, gradients | Muted greens |
| `clay-100` to `clay-900` | Warm accent, buttons, highlights | Terracotta/orange |
| `sand-100` to `sand-500` | Subtle accents, decorative elements | Warm beige |

## Typography

- **Display/Titles**: `font-serif` (Playfair Display) — for hero headings, section titles
- **Body**: `font-sans` (DM Sans) — for all body text, UI elements
- **Mono**: `font-mono` (DM Mono) — for small labels, counts, technical details
- Use `clamp()` for responsive font sizes: `text-[clamp(2rem,5vw,3.5rem)]`

## Spacing & Layout

- Use `container-page` for content width (max-width with padding)
- Use `container-wide` for full-width sections
- Section padding: `py-5 sm:py-7 lg:py-9` (compact) or `section-pad` for standard
- Card gaps: `gap-3` to `gap-6` depending on density
- Border radius: `rounded-xl` for cards, `rounded-2xl` for large containers, `rounded-full` for badges/pills

## Component Patterns

### Buttons
- Primary: `btn-dark` (warmblack bg, white text)
- Secondary: `btn-white` (white bg, dark text)
- Ghost: `btn` with transparent bg
- Always include hover state and transition

### Cards
- Use `card` class for consistent styling
- Border: `border border-cream-200/50`
- Shadow: `shadow-soft` or `shadow-medium`
- Hover: subtle scale or shadow change

### Input Fields
- Use `input-field` class
- Include focus ring and placeholder styling
- Position icons with `absolute` + `translate-y-1/2` for vertical centering

### Badges/Tags
- Use `badge` class
- Small text: `text-[11px]` or `text-[13px]`
- Subtle bg: `bg-cream-200/60`

## Animations

- Use `useScrollReveal()` hook for entrance animations
- Pattern: `opacity-0 translate-y-5` → `opacity-100 translate-y-0`
- Duration: `duration-700` for sections, `duration-500` for elements
- Stagger with `transitionDelay` for lists
- Use `ease-out-expo` for smooth deceleration

## Responsive Breakpoints

- Mobile: default (single column)
- `sm`: 640px — minor adjustments
- `md`: 768px — two-column layouts
- `lg`: 1024px — full desktop layout
- `xl`: 1280px — wide screens

## Rules

1. Never use pure black (`#000`) — always `warmblack` or `warmblack/XX` with opacity
2. Never use pure white (`#fff`) for backgrounds — use `cream-50` or `white` only for cards on dark backgrounds
3. Always include `transition-colors` or `transition-all` on interactive elements
4. Keep text contrast accessible: min `text-warmblack/60` for body text on light bg
5. Use `line-clamp-X` for text overflow in cards
6. Icons: prefer Lucide React, consistent sizing (`h-4 w-4` inline, `h-5 w-5` standalone)
