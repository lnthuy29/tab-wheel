import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://opiyayzuttrrsiqvdxnp.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waXlheXp1dHRycnNpcXZkeG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODM2NzQsImV4cCI6MjA3NDU1OTY3NH0.35RyKoBwCImV1a7eaoC8aMJIly0hp2GbM9BAI5vr9-c';
export const supabase = createClient(supabaseUrl, supabaseKey);
