-- Create pokemon_prices table for storing card price data
-- This table stores historical price data for Pokemon cards by grade

CREATE TABLE IF NOT EXISTS public.pokemon_prices (
  id BIGSERIAL PRIMARY KEY,
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one price per card/grade/date combination
  UNIQUE(card_id, grade, date)
);

-- Create index for faster queries by card_id
CREATE INDEX IF NOT EXISTS idx_pokemon_prices_card_id ON public.pokemon_prices(card_id);

-- Create index for faster queries by date
CREATE INDEX IF NOT EXISTS idx_pokemon_prices_date ON public.pokemon_prices(date);

-- Create index for faster queries by card_id and date (for price history)
CREATE INDEX IF NOT EXISTS idx_pokemon_prices_card_id_date ON public.pokemon_prices(card_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pokemon_prices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- Adjust this based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON public.pokemon_prices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policy to allow public read access (if you want the prices to be publicly readable)
-- Uncomment if needed:
-- CREATE POLICY "Allow public read access" ON public.pokemon_prices
--   FOR SELECT
--   USING (true);

-- Add comment to table
COMMENT ON TABLE public.pokemon_prices IS 'Stores historical price data for Pokemon cards by grade and date';

