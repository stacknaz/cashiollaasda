/*
  # Fix User Stats RLS Policies

  1. Security
    - Update RLS policies for user_stats table
    - Add insert and update policies for authenticated users
    - Fix permissions for the create_user_stats function
*/

-- Update RLS policies for user_stats table
DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;

-- Create comprehensive policies
CREATE POLICY "Users can view their own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create increment function for numeric values
CREATE OR REPLACE FUNCTION increment(x numeric)
RETURNS numeric AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update create_user_stats function to be more robust
CREATE OR REPLACE FUNCTION public.create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (
    user_id,
    total_earnings,
    completed_offers,
    pending_offers,
    rejected_offers,
    success_rate,
    average_reward,
    daily_offers,
    streak_days,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    now(),
    now()
  )
  ON CONFLICT (user_id) 
  DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_stats();