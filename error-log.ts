import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * يسجّل خطأ خادم في error_logs عبر service role (يعمل حتى في مسارات عامة بلا مستخدم مسجّل
 * دخوله، مثل فشل حفظ طلب عميل زائر). لا يرمي أبدًا — فشل التسجيل نفسه لا يجب أن يكسر
 * العملية الأصلية التي استدعته من الأساس.
 */
export async function logServerError(
  scope: string,
  error: unknown,
  context?: Record<string, unknown>
): Promise<void> {
  try {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    const supabase = createServiceRoleClient();
    await supabase.from("error_logs").insert({
      scope,
      message,
      stack: stack ?? null,
      context: context ?? null,
    });
  } catch {
    // تجاهل: لا يجوز لفشل تسجيل الخطأ أن يُسقط العملية الأصلية.
  }
}
