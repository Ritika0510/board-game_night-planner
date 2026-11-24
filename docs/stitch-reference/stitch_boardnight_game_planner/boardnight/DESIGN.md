---
name: BoardNight
colors:
  surface: '#12121c'
  surface-dim: '#12121c'
  surface-bright: '#393843'
  surface-container-lowest: '#0d0d17'
  surface-container-low: '#1b1b25'
  surface-container: '#1f1f29'
  surface-container-high: '#292934'
  surface-container-highest: '#34343f'
  on-surface: '#e4e1ef'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e4e1ef'
  inverse-on-surface: '#302f3a'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#00a74b'
  on-tertiary-container: '#003111'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#12121c'
  on-background: '#e4e1ef'
  surface-variant: '#34343f'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  stats-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 28px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system powers an elevated, modern digital tabletop companion and social coordination platform. It merges the focused utility of a high-end SaaS product with the immersive, nocturnal atmosphere of an intimate evening game session. The target audience includes modern tabletop hobbyists, campaign organizers, and collectors who value precision tracking, high-fidelity visual catalogs, and friction-free social planning.

The design philosophy blends **Glassmorphism** with **Tactile Nocturnal UI**: deep, light-absorbing obsidian foundations overlaid with crystalline translucent sheets, refined low-contrast borders, and focused chromatic glows. Surfaces feel atmospheric yet structural, evoking the physical tactility of premium game boards, linen-finish cards, and illuminated table setups in a dimly lit lounge. Every interaction feels fast, cinematic, and deliberate.

## Colors
The palette is built strictly for dark mode, establishing immense visual depth through stratified neutral darks and saturated, fluorescent accents.

- **Foundational Surfaces**:
  - `#09090F` serves as the canvas ground and deep backdrop.
  - `#12121C` defines intermediate raised surfaces, modal backdrops, and navigation panels.
  - `#181824` acts as the floating card, table row, and active container layer.
- **Accents & Illumination**:
  - `#8B5CF6` (Vivid Violet) serves as the primary focal point for critical interactive elements, highlighted state outlines, and primary actions.
  - `#A78BFA` (Light Lavender) acts as a secondary luminescence token for active text, icon accents, and glowing badges.
- **Data & System States**:
  - Success / Attending: `#22C55E` with corresponding 15% alpha backdrops.
  - Warning / Tentative: `#F59E0B`.
  - Destructive / Unavailable: `#EF4444`.
- **Text & Contrast Hierarchy**:
  - High-emphasis labels and titles: `#FFFFFF`.
  - Mid-emphasis metadata, secondary captions, and structural labels: `#A1A1AA`.
  - Low-emphasis borders, inactive dividers, and hairpins: `rgba(255, 255, 255, 0.08)`.

## Typography
The system balances structural expressiveness with maximum utility:
- **Headlines (Plus Jakarta Sans)**: Delivers geometry, geometric warmth, and a clean forward-leaning aesthetic suited for prominent game titles, session headlines, and player metrics.
- **Body & Controls (Inter)**: Employs neutral grotesque metrics engineered for high-density tables, player rosters, complex rule lookups, and inventory breakdowns.
- Use uppercase styling exclusively on `label-sm` when tracking tag categories, player counts, and duration metadata (e.g., `4 PLAYERS`, `90 MIN`).

## Layout & Spacing
The layout adheres to an 8-point base grid inside a fluid 12-column responsive layout, capped at a maximum inner container width of 1440px.

- **Breakpoints & Layout Adaptations**:
  - **Desktop (1024px+)**: 12-column layout. Column gutter is `1.5rem` (`24px`), horizontal screen margin is `2rem` (`32px`). Sidebar navigation stays persistent; collection views adopt multi-column cover art grids.
  - **Tablet (768px - 1023px)**: 8-column layout. Gutters scale to `1.25rem` (`20px`), margins drop to `1.5rem` (`24px`). Side panels collapse into off-canvas sheets.
  - **Mobile (< 768px)**: 4-column layout. Gutters compress to `1rem` (`16px`), canvas outer margin sits at `1rem` (`16px`). Table cards transform into vertically stacked card units.

Use `space-xs` and `space-sm` for internal component padding (badges, pills, table cells). Reserve `space-lg` and `space-xl` for sectional transitions, header separations, and modular view boundaries.

## Elevation & Depth
Depth does not rely on opaque grey dropshadows, but rather on translucent glass surfaces, selective background blurs, and focused colored photoluminescence.

- **Layer 0 (Canvas Base)**: Solid `#09090F`.
- **Layer 1 (Recessed/Docked)**: Background `#12121C` at 80% opacity with `backdrop-filter: blur(16px)` and a subtle top border `rgba(255, 255, 255, 0.06)`.
- **Layer 2 (Cards & Active Elements)**: Background `#181824` at 60% opacity with `backdrop-filter: blur(12px)`. Enclosed by a low-contrast perimeter stroke of `1px solid rgba(255, 255, 255, 0.08)`.
- **Layer 3 (Overlays & Dialogs)**: Background `#12121C` at 92% opacity with `backdrop-filter: blur(24px)`, outlined by `rgba(139, 92, 246, 0.25)`, and cast with an ambient shadow: `0 24px 48px -12px rgba(0, 0, 0, 0.75), 0 0 32px -4px rgba(139, 92, 246, 0.12)`.
- **Active State Glow**: Hovered game cards, selected dates, and active session slots receive a localized violet corona: `0 0 20px -2px rgba(139, 92, 246, 0.35)` with an interior border illumination of `rgba(167, 139, 250, 0.6)`.

