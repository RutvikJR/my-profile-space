import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = "https://yomgfgkpnskukflyayeb.supabase.co";

const projectApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbWdmZ2twbnNrdWtmbHlheWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc3OTc3MDQsImV4cCI6MjAwMzM3MzcwNH0.QswR6QqGQhF4_L06l5tRs9TVJ0HQLFYDBMAR0KpuuuM";

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  projectApiKey
);
