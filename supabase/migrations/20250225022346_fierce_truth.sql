/*
  # Add Offer History Tables

  1. New Tables
    - `offer_history`
      - Tracks detailed history of user's offer interactions
      - Includes status changes, rewards, and completion details
    
    - `user_stats`
      - Stores aggregated user statistics
      - Tracks lifetime earnings, completion rates, etc.

  2. Changes
    - Add new columns to `offer_clicks` for better tracking
    - Add foreign key relationships
    - Add computed columns for statistics

  3. Security
    - Enable RLS on new tables
    - Add policies for user access
    - Ensure data privacy
*/

-- Create offer_history table
CREATE TABLE IF NOT EXISTS offer_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  offer_click_id uuid REFERENCES offer_clicks(id) NOT NULL,
  status text NOT NULL,
  reward numeric NOT NULL,
  completed_at timestamptz,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users NOT NULL,
  total_earnings numeric DEFAULT 0,
  completed_offers integer DEFAULT 0,
  pending_offers integer DEFAULT 0,
  rejected_offers integer DEFAULT 0,
  success_rate numeric DEFAULT 0,
  average_reward numeric DEFAULT 0,
  last_offer_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to offer_clicks
ALTER TABLE offer_clicks ADD COLUMN IF NOT EXISTS device_info jsonb DEFAULT '{}';
ALTER TABLE offer_clicks ADD COLUMN IF NOT EXISTS completion_time interval;
ALTER TABLE offer_clicks ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE offer_clicks ADD COLUMN IF NOT EXISTS points integer DEFAULT 0;

-- Enable RLS
ALTER TABLE offer_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for offer_history
CREATE POLICY "Users can view their own history"
  ON offer_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user stats
  INSERT INTO user_stats (user_id)
  VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_earnings = (
      SELECT COALESCE(SUM(reward), 0)
      FROM offer_clicks
      WHERE user_id = NEW.user_id
      AND status = 'completed'
    ),
    completed_offers = (
      SELECT COUNT(*)
      FROM offer_clicks
      WHERE user_id = NEW.user_id
      AND status = 'completed'
    ),
    pending_offers = (
      SELECT COUNT(*)
      FROM offer_clicks
      WHERE user_id = NEW.user_id
      AND status = 'pending'
    ),
    rejected_offers = (
      SELECT COUNT(*)
      FROM offer_clicks
      WHERE user_id = NEW.user_id
      AND status = 'rejected'
    ),
    success_rate = (
      SELECT 
        CASE 
          WHEN COUNT(*) > 0 THEN 
            ROUND(
              (COUNT(*) FILTER (WHERE status = 'completed')::numeric / 
              COUNT(*)::numeric) * 100,
              2
            )
          ELSE 0
        END
      FROM offer_clicks
      WHERE user_id = NEW.user_id
    ),
    average_reward = (
      SELECT COALESCE(AVG(reward), 0)
      FROM offer_clicks
      WHERE user_id = NEW.user_id
      AND status = 'completed'
    ),
    last_offer_at = NEW.created_at,
    updated_at = now();

  -- Create history entry
  INSERT INTO offer_history (
    user_id,
    offer_click_id,
    status,
    reward,
    completed_at,
    details
  ) VALUES (
    NEW.user_id,
    NEW.id,
    NEW.status,
    NEW.reward,
    NEW.completed_at,
    jsonb_build_object(
      'device_info', NEW.device_info,
      'category', NEW.category,
      'points', NEW.points
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for offer_clicks
CREATE TRIGGER update_user_stats_on_offer_change
  AFTER INSERT OR UPDATE
  ON offer_clicks
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_offer_history_user_id ON offer_history(user_id);
CREATE INDEX IF NOT EXISTS idx_offer_history_created_at ON offer_history(created_at);
CREATE INDEX IF NOT EXISTS idx_offer_clicks_status ON offer_clicks(status);
CREATE INDEX IF NOT EXISTS idx_offer_clicks_user_completed ON offer_clicks(user_id, status) WHERE status = 'completed';