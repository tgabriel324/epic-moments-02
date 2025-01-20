import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://blkuxfxwmcqziczwgsds.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa3V4Znh3bWNxemljendnc2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyNTg5NjksImV4cCI6MjA1MjgzNDk2OX0.G-SNH34svsBMbUxRPHcDqWt3WsXZr3kHr5h617fdXb8";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);