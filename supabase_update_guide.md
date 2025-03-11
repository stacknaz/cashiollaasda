# Guide to Update Supabase Database Schema

Follow these steps to update your Supabase database schema to support the postback functionality:

## 1. Access Supabase SQL Editor

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar

## 2. Run the SQL Statements

1. Create a new query by clicking the "+" button
2. Copy and paste the SQL statements from the `update_schema.sql` file
3. Click "Run" to execute the statements

```sql
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

-- Update existing stored procedure to include new fields
CREATE OR REPLACE FUNCTION public.process_completed_offer(
  p_user_id UUID,
  p_offer_click_id UUID,
  p_reward_amount NUMERIC,
  p_postback_data JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_offer_history_id UUID;
BEGIN
  -- Insert into offer_history
  INSERT INTO public.offer_history (
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

  -- Update user stats
  PERFORM public.update_user_stats();

  RETURN v_offer_history_id;
END;
$$;
```

## 3. Verify the Changes

After running the SQL statements:

1. Go to the "Table Editor" in the left sidebar
2. Select the `offer_clicks` table
3. Verify that the new columns (`offer_id`, `tracking_id`, `postback_received`, `postback_amount`) have been added
4. Select the `offer_history` table
5. Verify that the new columns (`offer_id`, `tracking_id`) have been added

## 4. Test the Postback Functionality

Once the database schema has been updated, you can test the postback functionality:

1. Start your local server: `npm run dev`
2. Use the test script: `npm run test-postback <click_id> [payout] [offer_id]`
3. Check the server logs to ensure the postback is processed correctly
4. Verify in the database that the offer_clicks record has been updated with the postback information

## Troubleshooting

If you encounter any issues:

1. Check the Supabase SQL query logs for any error messages
2. Ensure that the tables `offer_clicks` and `offer_history` exist in your database
3. Make sure you have the necessary permissions to alter tables and create functions
4. If the function update fails, check if the original function signature matches your existing function 