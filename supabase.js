// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = 'https://adxtanejeewibwmsxgae.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkeHRhbmVqZWV3aWJ3bXN4Z2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjYyMzIsImV4cCI6MjA3NjIwMjIzMn0.qSzNYPrUFOG90-SRQmOT1MTWaELO_At8diBZiwzgCgU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);