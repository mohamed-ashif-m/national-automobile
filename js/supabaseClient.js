// js/supabaseClient.js

const SUPABASE_URL = "https://hjcsatyzjwxpqgfimwvh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqY3NhdHl6and4cHFnZmltd3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTg0MDUsImV4cCI6MjA2ODQ5NDQwNX0.L1n-vvn2h2CCtSjg6YPoZrytFkObixxOMCxvIqzTOoo";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
