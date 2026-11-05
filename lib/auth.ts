import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";

/**
 * Server-side helper to get the currently authenticated user
 */
export async function getAuthUser() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Server-side check if current user is an authenticated administrator
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const user = await getAuthUser();
  return Boolean(user);
}

/**
 * Client-side admin sign out helper
 */
export async function signOutAdmin() {
  const supabase = createBrowserSupabase();
  return await supabase.auth.signOut();
}

