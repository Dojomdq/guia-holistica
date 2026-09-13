import { createClient } from "@supabase/supabase-js";
import { env } from "process";

const url = env.NEXT_PUBLIC_SUPABASE_URL!;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabasePublic = createClient(url, key);