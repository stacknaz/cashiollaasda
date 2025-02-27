/*
  # Add User Stats Trigger

  1. New Functions
    - create_user_stats(): Creates user stats record when new user signs up
  
  2. Triggers
    - user_created: Trigger on auth.users to create stats record
  
  3. Changes
    - Adds default values for user stats columns
    - Ensures stats record exists for all users
*/

-- Create function to initialize user stats
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_stats();

-- Create missing stats records for existing users
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
)
SELECT 
  id as user_id,
  0 as total_earnings,
  0 as completed_offers,
  0 as pending_offers,
  0 as rejected_offers,
  0 as success_rate,
  0 as average_reward,
  0 as daily_offers,
  0 as streak_days,
  now() as created_at,
  now() as updated_at
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_stats WHERE user_stats.user_id = users.id
);