export type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutCustomer = {
  name: string;
  phone?: string;
  notes?: string;
};

/**
 * يبني رسالة الطلب الرسمية بدون أي Emojis، مطابقة للقالب المتفق عليه مع صاحب المشروع حرفيًا،
 * وديناميكية بالكامل لكل مطعم: الاسم، بيانات العميل، الأصناف والكميات والأسعار، الإجمالي،
 * طريقة الاستلام، والملاحظات.
 */
export function buildWhatsAppMessage(params: {
  restaurantName: string;
  pickupNote: string;
  thankYouMessage?: string | null;
  customer: CheckoutCustomer;
  lines: CartLine[];
  total: number;
}): string {
  const { restaurantName, pickupNote, thankYouMessage, customer, lines, total } = params;

  const itemsBlock = lines
    .map((line) => `${line.name} × ${line.quantity} — ${(line.price * line.quantity).toFixed(2)}`)
    .join("\n");

  const thankYou = thankYouMessage?.trim() || `شكراً لاختياركم ${restaurantName}`;

  return [
    `طلب جديد من مطعم ${restaurantName}`,
    ``,
    `بيانات العميل:`,
    `الاسم: ${customer.name}`,
    `رقم الجوال: ${customer.phone?.trim() || "-"}`,
    ``,
    `تفاصيل الطلب:`,
    ``,
    itemsBlock,
    ``,
    `الإجمالي:`,
    `${total.toFixed(2)}`,
    ``,
    `طريقة الاستلام:`,
    pickupNote,
    ``,
    `ملاحظات:`,
    customer.notes?.trim() || "-",
    ``,
    thankYou,
  ].join("\n");
}

/**
 * يبني رابط wa.me جاهز للفتح، بعد تنظيف رقم واتساب من أي رموز غير رقمية.
 */
export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  const digitsOnly = whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
