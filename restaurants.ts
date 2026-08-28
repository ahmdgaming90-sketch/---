"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireOwner, requireOwnerOrManagerOf } from "@/lib/permissions";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { isValidSlugFormat } from "@/lib/slug";
import { logAudit } from "@/lib/audit";
import { logServerError } from "@/lib/error-log";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type RestaurantInput = {
  name: string;
  slug: string;
  description?: string | null;
  whatsapp_number: string;
  location?: string | null;
  working_hours?: Record<string, string> | null;
  theme_id: string;
  color_palette?: { primary?: string; secondary?: string; accent?: string } | null;
  font_family?: string | null;
};

/**
 * تحقق من توفر الـ slug — يُستدعى مباشرة من فورم العميل (Client Component)
 * كتحقق فوري (live)، وأيضًا داخليًا من createRestaurantAction/updateRestaurantAction
 * كخط دفاع نهائي قبل الكتابة الفعلية (Defense in depth — التحقق في الواجهة ليس كافيًا وحده).
 */
export async function checkSlugAvailabilityAction(
  slug: string,
  excludeRestaurantId?: string
): Promise<ActionResult<{ available: boolean; reason?: string }>> {
  if (!isValidSlugFormat(slug)) {
    return {
      ok: true,
      data: { available: false, reason: "صيغة الرابط غير صالحة: أحرف إنجليزية صغيرة وأرقام وشرطات فقط." },
    };
  }

  if (isReservedSlug(slug)) {
    return { ok: true, data: { available: false, reason: "هذا الاسم محجوز لمسارات النظام." } };
  }

  const supabase = createClient();
  let query = supabase.from("restaurants").select("id").eq("slug", slug);
  if (excludeRestaurantId) {
    query = query.neq("id", excludeRestaurantId);
  }
  const { data, error } = await query.maybeSingle();

  if (error) {
    return { ok: false, error: "تعذّر التحقق من الرابط حاليًا، حاول مجددًا." };
  }

  return { ok: true, data: { available: !data } };
}

function validateSlugOrThrow(slug: string) {
  if (!isValidSlugFormat(slug)) {
    throw new Error("صيغة الرابط غير صالحة: أحرف إنجليزية صغيرة وأرقام وشرطات فقط.");
  }
  if (isReservedSlug(slug)) {
    throw new Error("لا يمكن استخدام هذا الاسم لأنه محجوز لمسارات النظام.");
  }
}

export async function createRestaurantAction(
  input: RestaurantInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireOwner();
    validateSlugOrThrow(input.slug);

    const supabase = createClient();

    // فحص تكرار نهائي داخل الخادم (السباق ممكن بين فحص العميل الحي والإرسال الفعلي)
    const { data: existing } = await supabase
      .from("restaurants")
      .select("id")
      .eq("slug", input.slug)
      .maybeSingle();

    if (existing) {
      return { ok: false, error: "هذا الرابط مستخدم بالفعل لمطعم آخر." };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        whatsapp_number: input.whatsapp_number,
        location: input.location ?? null,
        working_hours: input.working_hours ?? {},
        theme_id: input.theme_id,
        color_palette: input.color_palette ?? undefined,
        font_family: input.font_family ?? undefined,
        created_by: user?.id,
      })
      .select("id, slug")
      .single();

    if (error || !restaurant) {
      await logServerError("server_action:createRestaurantAction", error, { slug: input.slug });
      return { ok: false, error: error?.message ?? "تعذّر إنشاء المطعم." };
    }

    // trigger قاعدة البيانات (migration 0004) ينشئ تلقائيًا:
    // restaurant_settings, restaurant_order_settings, restaurant_pwa_settings, restaurant_sections
    // ضمن نفس المعاملة — لا حاجة لأي إدراج يدوي إضافي هنا.

    await logAudit("restaurant.create", { targetType: "restaurant", targetId: restaurant.id, metadata: { name: input.name, slug: input.slug } });

    revalidatePath("/owner/restaurants");
    return { ok: true, data: { id: restaurant.id, slug: restaurant.slug } };
  } catch (e) {
    await logServerError("server_action:createRestaurantAction", e, { slug: input.slug });
    return { ok: false, error: e instanceof Error ? e.message : "خطأ غير متوقع." };
  }
}

export type RestaurantUpdateInput = Partial<RestaurantInput> & { id: string };

export async function updateRestaurantAction(
  input: RestaurantUpdateInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireOwnerOrManagerOf(input.id);

    if (input.slug) {
      validateSlugOrThrow(input.slug);
    }

    const supabase = createClient();

    if (input.slug) {
      const { data: existing } = await supabase
        .from("restaurants")
        .select("id")
        .eq("slug", input.slug)
        .neq("id", input.id)
        .maybeSingle();
      if (existing) {
        return { ok: false, error: "هذا الرابط مستخدم بالفعل لمطعم آخر." };
      }
    }

    const { id, ...rest } = input;
    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .update(rest)
      .eq("id", id)
      .select("id, slug")
      .single();

    if (error || !restaurant) {
      await logServerError("server_action:updateRestaurantAction", error, { id });
      return { ok: false, error: error?.message ?? "تعذّر تحديث بيانات المطعم." };
    }

    await logAudit("restaurant.update", { targetType: "restaurant", targetId: id, metadata: { fields: Object.keys(rest) } });

    revalidatePath("/owner/restaurants");
    revalidatePath(`/owner/restaurants/${id}`);
    revalidatePath(`/${restaurant.slug}`);

    return { ok: true, data: { id: restaurant.id, slug: restaurant.slug } };
  } catch (e) {
    await logServerError("server_action:updateRestaurantAction", e, { id: input.id });
    return { ok: false, error: e instanceof Error ? e.message : "خطأ غير متوقع." };
  }
}

/**
 * تحديث روابط الشعار/الغلاف بعد رفعها من العميل مباشرة إلى Supabase Storage.
 * منفصلة عن updateRestaurantAction لأن رفع الصور يحدث بعد إنشاء المطعم (يحتاج id أولاً)،
 * انظر التسلسل الكامل في components/dashboard/RestaurantForm.tsx.
 */
export async function updateRestaurantImagesAction(
  restaurantId: string,
  images: { logo_url?: string; cover_url?: string }
): Promise<ActionResult<null>> {
  try {
    await requireOwnerOrManagerOf(restaurantId);

    const supabase = createClient();
    const { error } = await supabase
      .from("restaurants")
      .update(images)
      .eq("id", restaurantId);

    if (error) {
      await logServerError("server_action:updateRestaurantImagesAction", error, { restaurantId });
      return { ok: false, error: error.message };
    }

    await logAudit("restaurant.images_update", { targetType: "restaurant", targetId: restaurantId, metadata: images });

    revalidatePath(`/owner/restaurants/${restaurantId}`);
    return { ok: true, data: null };
  } catch (e) {
    await logServerError("server_action:updateRestaurantImagesAction", e, { restaurantId });
    return { ok: false, error: e instanceof Error ? e.message : "خطأ غير متوقع." };
  }
}

export async function getThemesAction(): Promise<
  ActionResult<{ id: string; key: string; name: string; description: string | null }[]>
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("themes")
    .select("id, key, name, description")
    .eq("is_active", true)
    .order("name");

  if (error || !data) {
    return { ok: false, error: "تعذّر جلب القوالب." };
  }
  return { ok: true, data };
}
