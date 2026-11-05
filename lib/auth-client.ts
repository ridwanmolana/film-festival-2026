import { createClient } from "@/lib/supabase/client";

/**
 * Client-side admin sign out helper
 */
export async function signOutAdmin() {
  const supabase = createClient();
  return await supabase.auth.signOut();
}
