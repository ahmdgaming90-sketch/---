import type { AnimationDefaults, CardStyle, ImageDisplayStyle, LayoutVariant, TypographyTokens } from "@/themes/types";

/**
 * إحاطة تصميم لكل ثيم لم يُبنَ بعد: قرارات ثابتة يجب الالتزام بها عند بناء الثيم فعليًا،
 * حتى لا يتحول البناء المستقبلي لمجرد "تغيير لون" — وهو بالضبط ما طلب صاحب المشروع تجنّبه.
 * هذا الملف بيانات فقط (لا مكونات)، ويُستهلك من registry.ts لتزويد الثيمات غير المبنية
 * بـ tokens حقيقية حتى قبل بناء مكوناتها.
 */
export type ThemeBrief = {
  key: string;
  name: string;
  signatureIdea: string; // العنصر البصري المميز الذي سيُبنى حوله الثيم
  typography: TypographyTokens;
  cardStyle: CardStyle;
  imageDisplayStyle: ImageDisplayStyle;
  layoutVariant: LayoutVariant;
  animationDefaults: AnimationDefaults;
};

export const themeBriefs: ThemeBrief[] = [
  {
    key: "luxury",
    name: "Luxury Restaurant",
    signatureIdea: "صور بعرض الشاشة الكامل بين الأقسام + خط عناوين سيريف عريض، حركة دخول بطيئة وهادئة",
    typography: { displayFont: "serif", bodyFont: "sans-serif", personality: "فاخر هادئ" },
    cardStyle: "framed-photo",
    imageDisplayStyle: "full-bleed",
    layoutVariant: "full-bleed-sections",
    animationDefaults: { hero: "fade", sections: "reveal" },
  },
  {
    key: "fast_food",
    name: "Modern Fast Food",
    signatureIdea: "بطاقات صناف صريحة الألوان بحدود سميكة، أزرار إضافة كبيرة، بدون حركة تقريبًا لسرعة التصفح",
    typography: { displayFont: "rounded sans-serif", bodyFont: "sans-serif", personality: "جريء سريع" },
    cardStyle: "boxed-card",
    imageDisplayStyle: "grid",
    layoutVariant: "asymmetric-grid",
    animationDefaults: { hero: "zoom", sections: "fade" },
  },
  {
    key: "cafe",
    name: "Cafe & Coffee",
    signatureIdea: "شريط صور دائرية للمشروبات، خط يدوي/ودود للعناوين، ألوان دافئة محايدة",
    typography: { displayFont: "handwritten-style serif", bodyFont: "sans-serif", personality: "دافئ ودود" },
    cardStyle: "circular-thumb-row",
    imageDisplayStyle: "circular",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "fade", sections: "slide" },
  },
  {
    key: "traditional",
    name: "Traditional Arabic",
    signatureIdea: "زخارف هندسية بسيطة كفواصل أقسام، خط عناوين عربي تراثي، تخطيط متماثل رسمي",
    typography: { displayFont: "arabic traditional display", bodyFont: "sans-serif", personality: "تراثي رسمي" },
    cardStyle: "editorial-split",
    imageDisplayStyle: "framed",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "fade", sections: "fade" },
  },
  {
    key: "italian",
    name: "Italian Restaurant",
    signatureIdea: "ألوان ترابية دافئة (طماطم/زيتوني)، صور أصناف كبيرة بإطار، خط عناوين إيطالي كلاسيكي",
    typography: { displayFont: "classic serif", bodyFont: "sans-serif", personality: "دافئ عائلي راقٍ" },
    cardStyle: "framed-photo",
    imageDisplayStyle: "framed",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "fade", sections: "reveal" },
  },
  {
    key: "asian",
    name: "Asian Restaurant",
    signatureIdea: "تخطيط غير متماثل بمساحات فارغة كبيرة (طابع ياباني/مينمال شرقي)، خطوط رفيعة دقيقة",
    typography: { displayFont: "thin geometric sans-serif", bodyFont: "sans-serif", personality: "هادئ متوازن" },
    cardStyle: "horizontal-strip",
    imageDisplayStyle: "grid",
    layoutVariant: "asymmetric-grid",
    animationDefaults: { hero: "slide", sections: "fade" },
  },
  {
    key: "burger_house",
    name: "Burger House",
    signatureIdea: "بطاقات كبيرة بصور مربعة بارزة وأسعار ضخمة، طابع طباعي (typographic) قوي وواثق",
    typography: { displayFont: "bold condensed sans-serif", bodyFont: "sans-serif", personality: "قوي واثق" },
    cardStyle: "boxed-card",
    imageDisplayStyle: "grid",
    layoutVariant: "asymmetric-grid",
    animationDefaults: { hero: "zoom", sections: "zoom" },
  },
  {
    key: "fine_dining",
    name: "Fine Dining",
    signatureIdea: "قائمة نصية بحتة شبه بلا صور (كقوائم الفاخرة الحقيقية)، مساحات بيضاء واسعة جدًا، خط سيريف نحيف",
    typography: { displayFont: "thin elegant serif", bodyFont: "serif", personality: "راقٍ مقتصد" },
    cardStyle: "dotted-price-list",
    imageDisplayStyle: "framed",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "fade", sections: "fade" },
  },
  {
    key: "bakery",
    name: "Bakery",
    signatureIdea: "شبكة صور دافئة كثيفة (كواجهة فرن حقيقية)، خط عناوين دائري ودود، ألوان كريمية",
    typography: { displayFont: "rounded serif", bodyFont: "sans-serif", personality: "دافئ منزلي" },
    cardStyle: "framed-photo",
    imageDisplayStyle: "grid",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "fade", sections: "slide" },
  },
  {
    key: "dessert_shop",
    name: "Dessert Shop",
    signatureIdea: "صور دائرية ملونة صغيرة كأنها عرض فيترينة حلويات، حركة دخول مرحة خفيفة",
    typography: { displayFont: "playful rounded display", bodyFont: "sans-serif", personality: "مرح خفيف" },
    cardStyle: "circular-thumb-row",
    imageDisplayStyle: "circular",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "zoom", sections: "zoom" },
  },
  {
    key: "seafood",
    name: "Seafood Restaurant",
    signatureIdea: "لوحة ألوان زرقاء/رملية، صور بعرض كامل أفقي (طابع ساحلي)، تخطيط منساب بدون حواف حادة",
    typography: { displayFont: "flowing serif", bodyFont: "sans-serif", personality: "منعش ساحلي" },
    cardStyle: "horizontal-strip",
    imageDisplayStyle: "full-bleed",
    layoutVariant: "full-bleed-sections",
    animationDefaults: { hero: "slide", sections: "slide" },
  },
  {
    key: "dark_premium",
    name: "Dark Premium",
    signatureIdea: "خلفية داكنة كاملة مع لون تمييز واحد فقط من ألوان المطعم، إضاءة/تباين عالٍ على الصور",
    typography: { displayFont: "sharp geometric sans-serif", bodyFont: "sans-serif", personality: "فاخر جريء" },
    cardStyle: "boxed-card",
    imageDisplayStyle: "framed",
    layoutVariant: "asymmetric-grid",
    animationDefaults: { hero: "fade", sections: "reveal" },
  },
  {
    key: "minimal",
    name: "Minimal White",
    signatureIdea: "قائمة مطبوعة بخط نقطي بين الاسم والسعر — مبني فعليًا (المرحلة 3)",
    typography: { displayFont: "system sans-serif", bodyFont: "system sans-serif", personality: "نظيف محايد" },
    cardStyle: "dotted-price-list",
    imageDisplayStyle: "grid",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "fade", sections: "fade" },
  },
  {
    key: "street_food",
    name: "Street Food",
    signatureIdea: "طابع ملصقات/طباعة شارع خام، ألوان حادة متضادة، بطاقات مائلة قليلاً كأنها لافتات معلّقة",
    typography: { displayFont: "graffiti-inspired display", bodyFont: "sans-serif", personality: "خام حيوي" },
    cardStyle: "horizontal-strip",
    imageDisplayStyle: "grid",
    layoutVariant: "asymmetric-grid",
    animationDefaults: { hero: "zoom", sections: "slide" },
  },
  {
    key: "family_restaurant",
    name: "Family Restaurant",
    signatureIdea: "تخطيط واسع ومريح بخط كبير سهل القراءة، بطاقات صناف واضحة الحدود بدون تكلّف بصري",
    typography: { displayFont: "friendly rounded sans-serif", bodyFont: "sans-serif", personality: "بسيط مريح" },
    cardStyle: "boxed-card",
    imageDisplayStyle: "grid",
    layoutVariant: "centered-column",
    animationDefaults: { hero: "fade", sections: "fade" },
  },
];

export function getThemeBrief(key: string): ThemeBrief | undefined {
  return themeBriefs.find((b) => b.key === key);
}
