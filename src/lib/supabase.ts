import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment variables with fallbacks for development
const supabaseUrl = 'https://abrlgsvbyeujzswwuydw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicmxnc3ZieWV1anpzd3d1eWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MzU3NDMsImV4cCI6MjA1NjAxMTc0M30.hyoyNV-ybP84gLTl_6_zScGVeH9HJ97XW1qRAZogr84';

// Supabase client configuration with optimized settings
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'earnrewards'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Connection health check
let isHealthy = false;

const checkConnection = async () => {
  try {
    await supabase.from('offer_clicks').select('count', { count: 'exact', head: true });
    isHealthy = true;
    console.log('✅ Supabase connection successful');
  } catch (error) {
    isHealthy = false;
    console.error('❌ Supabase connection error:', error.message);
    // Retry connection after 5 seconds
    setTimeout(checkConnection, 5000);
  }
};

// Initial connection check
checkConnection();

// Export connection status
export const isSupabaseHealthy = () => isHealthy;