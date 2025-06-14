import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;
