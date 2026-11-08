import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** False until the website has the Supabase address and the publishable (public) key. The dashboard then says so calmly. */
export const authConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/**
 * The browser's sign-in client, made once. Only the public URL and the publishable key are used here; the
 * service-role key is server-only and never reaches the website. Sign-in is the PKCE flow, so the address
 * carries a one-time code (never a token) when Google sends the person back.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !key || typeof window === "undefined") return null;
  client ??= createClient(url, key, {
    auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true },
  });
  return client;
}
