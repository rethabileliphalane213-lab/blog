import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log(
    "Supabase key exists:",
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;