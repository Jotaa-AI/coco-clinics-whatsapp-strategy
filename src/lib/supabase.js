import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Faltan las variables de entorno de Supabase.');
}

export const supabase = createClient(
  supabaseUrl || 'https://ncwttacnfaurorpsnbdv.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jd3R0YWNuZmF1cm9ycHNuYmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjM3NTQsImV4cCI6MjA5MDAzOTc1NH0.Iskralg_UbfMA9LFAaaj3XzXHuSNtCCWcNQuerazHgw'
);
