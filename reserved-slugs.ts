/**
 * أي مسار على مستوى الجذر يخص النظام نفسه (لوحات التحكم، تسجيل الدخول، الأصول...)
 * يجب أن يُمنع استخدامه كـ slug لمطعم، لأن روابط المطاعم أصبحت على /[slug] مباشرة.
 *
 * يُتحقق من هذه القائمة في مكانين إلزاميًا (انظر Architecture v2 §10):
 * 1) عند إنشاء/تعديل slug مطعم في lib/actions/restaurants.ts
 * 2) في middleware.ts عند توجيه الطلبات (دفاع مزدوج، وليس نقطة تحقق واحدة)
 */
export const RESERVED_SLUGS = [
  "owner",
  "manager",
  "login",
  "logout",
  "auth",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "assets",
  "static",
  "admin",
] as const;

export function isReservedSlug(slug: string): boolean {
  return (RESERVED_SLUGS as readonly string[]).includes(slug.toLowerCase());
}
