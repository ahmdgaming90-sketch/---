import { createClient } from "@/lib/supabase/server";

export type UserRole = "owner" | "manager";

export type CurrentActor = {
  userId: string;
  role: UserRole;
} | null;

/**
 * يجلب المستخدم الحالي ودوره من داخل Server Component / Server Action.
 * يُستخدم كطبقة تحقق ثانية (Defense in depth) بالإضافة إلى RLS،
 * تحديدًا للعمليات الحساسة مثل إنشاء مطعم أو استرجاع نسخة تصميم.
 */
export async function getCurrentActor(): Promise<CurrentActor> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { userId: user.id, role: profile.role as UserRole };
}

export async function requireOwner(): Promise<CurrentActor> {
  const actor = await getCurrentActor();
  if (!actor || actor.role !== "owner") {
    throw new Error("غير مصرح: هذه العملية محصورة بمالك النظام (Owner) فقط.");
  }
  return actor;
}

/**
 * يتحقق أن المستخدم إما Owner (وصول كامل) أو Manager مرتبط فعليًا بهذا المطعم.
 */
export async function requireOwnerOrManagerOf(restaurantId: string): Promise<CurrentActor> {
  const actor = await getCurrentActor();
  if (!actor) {
    throw new Error("غير مصرح: يجب تسجيل الدخول.");
  }
  if (actor.role === "owner") return actor;

  const supabase = createClient();
  const { data } = await supabase
    .from("restaurant_managers")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .eq("profile_id", actor.userId)
    .maybeSingle();

  if (!data) {
    throw new Error("غير مصرح: لست مديرًا لهذا المطعم.");
  }
  return actor;
}
