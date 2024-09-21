import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const projectApiKey =
  import.meta.env.VITE_SUPABASE_PROJECT_API_KEY ;

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  projectApiKey
);
