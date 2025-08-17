import { createClient } from '@supabase/supabase-js'

// Production environment variables with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qwxghpwasmvottahchky.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGdocHdhc212b3R0YWhjaGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTI3NTksImV4cCI6MjA2ODQ4ODc1OX0.4a1Oc66k9mGmXLoHmrKyZiVeZISpyzgq1BERrb_-8n8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)