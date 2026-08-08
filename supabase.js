const SUPABASE_URL = "https://vmrnldfrhthohmnapznc.supabase.co";

const SUPABASE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
