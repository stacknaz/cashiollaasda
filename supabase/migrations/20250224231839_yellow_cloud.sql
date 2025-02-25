/*
  # Create offer tracking tables

  1. New Tables
    - `offer_clicks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `offer_title` (text)
      - `offer_type` (text)
      - `reward` (numeric)
      - `clicked_at` (timestamp with time zone)
      - `completed_at` (timestamp with time zone, nullable)
      - `original_link` (text)
      - `status` (text, default: 'pending')

  2. Security
    - Enable RLS on `offer_clicks` table
    - Add policies for users to:
      - Read their own clicks
      - Create new click records
*/

CREATE TABLE IF NOT EXISTS offer_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  offer_title text NOT NULL,
  offer_type text NOT NULL,
  reward numeric NOT NULL,
  clicked_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  original_link text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE offer_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own clicks"
  ON offer_clicks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create clicks"
  ON offer_clicks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_offer_clicks_updated_at
  BEFORE UPDATE
  ON offer_clicks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();