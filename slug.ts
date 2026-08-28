/**
 * يحوّل اسم المطعم إلى slug صالح حسب القيد المطبَّق في قاعدة البيانات:
 * ^[a-z0-9]+(-[a-z0-9]+)*$
 *
 * الأسماء العربية لا تتحوّل صوتيًا هنا (transliteration كامل خارج نطاق هذه المرحلة)؛
 * بدل ذلك: تُزال الأحرف غير المدعومة، وإن نتج عن ذلك نص فارغ (اسم عربي بالكامل مثلاً)
 * يُستخدم fallback عشوائي قصير. المستخدم يقدر دائمًا يعدّل الـ slug يدويًا في الفورم.
 */
export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // إزالة أي شيء غير a-z 0-9 مسافة أو شرطة (يشمل هذا الأحرف العربية)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (base.length > 0) return base;

  return `restaurant-${Math.random().toString(36).slice(2, 8)}`;
}

export function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}
