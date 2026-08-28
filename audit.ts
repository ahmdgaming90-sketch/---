import { createClient } from "@/lib/supabase/server";

/**
 * يسجّل عملية إدارية مهمة قام بها المستخدم الحالي (Owner أو Manager) في audit_log.
 * يستخدم عميل المستخدم نفسه (وليس service role) حتى تنطبق RLS: actor_id = auth.uid() —
 * لا يمكن لأحد تسجيل عملية باسم مستخدم آخر. لا يرمي أبدًا؛ فشل التدقيق لا يكسر العملية الأصلية.
 */
export async function logAudit(
  action: string,
  details?: { targetType?: string; targetId?: string; metadata?: Record<string, unknown> }
): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

    await supabase.from("audit_log").insert({
      actor_id: user.id,
      actor_role: profile?.role ?? null,
      action,
      target_type: details?.targetType ?? null,
      target_id: details?.targetId ?? null,
      metadata: details?.metadata ?? null,
    });
  } catch {
    // تجاهل: فشل تسجيل التدقيق لا يجب أن يُسقط العملية الأصلية.
  }
}