## Shapes
A balanced curvature framework (`roundedness: 2`) maintains a sleek, refined silhouette across all components:
- Standard inputs, buttons, and badges utilize `0.5rem` (`8px`).
- Game cards, dialog windows, and schedule panels utilize `1rem` (`16px`, `rounded-lg`).
- Feature banners and multi-panel schedule boards utilize `1.5rem` (`24px`, `rounded-xl`).
- Status indicators, player avatar frames, and attendance chips retain full circular geometry (`9999px`).

## Components

### Buttons
- **Primary**: Solid background `#8B5CF6`, text `#FFFFFF`, subtle gradient overlay towards `#A78BFA` at top edge. Hover introduces a violet luminous outer bloom (`box-shadow: 0 0 16px rgba(139, 92, 246, 0.45)`).
- **Secondary / Ghost Glass**: Background `rgba(255, 255, 255, 0.04)`, border `1px solid rgba(255, 255, 255, 0.1)`, text `#FFFFFF`. Hover transitions background to `rgba(255, 255, 255, 0.08)` and border to `rgba(167, 139, 250, 0.4)`.

### Cards (Game Showcase & Night Planner)
- Encapsulated in `rgba(24, 24, 36, 0.65)` glass, `border: 1px solid rgba(255, 255, 255, 0.07)`.
- On hover, cards smoothly shift transform `-2px` on the Y-axis, transitioning border color to `rgba(139, 92, 246, 0.4)` and engaging ambient glow.
- Game box artwork containers inside cards maintain an aspect ratio of 1:1 or 4:3 with corner radius `0.5rem`.

### Chips & Filter Tags
- Background `rgba(18, 18, 28, 0.8)`, border `1px solid rgba(255, 255, 255, 0.08)`, text `#A1A1AA`.
- Selected/Active chips switch to text `#FFFFFF`, background `rgba(139, 92, 246, 0.15)`, and border `rgba(139, 92, 246, 0.5)`.

### Form Inputs & Selectors
- Background `#09090F`, border `1px solid rgba(255, 255, 255, 0.12)`, text `#FFFFFF`, placeholder `#71717A`.
- Active focus state triggers an inner and outer stroke change to `#8B5CF6` with a soft purple focus ring (`box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2)`).

### Attendance Badges & Radios
- Radio indicators incorporate dual-ring styling: `2px solid rgba(255, 255, 255, 0.2)` resting; selected state fills with `#8B5CF6` centered with a white point.
- Attendance confirmation status pills leverage glowing dot indicators (e.g., green dot with `box-shadow: 0 0 8px #22C55E` for RSVP confirmed).

### Game Night Timeline / Slot Planner
- Time tracks and player queues render on frosted background strips with dotted dividers `rgba(255, 255, 255, 0.08)`. Filled player slots display circular avatar cutouts with overlapping `-space-xs` margins.
## Refined Product Scope (November 2026)

BoardNight remains a board-game collection and game-night planning application. Keep the established dark nocturnal visual identity, violet accents, glass surfaces, Plus Jakarta Sans headings, Inter body text, and responsive layouts.

### Core modules
- Landing page
- Login and signup
- Dashboard
- My Games
- Game Planner
- Borrowed Games
- Profile

### Lightweight social-play modules
These are intentionally basic features, not a full esports or social network platform:

1. **Match History**: manually record a game, date, participants, and winner. Display match history, wins, losses, and win percentage. Award a small XP amount for a completed match and a modest winner bonus.
2. **Player Ranking & XP**: show total XP, simple levels, progress to the next level, and a friends leaderboard ordered by XP. Avoid skill-rating algorithms, paid rewards, or complex ranking logic.
3. **Communities**: allow a user to create a small group, join using an invite code/request, view members, and coordinate upcoming game nights. No chat service, voice channels, Discord integration, or external community sync.
4. **Tournaments**: create a tournament for one board game, add participants, use a basic single-elimination bracket, manually record winners/scores, and show the champion. No advanced seeding or esports operations.

### Removed from scope
Food/potluck planning, provisions, snack/drink tracking, dietary preferences, Discord/voice/webhooks, BoardGameGeek synchronization, guild progression systems, complex custody/trust scoring, and advanced tournament operations are not part of the product.

### Navigation
Dashboard · My Games · Game Planner · Borrowed Games · Match History · Leaderboard · Communities · Tournaments · Profile.

### Data integrity and prototype note
Screens with sample records are visual prototypes only. Do not present sample values as live database records. In the implementation, calculate win rate from recorded matches and award XP once per saved match to avoid duplicate rewards. Tournament winners must come from recorded bracket results. Community membership must be tied to a user and group.
