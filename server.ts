import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * يُستخدم داخل Server Components و Server Actions.
 * يقرأ/يكتب جلسة المستخدم عبر الكوكيز، ويلتزم بـ RLS حسب دور المستخدم المسجّل دخوله.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // يُستدعى أحيانًا من Server Component بدل Server Action/Route Handler؛
            // يُتجاهل بأمان لأن الـ middleware يتكفّل بتحديث الجلسة في تلك الحالة.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // انظر التعليق أعلاه
          }
        },
      },
    }
  );
}

/**
 * عميل بصلاحية service role — يتجاوز RLS بالكامل.
 * لا يُستخدم إلا داخل Server Actions/Route Handlers محسوبة بدقة
 * (مثال: إدراج طلب جديد من زائر غير مسجّل دخول — انظر lib/actions/orders.ts في المرحلة القادمة).
 * لا يُستورد أبدًا في أي ملف Client Component.
 */
export function createServiceRoleClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {},
      },
    }
  );
}
