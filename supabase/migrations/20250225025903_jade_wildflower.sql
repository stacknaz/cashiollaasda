/*
  # Postback Tracking Enhancement

  1. New Tables
    - `completed_offers`
      - Tracks completed offers with rewards and verification status
    - `offer_rewards`
      - Stores reward multipliers and bonus calculations

  2. Functions
    - `calculate_offer_reward`: Calculates final reward with multipliers
    - `process_completed_offer`: Handles offer completion and reward distribution

  3. Triggers
    - Auto-updates user stats on offer completion
    - Maintains daily and streak tracking
*/

-- Create completed_offers table
CREATE TABLE IF NOT EXISTS completed_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  offer_click_id uuid REFERENCES offer_clicks(id) NOT NULL,
  reward_amount numeric NOT NULL,
  final_reward numeric NOT NULL,
  multiplier numeric NOT NULL DEFAULT 1,
  completed_at timestamptz NOT NULL DEFAULT now(),
  verification_status text NOT NULL DEFAULT 'pending',
  postback_data jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create offer_rewards table
CREATE TABLE IF NOT EXISTS offer_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  reward_type text NOT NULL,
  multiplier numeric NOT NULL DEFAULT 1,
  valid_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, reward_type)
);

-- Enable RLS
ALTER TABLE completed_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their completed offers"
  ON completed_offers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their rewards"
  ON offer_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to calculate offer reward
CREATE OR REPLACE FUNCTION calculate_offer_reward(
  p_user_id uuid,
  p_base_reward numeric
)
RETURNS numeric AS $$
DECLARE
  v_multiplier numeric := 1;
  v_final_reward numeric;
BEGIN
  -- Get the highest active multiplier
  SELECT COALESCE(MAX(multiplier), 1)
  INTO v_multiplier
  FROM offer_rewards
  WHERE user_id = p_user_id
  AND (valid_until IS NULL OR valid_until > now());

  -- Calculate final reward
  v_final_reward := p_base_reward * v_multiplier;

  RETURN v_final_reward;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to process completed offer
CREATE OR REPLACE FUNCTION process_completed_offer(
  p_user_id uuid,
  p_offer_click_id uuid,
  p_reward_amount numeric,
  p_postback_data jsonb
)
RETURNS uuid AS $$
DECLARE
  v_completed_offer_id uuid;
  v_final_reward numeric;
  v_daily_offers integer;
  v_streak_days integer;
BEGIN
  -- Calculate final reward with multipliers
  v_final_reward := calculate_offer_reward(p_user_id, p_reward_amount);

  -- Insert completed offer record
  INSERT INTO completed_offers (
    user_id,
    offer_click_id,
    reward_amount,
    final_reward,
    multiplier,
    verification_status,
    postback_data
  ) VALUES (
    p_user_id,
    p_offer_click_id,
    p_reward_amount,
    v_final_reward,
    v_final_reward / p_reward_amount,
    'verified',
    p_postback_data
  ) RETURNING id INTO v_completed_offer_id;

  -- Update offer click status
  UPDATE offer_clicks SET
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  WHERE id = p_offer_click_id;

  -- Update daily offers count
  SELECT COUNT(*)
  INTO v_daily_offers
  FROM completed_offers
  WHERE user_id = p_user_id
  AND completed_at::date = CURRENT_DATE;

  -- Update streak
  SELECT COUNT(DISTINCT completed_at::date)
  INTO v_streak_days
  FROM completed_offers
  WHERE user_id = p_user_id
  AND completed_at >= CURRENT_DATE - INTERVAL '7 days';

  -- Update user stats
  UPDATE user_stats SET
    total_earnings = total_earnings + v_final_reward,
    completed_offers = completed_offers + 1,
    daily_offers = v_daily_offers,
    streak_days = v_streak_days,
    last_offer_at = now(),
    updated_at = now()
  WHERE user_id = p_user_id;

  RETURN v_completed_offer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add new columns to user_stats
ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS daily_offers integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_days integer DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_completed_offers_user_date ON completed_offers(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_offer_rewards_user_valid ON offer_rewards(user_id, valid_until);