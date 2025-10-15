import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ncrwckupxlkyfsfkamcn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcndja3VweGxreWZzZmthbWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMTI3ODUsImV4cCI6MjA3NTg4ODc4NX0.Q-nn1jiyTlFy5FRyPCLT4W0XlejRG_6bFKi01PPsyfs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
