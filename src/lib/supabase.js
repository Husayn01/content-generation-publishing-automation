import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
// Note: In production, these should be securely stored in .env files.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-placeholder-project-id.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
