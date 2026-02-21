import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Server-side Supabase client for database operations (uses service key, bypasses RLS)
export const db = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

// Generate a unique ID for new records
export function generateId(): string {
  return crypto.randomUUID();
}

// Get current ISO timestamp
export function now(): string {
  return new Date().toISOString();
}
