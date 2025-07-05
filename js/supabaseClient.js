// js/supabaseClient.js

const SUPABASE_URL = "https://smztbdfxsjdfuijzxuit.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtenRiZGZ4c2pkZnVpanp4dWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NzQyODEsImV4cCI6MjA2NzI1MDI4MX0.cI9r1bqIuHY8Y2eQ8t7CGhH5bBIkNPS4vTlorMkMUXk";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
