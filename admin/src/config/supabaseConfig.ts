import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = "https://gismxluugmubyknnkdii.supabase.co";

const projectApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpc214bHV1Z211Ynlrbm5rZGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY3Mzk2NTEsImV4cCI6MjAzMjMxNTY1MX0.87ZRw0jKX0L7LM2N2ZD8JcJjISHhXpvFscmFSl1aRvM";

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  projectApiKey
);
