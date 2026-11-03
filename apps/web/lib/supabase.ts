import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** true khi đã điền khóa Supabase vào .env.local (xem docs/DEPLOY.md). */
export const supabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** Client Supabase dùng trên trình duyệt. Trả null nếu chưa cấu hình, để app vẫn chạy offline. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  client ??= createBrowserClient(url!, key!);
  return client;
}
