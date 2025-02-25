/*
  # Database Schema Update
  
  1. Tables
    - Create offer_clicks and postbacks tables if they don't exist
    - Add necessary columns and constraints
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users (with existence checks)
    
  3. Functions
    - Add updated_at trigger function
    - Add postback processing function
*/

-- Create offer_clicks table
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
  postback_received boolean DEFAULT false,
  postback_status text,
  postback_amount numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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

-- Enable RLS
ALTER TABLE offer_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE postbacks ENABLE ROW LEVEL SECURITY;

-- Create policies with existence checks
DO $$ 
BEGIN
  -- Check and create offer_clicks policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offer_clicks' 
    AND policyname = 'Users can read their own clicks'
  ) THEN
    CREATE POLICY "Users can read their own clicks"
      ON offer_clicks
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'offer_clicks' 
    AND policyname = 'Users can create clicks'
  ) THEN
    CREATE POLICY "Users can create clicks"
      ON offer_clicks
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check and create postbacks policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'postbacks' 
    AND policyname = 'Users can read their own postbacks'
  ) THEN
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
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers with existence checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_offer_clicks_updated_at'
  ) THEN
    CREATE TRIGGER update_offer_clicks_updated_at
      BEFORE UPDATE
      ON offer_clicks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_postbacks_updated_at'
  ) THEN
    CREATE TRIGGER update_postbacks_updated_at
      BEFORE UPDATE
      ON postbacks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create or replace postback processing function
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