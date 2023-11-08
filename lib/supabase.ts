import { createClient } from "@supabase/supabase-js";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

export const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
// export const supabaseServerComponentClient = createServerComponentClient({ cookies });