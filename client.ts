import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * يُستخدم داخل Client Components فقط (مثل المحرر، السلة، الفورمات التفاعلية).
 * يعتمد على anon key العام — الحماية الفعلية تأتي من RLS.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
