/*
  # Create tracking events table

  1. New Tables
    - `tracking_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `event_type` (text)
      - `offer_id` (text)
      - `click_id` (text)
      - `aff_id` (text)
      - `custom_data` (jsonb)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `tracking_events` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
*/

-- Create tracking_events table
CREATE TABLE IF NOT EXISTS tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  event_type text NOT NULL,
  offer_id text,
  click_id text,
  aff_id text,
  custom_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tracking events"
  ON tracking_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tracking events"
  ON tracking_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tracking_events_user_id ON tracking_events(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_event_type ON tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON tracking_events(created_at);