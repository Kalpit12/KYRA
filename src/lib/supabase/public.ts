import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Cookie-free anon client for public, cacheable reads (ISR / revalidate).
 * Do not use for authenticated admin mutations.
 */
export function createPublicClient() {
  const { url, key } = getSupabaseEnv();
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
