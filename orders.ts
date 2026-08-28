"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { logServerError } from "@/lib/error-log";
import type { ActionResult } from "@/lib/actions/restaurants";

export type CreateOrderInput = {
  restaurantId: string;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
};

/**
 * يحفظ الطلب في جدول orders قبل فتح رابط واتساب — هذه الكتابة الوحيدة المسموحة على orders
 * لأن RLS (migration 0002) عمدًا لا تمنح insert للعامة، منعًا للتلاعب بالأسعار من المتصفح
 * مباشرة على القاعدة.
 *
 * تحقق أمني مهم: لا نثق بالسعر أو الإجمالي القادمَين من العميل إطلاقًا. نعيد جلب السعر الفعلي
 * والحالي لكل منتج من قاعدة البيانات ونحسب الإجمالي من جديد على الخادم — لو تلاعب أحد بالسعر
 * في طلب الشبكة يدويًا، القيمة المحفوظة والمرسلة في رسالة واتساب تبقى مطابقة للأسعار الحقيقية.
 *
 * فشل هذا الحفظ لا يجب أن يمنع العميل من إرسال طلبه فعليًا عبر واتساب (استمرارية العمل
 * أهم من اكتمال السجل الداخلي) — الاستدعاء من CheckoutForm لا يوقف فتح رابط واتساب
 * حتى لو رجعت هذه الدالة ok:false.
 */
export async function createOrderAction(
  input: CreateOrderInput
): Promise<ActionResult<{ id: string; verifiedTotal: number }>> {
  try {
    if (!input.customerName?.trim()) {
      return { ok: false, error: "اسم العميل مطلوب." };
    }
    if (!input.items || input.items.length === 0) {
      return { ok: false, error: "السلة فارغة." };
    }

    const supabase = createServiceRoleClient();

    const productIds = input.items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price")
      .eq("restaurant_id", input.restaurantId)
      .in("id", productIds);

    if (productsError) {
      await logServerError("server_action:createOrderAction", productsError, { restaurantId: input.restaurantId });
      return { ok: false, error: "تعذّر التحقق من الطلب." };
    }

    const priceById = new Map((products ?? []).map((p) => [p.id, { name: p.name, price: Number(p.price) }]));

    // إعادة بناء عناصر الطلب من بيانات القاعدة الحقيقية فقط، وتجاهل أي سعر أرسله العميل
    const verifiedItems = input.items
      .map((line) => {
        const real = priceById.get(line.productId);
        if (!real) return null; // منتج غير موجود لهذا المطعم — يُستبعد من السجل المحفوظ
        return { name: real.name, price: real.price, quantity: Math.max(1, Math.floor(line.quantity)) };
      })
      .filter(Boolean) as { name: string; price: number; quantity: number }[];

    if (verifiedItems.length === 0) {
      return { ok: false, error: "تعذّر التحقق من عناصر الطلب." };
    }

    const verifiedTotal = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const { data, error } = await supabase
      .from("orders")
      .insert({
        restaurant_id: input.restaurantId,
        customer_name: input.customerName.trim(),
        customer_phone: input.customerPhone?.trim() || null,
        notes: input.notes?.trim() || null,
        items: verifiedItems,
        total: verifiedTotal,
        status: "sent",
      })
      .select("id")
      .single();

    if (error || !data) {
      await logServerError("server_action:createOrderAction", error, { restaurantId: input.restaurantId });
      return { ok: false, error: "تعذّر حفظ الطلب داخليًا." };
    }

    return { ok: true, data: { id: data.id, verifiedTotal } };
  } catch (e) {
    await logServerError("server_action:createOrderAction", e, { restaurantId: input.restaurantId });
    return { ok: false, error: "خطأ غير متوقع." };
  }
}
