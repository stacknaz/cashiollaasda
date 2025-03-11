/*
  # Fix Offer History Creation
  
  1. Changes
    - Update update_user_stats function to copy offer_id and tracking_id
    - Ensure postback data is properly tracked in offer history
*/

-- Update the function to include offer_id and tracking_id
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

  -- Create history entry with offer_id and tracking_id
  INSERT INTO offer_history (
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
  ) VALUES (
    NEW.user_id,
    NEW.id,
    NEW.status,
    NEW.reward,
    NEW.completed_at,
    jsonb_build_object(
      'device_info', NEW.device_info,
      'category', NEW.category,
      'points', NEW.points,
      'postback_received', NEW.postback_received,
      'postback_amount', NEW.postback_amount
    ),
    NEW.offer_id,
    NEW.tracking_id,
    now(),
    now()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 