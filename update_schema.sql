-- SQL statements to update the database schema

-- Add new columns to offer_clicks table
ALTER TABLE public.offer_clicks 
ADD COLUMN IF NOT EXISTS offer_id TEXT,
ADD COLUMN IF NOT EXISTS tracking_id TEXT,
ADD COLUMN IF NOT EXISTS postback_received BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS postback_amount NUMERIC(10, 2);

-- Add new columns to offer_history table
ALTER TABLE public.offer_history 
ADD COLUMN IF NOT EXISTS offer_id TEXT,
ADD COLUMN IF NOT EXISTS tracking_id TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_offer_clicks_offer_id ON public.offer_clicks(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_history_offer_id ON public.offer_history(offer_id);

-- Drop existing get_table_columns function if it exists
DROP FUNCTION IF EXISTS public.get_table_columns;

-- Create function to get table columns
CREATE OR REPLACE FUNCTION public.get_table_columns(p_table_name text)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN ARRAY(
    SELECT c.column_name::text
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = p_table_name
    ORDER BY c.ordinal_position
  );
END;
$$;

-- Update the RLS (Row Level Security) policies if needed
-- Note: Only run this if you have RLS enabled and need to update policies

-- Example policy update (uncomment if needed):
-- DROP POLICY IF EXISTS "Users can view their own offer clicks" ON public.offer_clicks;
-- CREATE POLICY "Users can view their own offer clicks" 
-- ON public.offer_clicks FOR SELECT 
-- USING (auth.uid() = user_id);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.process_completed_offer;

-- Create the updated stored procedure with TEXT types
CREATE OR REPLACE FUNCTION public.process_completed_offer(
  p_user_id TEXT,
  p_offer_click_id TEXT,
  p_reward_amount NUMERIC,
  p_postback_data JSONB
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_offer_history_id TEXT;
BEGIN
  -- Insert into offer_history
  INSERT INTO public.offer_history (
    id,
    user_id, 
    offer_click_id, 
    status, 
    reward, 
    completed_at, 
    details,
    offer_id,
    tracking_id,
    created_at, 
    updated_at
  )
  VALUES (
    gen_random_uuid()::text,
    p_user_id,
    p_offer_click_id,
    'completed',
    p_reward_amount,
    NOW(),
    p_postback_data,
    p_postback_data->>'offer_id',
    p_postback_data->>'tracking_id',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_offer_history_id;

  -- Update the offer_clicks record
  UPDATE public.offer_clicks
  SET 
    status = 'completed',
    completed_at = NOW(),
    postback_received = TRUE,
    postback_amount = p_reward_amount,
    updated_at = NOW()
  WHERE id = p_offer_click_id;

  -- Update user stats
  PERFORM public.update_user_stats();

  RETURN v_offer_history_id;
END;
$$;
