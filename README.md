# Pokedash

A Pokemon card analytics dashboard built with Next.js, providing real-time market data, price tracking, and vendor performance analytics.

## Features

- **Market Overview**: Browse Pokemon cards with current prices and 24-hour price changes
- **Price Tracking**: Real-time price data from graded card markets
- **Vendor Analytics**: Performance metrics and normalized value tracking
- **Modern UI**: Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar

## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Environment variables configured (see below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pokedash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

### Database Setup

The application requires the following Supabase tables:
- `cards` - Card information with images and metadata
- `card_prices_graded` - Historical price data for graded cards
- `vendor_performance_linear` - Vendor performance metrics

Ensure Row Level Security (RLS) policies are configured appropriately for your use case.

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── (main)/            # Main application routes
│   │   └── dashboard/     # Dashboard pages
│   │       ├── market/    # Market overview
│   │       ├── overview/   # Main dashboard
│   │       └── ...
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── config/                # App configuration
├── server/                # Server actions and API logic
└── lib/                   # Utilities and helpers
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run format` - Format code with Prettier

## License

MIT License - see LICENSE file for details
