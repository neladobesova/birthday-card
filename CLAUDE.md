# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive birthday card web application built with React 19 + Vite. Features a gift reveal system with an embedded calendar for selecting a weekend trip date range.

## Development Commands

```bash
npm run dev      # Start Vite dev server with HMR at http://localhost:5173
npm run build    # Production build to /dist directory
npm run preview  # Preview production build locally
npm run lint     # Run ESLint code quality checks
```

## Tech Stack

- **Framework**: React 19.2.0 (functional components with hooks only)
- **Build Tool**: Vite 7.3.1 with @vitejs/plugin-react (Babel-based Fast Refresh)
- **Styling**: Tailwind CSS 4.1.18 + DaisyUI 5.5.18
- **Linting**: ESLint 9 (flat config format)
- **Testing**: None configured

## Architecture

### Component Structure

Single-file architecture in [src/App.jsx](src/App.jsx) (226 lines):
- `App()` - Main component containing all state management
- `Calendar()` - Embedded calendar component at bottom of file

All state is managed in the App component using React hooks (useState, useMemo). No Redux, Context API, or other state management libraries.

### State Management Pattern

The app manages multiple UI states:
```javascript
const [confirmed, setConfirmed] = useState(false);           // Weekend selection confirmed
const [weekend, setWeekend] = useState("");                   // Selected weekend string
const [showRevealModal, setShowRevealModal] = useState(false); // "What's my gift?" modal
const [showGiftCard, setShowGiftCard] = useState(false);      // Gift card visibility
const [showCalendar, setShowCalendar] = useState(false);      // Calendar visibility
const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
```

### Customization: Available Dates

Available dates for the weekend trip are configured in the `availableDates` array (lines 14-26):

```javascript
const availableDates = useMemo(
  () => [
    "2026-03-06",
    "2026-03-07",
    // ... add more ISO date strings
  ],
  [],
);
```

**Format**: ISO 8601 date strings (yyyy-mm-dd). Modify this array to change which dates are selectable in the calendar.

### Calendar Range Selection Logic

The calendar allows selecting a date range (start and end dates):
1. First click on an available date sets `start`, clears `end`
2. Second click sets `end` (or resets if both were already set)
3. Dates are automatically ordered chronologically
4. Only dates in `availableDates` array are clickable

## Styling Architecture

Dual styling system:

1. **Tailwind CSS + DaisyUI** ([src/index.css](src/index.css))
   - Custom "birthday" theme with oklch color space
   - Primary: Pink (330° hue), Secondary: Gold (60° hue), Accent: Sky blue (220° hue)

2. **Custom CSS Variables** ([src/App.css](src/App.css))
   - Legacy CSS custom properties: `--bg1`, `--bg2`, `--accent`, `--accent-2`, `--card`, `--muted`
   - Component-specific classes: `.card`, `.btn`, `.modal*`, `.calendar*`
   - Gradient backgrounds at 135° and 180° angles

**Media Query**: 520px breakpoint for responsive title sizing.

## File Structure

```
src/
├── main.jsx              - React entry point (ReactDOM.createRoot)
├── App.jsx               - Main component with app state management
├── App.css               - Custom CSS with variables and component styles
├── index.css             - Tailwind + DaisyUI theme configuration
├── components/
│   ├── AuthFlow.jsx      - Authentication challenge component
│   ├── FuckYouPage.jsx   - Rejection page for wrong answers
│   ├── Slideshow.jsx     - Auto-scroll slideshow component
│   ├── GiftSection.jsx   - Gift reveal and destination selection
│   ├── ConfettiAnimation.jsx - Confetti effect
│   └── AudioPlayer.jsx   - Background music player
├── hooks/
│   └── useDiscordWebhook.js - Analytics tracking via Discord
└── utils/
    └── env.js            - Environment variable helpers
```

## Auto-Scroll Slideshow Feature

The slideshow supports automatic scrolling through slides with these behaviors:

### Configuration (`.env` variables)

- `VITE_AUTO_SCROLL_ENABLED`: Set to `"true"` to enable auto-scroll (default: disabled if not set)
- `VITE_AUTO_SCROLL_INTERVAL`: Milliseconds between slide transitions (default: 5000ms / 5 seconds)
- `VITE_SCROLL_INDICATOR_TEXT`: Custom text for scroll indicator when auto-scroll is off (default: "Swipe down")

### Behavior

1. **Auto-advance**: Automatically scrolls to the next slide after the configured interval
2. **Smooth easing**: Uses CSS `scroll-behavior: smooth` for gentle transitions with native browser easing
3. **Stops at end**: Auto-scrolling stops when reaching the last slide (with the "Ukaž dáreček 🎁" button)
4. **Manual override**: Any user scroll interaction permanently disables auto-scroll for that session
5. **Scroll tracking**: First scroll event (>50px) triggers analytics via `onScroll()` callback
6. **Visual indicator**: When auto-scroll is disabled, a bouncing "Swipe down ↓" indicator appears on the first slide, disappearing after the user scrolls

### Implementation Details

- State managed in [src/components/Slideshow.jsx](src/components/Slideshow.jsx) using `useState` and `useEffect`
- Uses `setTimeout` for intervals and `scrollTo({ behavior: 'smooth' })` for transitions
- Detects manual interaction via scroll event listener with `userInteractedRef`
- Current slide calculated from scroll position divided by viewport height
- Auto-scroll timer cleared on component unmount or manual interaction

## Known Quirks

1. **No Testing Infrastructure**: No test framework installed (no Jest, Vitest, or React Testing Library).

2. **ESLint Custom Rule**: `no-unused-vars` configured to ignore uppercase variable names (varsIgnorePattern: '^[A-Z_]') to allow unused React component imports.

## Build Configuration

- **Vite Config** ([vite.config.js](vite.config.js)): Minimal setup with React and Tailwind plugins
- **ESLint Config** ([eslint.config.js](eslint.config.js)): Flat config format with React Hooks and React Refresh rules
- **Entry Point**: [index.html](index.html) → `/src/main.jsx` (ES module)
- **Output**: `/dist` directory (git-ignored)
