export type FooterSettings = {
  show_credit?: boolean;
  credit_text?: string;
  credit_link?: string | null;
  show_social_links?: boolean;
} | null | undefined;

const DEFAULT_CREDIT_TEXT = "تم الإنشاء بواسطة مؤيد الحزمي";
const DEFAULT_CREDIT_WHATSAPP = "https://wa.me/966500000000"; // TODO: رقم واتساب مؤيد الحزمي الفعلي

/**
 * المحتوى الإلزامي للفوتر ثابت عبر كل الثيمات الـ15 — فقط الشكل البصري يختلف.
 * كل Footer.tsx خاص بثيم يستدعي هذه الدالة للحصول على النص، ثم يعرضه بأسلوبه الخاص.
 */
export function getFooterCopy(restaurantName: string, settings: FooterSettings) {
  return {
    copyrightLine: `© ${new Date().getFullYear()} جميع الحقوق محفوظة — ${restaurantName}`,
    showCredit: settings?.show_credit ?? true,
    creditText: settings?.credit_text?.trim() || DEFAULT_CREDIT_TEXT,
    creditLink: settings?.credit_link || DEFAULT_CREDIT_WHATSAPP,
  };
}
