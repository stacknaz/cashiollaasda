-- Create tracking_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  event_type text NOT NULL,
  offer_id text,
  click_id text,
  aff_id text,
  custom_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'tracking_events' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Check if the select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tracking_events' 
    AND policyname = 'Users can view their own tracking events'
  ) THEN
    CREATE POLICY "Users can view their own tracking events"
      ON tracking_events
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Check if the insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tracking_events' 
    AND policyname = 'Users can insert their own tracking events'
  ) THEN
    CREATE POLICY "Users can insert their own tracking events"
      ON tracking_events
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_tracking_events_user_id ON tracking_events(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_event_type ON tracking_events(event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON tracking_events(created_at);