import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

const projectApiKey = process.env.REACT_APP_SUPABASE_PROJECT_API_KEY;

console.log(supabaseUrl, projectApiKey);

export const supabaseClient = createClient(supabaseUrl, projectApiKey);
