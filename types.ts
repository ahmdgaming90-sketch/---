import type { ComponentType } from "react";

export type AnimationType = "fade" | "slide" | "zoom" | "reveal";

/**
 * حركات إضافية على مستوى المكوّن (وليس على مستوى restaurant_sections.animation الذي يبقى
 * محصورًا بالقيم الأربع الأساسية القابلة للتحكم من المحرر). هذه تصف "الشخصية الحركية" لكل ثيم
 * ضمن مكوناته الداخلية (مثال: تتالي دخول عناصر القائمة، سكيل سينمائي بطيء للـ Hero).
 */
export type ThemeMotion = "fade" | "slide" | "zoom" | "reveal" | "cinematic" | "stagger" | "quick-scale";

/**
 * أسلوب عرض بطاقة/سطر الصنف في القائمة — قرار تصميمي حقيقي لكل ثيم،
 * وليس مجرد لون مختلف. يُستخدم كمرجع إلزامي عند بناء المكونات الفعلية للثيم.
 */
export type CardStyle =
  | "dotted-price-list" // قائمة مطبوعة بخط نقطي بين الاسم والسعر (Minimal الحالي)
  | "boxed-card" // بطاقة بحدود/ظل واضح لكل صنف
  | "framed-photo" // صورة الصنف بإطار مميز (شبه بولارويد) كعنصر رئيسي
  | "horizontal-strip" // شريط أفقي صورة+نص، مناسب لقوائم سريعة الطلب
  | "circular-thumb-row" // صف صور دائرية صغيرة مع الاسم والسعر أسفلها
  | "editorial-split"; // عمودان: وصف نصي طويل من جهة، صورة كبيرة من جهة أخرى

/** أسلوب عرض الصور عمومًا في الموقع (Gallery والصور الرئيسية) */
export type ImageDisplayStyle =
  | "full-bleed" // صور بعرض الشاشة الكامل
  | "grid" // شبكة متساوية الأحجام
  | "carousel" // شريط تمرير أفقي
  | "framed" // صور بإطار/حدود واضحة
  | "circular"; // صور مقصوصة دائريًا (مناسب للمقبلات/الحلويات الصغيرة)

/** هيكل تخطيط الصفحة العام لهذا الثيم */
export type LayoutVariant =
  | "centered-column" // عمود مركزي واحد بعرض محدود (Minimal الحالي)
  | "full-bleed-sections" // كل قسم بعرض الشاشة الكامل
  | "sidebar-nav" // قائمة أقسام جانبية ثابتة + محتوى بجانبها
  | "asymmetric-grid"; // شبكة غير متماثلة (مناسب لثيمات فاخرة/تحريرية)

export type TypographyTokens = {
  /** خط العناوين الرئيسية — يجب أن يختلف فعليًا بين الثيمات، وليس نفس الخط بحجم أكبر فقط */
  displayFont: string;
  /** خط النصوص العادية */
  bodyFont: string;
  /** كلمة وصفية لطابع الخط (تساعد عند البناء الفعلي لاحقًا) */
  personality: string;
};

export type AnimationDefaults = {
  hero: ThemeMotion;
  sections: ThemeMotion;
};

/**
 * 11 توكن لون قابلة للتخصيص لكل مطعم من المحرر (مستقبلاً)، تُعرَّف افتراضيًا لكل ثيم،
 * ويطبّق تخصيص المالك (restaurants.color_palette) فوقها جزئيًا أو كليًا دون كسر التصميم —
 * لأن كل مكوّن ثيم يستهلك هذه القيم عبر فئات Tailwind (bg-surface, text-heading, ...)
 * التي تلتقط CSS variables المحقونة في layout.tsx، وليس بقيم hex ثابتة داخل JSX.
 */
export type ColorTokens = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  button: string;
  buttonText: string;
  heading: string;
  muted: string;
};

export type FooterProps = {
  restaurantName: string;
  settings?: {
    show_credit?: boolean;
    credit_text?: string;
    credit_link?: string | null;
    show_social_links?: boolean;
  } | null;
};

export type HeroProps = {
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  logoUrl?: string | null;
  location?: string | null;
};

export type AboutProps = { workingHours?: Record<string, string> | null };

export type MenuProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
};
export type MenuCategory = { id: string; name: string };
export type MenuProps = { categories: MenuCategory[]; products: MenuProduct[] };

export type GalleryProps = { imageUrls: string[] };

export type ContactProps = { whatsappNumber: string; location?: string | null };

/**
 * العقد الكامل الذي يجب أن يوفّره أي ثيم (مبني أو placeholder).
 * الهدف: إضافة ثيم جديد لاحقًا = تنفيذ هذا العقد بمكوّنات فعلية + تسجيله في registry.ts،
 * بدون أي تعديل على الصفحات أو منطق الجلب — القرار المعماري من Architecture v2 §3 بلا تغيير.
 */
export type ThemeDefinition = {
  key: string;
  /** هل هذا الثيم مبني فعليًا بهوية بصرية مستقلة، أم لا يزال placeholder يستخدم مكونات ثيم آخر مؤقتًا */
  isBuilt: boolean;

  Hero: ComponentType<HeroProps>;
  About: ComponentType<AboutProps>;
  Menu: ComponentType<MenuProps>;
  Gallery: ComponentType<GalleryProps>;
  Contact: ComponentType<ContactProps>;
  Footer: ComponentType<FooterProps>;

  typography: TypographyTokens;
  cardStyle: CardStyle;
  imageDisplayStyle: ImageDisplayStyle;
  layoutVariant: LayoutVariant;
  animationDefaults: AnimationDefaults;
  /** الألوان الافتراضية لهذا الثيم تحديدًا — القيمة الفعلية المعروضة = هذه مدموجة مع تخصيص المطعم */
  defaultPalette: ColorTokens;
};
