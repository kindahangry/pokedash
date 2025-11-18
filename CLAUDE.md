# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Studio Admin** is a modern Next.js admin dashboard template built with Next.js 15, TypeScript, Tailwind CSS v4, and shadcn/ui. The project demonstrates customizable theme presets, flexible layout controls, and multiple pre-built dashboard variants (Default, CRM, Finance).

## Development Commands

```bash
# Development
npm run dev                    # Start dev server with Turbopack
npm run build                  # Production build
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run format                 # Format all files with Prettier
npm run format:check           # Check formatting without making changes

# Theme Management
npm run generate:presets       # Generate theme preset configurations
```

## Architecture

### Colocation File System

The project uses a **colocation-based architecture** where features keep their pages, components, and logic inside their route folders. This makes the codebase modular and scalable.

```
src/
├── app/
│   ├── (external)/           # Public-facing pages (landing)
│   ├── (main)/
│   │   ├── auth/             # Authentication screens (login, register)
│   │   │   ├── v1/           # Auth version 1
│   │   │   ├── v2/           # Auth version 2
│   │   │   └── _components/  # Shared auth components
│   │   └── dashboard/        # Dashboard routes
│   │       ├── _components/  # Shared dashboard components (sidebar, etc.)
│   │       ├── default/      # Default dashboard with table & charts
│   │       ├── crm/          # CRM dashboard
│   │       ├── finance/      # Finance dashboard
│   │       └── layout.tsx    # Dashboard layout with sidebar
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn/ui components (auto-generated)
│   ├── data-table/           # Reusable TanStack Table components with DnD
│   └── simple-icon.tsx       # Icon utilities
├── config/                   # App-wide configuration
├── data/                     # Mock data (users, etc.)
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities (theme-utils, layout-utils, etc.)
├── server/                   # Server actions (cookie management)
├── styles/
│   └── presets/              # Theme preset CSS files
├── scripts/                  # Build scripts (theme preset generation)
└── types/
    └── preferences/          # TypeScript types for themes & layouts
```

### Key Architecture Patterns

#### Server-Side Preferences
Layout and theme preferences are managed via cookies and server actions:
- `src/server/server-actions.ts` - Server actions for reading/writing cookies
- `src/types/preferences/layout.ts` - Layout preference types (sidebar variant, content layout, navbar style)
- `src/types/preferences/theme.ts` - Theme preference types (mode, presets)
- Client-side utilities in `src/lib/theme-utils.ts` and `src/lib/layout-utils.ts` handle DOM updates

#### Dashboard Layout System
The dashboard layout ([src/app/(main)/dashboard/layout.tsx](src/app/(main)/dashboard/layout.tsx:27)) reads preferences from cookies and applies them server-side:
- **Sidebar Variants**: `inset`, `sidebar`, `floating`
- **Sidebar Collapsible**: `icon`, `offcanvas`
- **Content Layout**: `centered`, `full-width`
- **Navbar Style**: `sticky`, `scroll`

#### Theme System
Themes use CSS custom properties with Tailwind v4:
- Base theme defined in `src/app/globals.css`
- Presets in `src/styles/presets/` (tangerine, brutalist, soft-pop)
- Applied via `data-theme-preset` attribute on `<html>`
- Auto-generated configuration in `src/types/preferences/theme.ts` (see `generate:presets` script)

#### Data Tables
Reusable table components built with TanStack Table and dnd-kit:
- `src/components/data-table/data-table.tsx` - Core table with drag-and-drop support
- `src/hooks/use-data-table-instance.ts` - Hook for managing table state
- Dashboard-specific implementations in each dashboard's `_components/` folder

## Code Quality

### Pre-commit Hooks
Husky runs linting and formatting automatically on commit. Commits are blocked if there are errors.

### ESLint Configuration
The project uses a comprehensive ESLint setup ([eslint.config.mjs](eslint.config.mjs)):
- **Filename convention**: kebab-case enforced
- **Import ordering**: React/Next imports first, then external, then internal (alphabetized)
- **Complexity limits**: Max complexity 10, max file lines 300, max depth 4
- **TypeScript**: Strict type checking, prefer nullish coalescing
- **React**: No unstable nested components, memoized context values, no array index keys
- **Security**: eslint-plugin-security for common vulnerabilities
- **UI components ignored**: `src/components/ui` is excluded from linting (shadcn auto-generated)

### Path Aliases
Configured in [components.json](components.json) and tsconfig:
- `@/components` → `src/components`
- `@/ui` → `src/components/ui`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

## Theme Development

When adding new theme presets:
1. Create a new CSS file in `src/styles/presets/` (e.g., `my-theme.css`)
2. Define color variables using `oklch` color space
3. Run `npm run generate:presets` to update `src/types/preferences/theme.ts`
4. Import the preset in `src/app/globals.css`

## Dashboard Development

When creating new dashboard variants:
1. Create folder in `src/app/(main)/dashboard/[name]/`
2. Add `page.tsx` for the route
3. Place feature-specific components in `_components/` subfolder
4. Define data schemas using Zod in `_components/schema.ts`
5. Use TanStack Table columns pattern (see `default/_components/columns.tsx`)

## Configuration

- **Next.js config** ([next.config.mjs](next.config.mjs:1)): Console removal in production, `/dashboard` redirects to `/dashboard/default`
- **App metadata** ([src/config/app-config.ts](src/config/app-config.ts:1)): Centralized app name, version, copyright
- **shadcn config** ([components.json](components.json:1)): New York style, RSC mode, Lucide icons
