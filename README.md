# Weather Forecaster

A React web application for weather forecasting with storm tracking, alerts, and location management.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **CSS** (custom, no framework)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.tsx     # Sidebar navigation layout
│   ├── WeatherCard.tsx    # Current weather display
│   └── HourlyTimeline.tsx # Hourly forecast scroll
├── pages/             # Page components (routes)
│   ├── SearchPage.tsx     # UC1: Search by zip code
│   ├── ForecastPage.tsx   # UC2: Hourly forecast
│   ├── StormPage.tsx      # UC4: Storm tracking
│   ├── AlertsPage.tsx     # UC3/UC6: Alert settings
│   └── ProfilePage.tsx    # UC3: Saved locations
├── services/          # API / data layer
│   └── weatherService.ts  # Mock data (replace with real API)
├── types/             # TypeScript interfaces
│   └── index.ts           # All domain models
├── App.tsx            # Router setup
├── main.tsx           # Entry point
└── index.css          # Global styles & theme
```

## Pages

| Route | Feature | Use Case |
|-------|---------|----------|
| `/search` | Search weather by city/ZIP | UC1 |
| `/forecast` | 24-hour hourly forecast | UC2 |
| `/storm` | Storm/radar tracking | UC4 |
| `/alerts` | Set weather alert thresholds | UC3, UC6 |
| `/profile` | Manage saved locations | UC3 |

## Design

The app uses a dark theme with CSS custom properties defined in `index.css`. All colors, spacing, and breakpoints are centralized in `:root` for easy theming.

## Mock Data

The `services/weatherService.ts` file contains mock data with simulated network delays. Replace these functions with real API calls when integrating a weather provider.
