/*
  # Add postback tracking

  1. New Tables
    - `postbacks`
      - `id` (uuid, primary key)
      - `click_id` (uuid, references offer_clicks)
      - `status` (text)
      - `payout` (numeric)
      - `received_at` (timestamptz)
      - `ip_address` (text)
      - `user_agent` (text)
      - `raw_data` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Add `postback_received` column to offer_clicks
    - Add `postback_status` column to offer_clicks
    - Add `postback_amount` column to offer_clicks

  3. Security
    - Enable RLS on postbacks table
    - Add policies for authenticated users
*/

-- Create postbacks table
CREATE TABLE IF NOT EXISTS postbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  click_id uuid REFERENCES offer_clicks(id) NOT NULL,
  status text NOT NULL,
  payout numeric,
  received_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  raw_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add columns to offer_clicks
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offer_clicks' AND column_name = 'postback_received'
  ) THEN
    ALTER TABLE offer_clicks ADD COLUMN postback_received boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offer_clicks' AND column_name = 'postback_status'
  ) THEN
    ALTER TABLE offer_clicks ADD COLUMN postback_status text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offer_clicks' AND column_name = 'postback_amount'
  ) THEN
    ALTER TABLE offer_clicks ADD COLUMN postback_amount numeric;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE postbacks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own postbacks"
  ON postbacks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM offer_clicks
      WHERE offer_clicks.id = postbacks.click_id
      AND offer_clicks.user_id = auth.uid()
    )
  );

-- Create updated_at trigger for postbacks
CREATE TRIGGER update_postbacks_updated_at
  BEFORE UPDATE
  ON postbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to process postbacks
CREATE OR REPLACE FUNCTION process_postback(
  p_click_id uuid,
  p_status text,
  p_payout numeric,
  p_ip_address text,
  p_user_agent text,
  p_raw_data jsonb
) RETURNS uuid AS $$
DECLARE
  v_postback_id uuid;
BEGIN
  -- Insert postback record
  INSERT INTO postbacks (
    click_id,
    status,
    payout,
    ip_address,
    user_agent,
    raw_data
  ) VALUES (
    p_click_id,
    p_status,
    p_payout,
    p_ip_address,
    p_user_agent,
    p_raw_data
  ) RETURNING id INTO v_postback_id;

  -- Update offer_clicks
  UPDATE offer_clicks SET
    postback_received = true,
    postback_status = p_status,
    postback_amount = p_payout,
    status = CASE 
      WHEN p_status = 'completed' THEN 'completed'
      WHEN p_status = 'rejected' THEN 'rejected'
      ELSE status
    END,
    updated_at = now()
  WHERE id = p_click_id;

  RETURN v_postback_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;