# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pokedash** is a Pokemon card analytics dashboard built with Next.js 15, TypeScript, Tailwind CSS v4, and shadcn/ui. The project provides real-time market data, price tracking, and vendor performance analytics for Pokemon cards.

## Development Commands

```bash
# Development
npm run dev                    # Start dev server with Turbopack
npm run build                  # Production build
npm run start                  # Start production server

# Code Quality
npm run format                 # Format all files with Prettier
npm run format:check           # Check formatting without making changes
```

## Architecture

### Project Structure

```
src/
├── app/
│   ├── (external)/           # Public-facing pages
│   ├── (main)/
│   │   └── dashboard/        # Dashboard routes
│   │       ├── _components/  # Shared dashboard components (sidebar, etc.)
│   │       ├── market/       # Market overview page
│   │       ├── overview/     # Main dashboard
│   │       └── layout.tsx    # Dashboard layout with sidebar
│   └── layout.tsx            # Root layout
├── components/
│   └── ui/                   # shadcn/ui components
├── config/                   # App-wide configuration
├── server/                   # Server actions (Supabase queries)
├── lib/                      # Utilities
└── navigation/               # Navigation configuration
```

### Key Features

#### Server Actions
Data fetching is handled via server actions in `src/server/server-actions.ts`:
- `getIndexCards()` - Fetches card data with price information
- `getPokemonIndexData()` - Fetches Pokemon index data
- `getVendorPerformanceData()` - Fetches vendor performance metrics
- `getCombinedChartData()` - Fetches combined chart data

#### Database Integration
The application uses Supabase for data storage:
- **cards** table: Card information with `image_url` field
- **card_prices_graded** table: Historical price data with `card_id`, `date`, `price_usd`, `grade`
- **vendor_performance_linear** table: Vendor metrics with `normalized_value`

#### Price Fetching Logic
The price fetching system:
1. Fetches today's and yesterday's prices for all cards
2. For cards missing today's price, fetches the 2 most recent prices
3. Uses the most recent as current price and second most recent as previous price
4. Batches queries to avoid N+1 performance issues

#### Sidebar Navigation
- Sidebar state is managed via cookies
- Open by default, can be minimized
- Navigation items can be marked as "coming soon" with `comingSoon: true`

## Configuration

- **Next.js config** ([next.config.mjs](next.config.mjs:1)): Console removal in production, redirects configured
- **App metadata** ([src/config/app-config.ts](src/config/app-config.ts:1)): Centralized app name and configuration
- **shadcn config** ([components.json](components.json:1)): New York style, RSC mode, Lucide icons

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Code Quality

- Prettier for code formatting
- TypeScript for type safety
- Path aliases configured (`@/` prefix for `src/`)
