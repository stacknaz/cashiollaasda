/*
  # Create offers table and sync functionality

  1. New Tables
    - `offers`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `link` (text)
      - `pub_date` (timestamptz)
      - `category` (text)
      - `reward` (decimal)
      - `country` (text)
      - `conversion` (text)
      - `type` (text)
      - `photo` (text)
      - `points` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `offers` table
    - Add policy for authenticated users to read offers
    - Add policy for service role to manage offers
*/

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  link text NOT NULL,
  pub_date timestamptz NOT NULL DEFAULT now(),
  category text,
  reward decimal(10,2) NOT NULL DEFAULT 0,
  country text,
  conversion text,
  type text,
  photo text,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read offers
CREATE POLICY "Anyone can read offers"
  ON offers
  FOR SELECT
  TO public
  USING (true);

-- Only service role can manage offers
CREATE POLICY "Service role can manage offers"
  ON offers
  USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();