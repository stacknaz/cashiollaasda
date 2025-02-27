/*
  # Referral System Implementation

  1. New Tables
    - `referrals`
      - `id` (uuid, primary key)
      - `referrer_id` (uuid, references auth.users)
      - `referred_id` (uuid, references auth.users)
      - `status` (text)
      - `earnings` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `referral_earnings`
      - `id` (uuid, primary key)
      - `referral_id` (uuid, references referrals)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric)
      - `source_offer_id` (uuid, references offer_clicks)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
    
  3. Functions
    - Create function to process referral earnings
    - Create function to track referral signups
*/

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES auth.users NOT NULL,
  referred_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  earnings numeric NOT NULL DEFAULT 0,
  commission_rate numeric NOT NULL DEFAULT 0.1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_id)
);

-- Create referral_earnings table
CREATE TABLE IF NOT EXISTS referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid REFERENCES referrals NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  source_offer_id uuid REFERENCES offer_clicks,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

-- Create policies for referrals
CREATE POLICY "Users can view their own referrals as referrer"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view their own referral as referred"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = referred_id);

-- Create policies for referral_earnings
CREATE POLICY "Users can view their own referral earnings"
  ON referral_earnings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger for referrals
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE
  ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to process referral earnings when an offer is completed
CREATE OR REPLACE FUNCTION process_referral_earnings()
RETURNS TRIGGER AS $$
DECLARE
  v_referral_id uuid;
  v_referrer_id uuid;
  v_commission_rate numeric;
  v_commission_amount numeric;
BEGIN
  -- Check if the user has a referrer
  SELECT id, referrer_id, commission_rate
  INTO v_referral_id, v_referrer_id, v_commission_rate
  FROM referrals
  WHERE referred_id = NEW.user_id
  AND status = 'active';

  -- If user has an active referral, calculate and record commission
  IF v_referral_id IS NOT NULL THEN
    -- Calculate commission (default 10%)
    v_commission_amount := NEW.reward * v_commission_rate;
    
    -- Record the referral earning
    INSERT INTO referral_earnings (
      referral_id,
      user_id,
      amount,
      source_offer_id
    ) VALUES (
      v_referral_id,
      v_referrer_id,
      v_commission_amount,
      NEW.id
    );
    
    -- Update total earnings for the referral
    UPDATE referrals
    SET earnings = earnings + v_commission_amount,
        updated_at = now()
    WHERE id = v_referral_id;
    
    -- Update referrer's total earnings
    UPDATE user_stats
    SET total_earnings = total_earnings + v_commission_amount,
        updated_at = now()
    WHERE user_id = v_referrer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to process referral earnings when an offer is completed
CREATE TRIGGER process_referral_on_offer_completion
  AFTER UPDATE OF status
  ON offer_clicks
  FOR EACH ROW
  WHEN (OLD.status <> 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION process_referral_earnings();

-- Function to track referral signups
CREATE OR REPLACE FUNCTION track_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_referral_code text;
  v_referrer_id uuid;
  v_commission_rate numeric := 0.1; -- Default 10%
BEGIN
  -- Get referral code from user metadata
  v_referral_code := NEW.raw_user_meta_data->>'referred_by';
  
  -- If referral code exists, find the referrer
  IF v_referral_code IS NOT NULL THEN
    -- Find the referrer by their referral code
    SELECT id
    INTO v_referrer_id
    FROM auth.users
    WHERE raw_user_meta_data->>'referral_code' = v_referral_code;
    
    -- If referrer found, create the referral record
    IF v_referrer_id IS NOT NULL THEN
      -- Check if referrer has enough referrals for higher commission
      DECLARE
        v_active_referrals integer;
      BEGIN
        SELECT COUNT(*)
        INTO v_active_referrals
        FROM referrals
        WHERE referrer_id = v_referrer_id
        AND status = 'active';
        
        -- Adjust commission rate based on number of active referrals
        IF v_active_referrals >= 25 THEN
          v_commission_rate := 0.25; -- 25%
        ELSIF v_active_referrals >= 10 THEN
          v_commission_rate := 0.20; -- 20%
        ELSIF v_active_referrals >= 5 THEN
          v_commission_rate := 0.15; -- 15%
        END IF;
      END;
      
      -- Create the referral record
      INSERT INTO referrals (
        referrer_id,
        referred_id,
        status,
        commission_rate
      ) VALUES (
        v_referrer_id,
        NEW.id,
        'pending',
        v_commission_rate
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to track referral signups
CREATE TRIGGER track_referral_on_signup
  AFTER INSERT
  ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION track_referral_signup();

-- Function to activate referrals after user completes 3 offers
CREATE OR REPLACE FUNCTION activate_referral()
RETURNS TRIGGER AS $$
DECLARE
  v_completed_offers integer;
BEGIN
  -- Count completed offers for the user
  SELECT COUNT(*)
  INTO v_completed_offers
  FROM offer_clicks
  WHERE user_id = NEW.user_id
  AND status = 'completed';
  
  -- If user has completed at least 3 offers, activate their referral
  IF v_completed_offers >= 3 THEN
    UPDATE referrals
    SET status = 'active',
        updated_at = now()
    WHERE referred_id = NEW.user_id
    AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to activate referrals
CREATE TRIGGER activate_referral_on_offer_completion
  AFTER UPDATE OF status
  ON offer_clicks
  FOR EACH ROW
  WHEN (OLD.status <> 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION activate_referral();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_user_id ON referral_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_referral_id ON referral_earnings(referral_id);