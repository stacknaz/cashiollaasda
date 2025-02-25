/*
  # Performance Optimization
  
  1. Add Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for common query patterns
    
  2. Changes
    - Add index on offer_clicks(user_id, status)
    - Add index on offer_clicks(created_at)
    - Add index on postbacks(click_id, status)
    - Add index on postbacks(received_at)
*/

-- Add indexes to offer_clicks table
CREATE INDEX IF NOT EXISTS offer_clicks_user_id_status_idx 
  ON offer_clicks(user_id, status);

CREATE INDEX IF NOT EXISTS offer_clicks_created_at_idx 
  ON offer_clicks(created_at DESC);

-- Add indexes to postbacks table
CREATE INDEX IF NOT EXISTS postbacks_click_id_status_idx 
  ON postbacks(click_id, status);

CREATE INDEX IF NOT EXISTS postbacks_received_at_idx 
  ON postbacks(received_at DESC);

-- Add partial index for completed offers
CREATE INDEX IF NOT EXISTS offer_clicks_completed_idx 
  ON offer_clicks(user_id, completed_at) 
  WHERE status = 'completed';

-- Add partial index for pending postbacks
CREATE INDEX IF NOT EXISTS postbacks_pending_idx 
  ON postbacks(click_id) 
  WHERE status = 'pending';