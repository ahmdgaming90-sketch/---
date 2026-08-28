# إضافة ثيم جديد إلى DineForge

> **تحديث**: كل الـ15 ثيمًا في `theme-briefs.ts` مبنية فعليًا الآن في `themes/<key>/` ومسجّلة في `registry.ts`. هذا الدليل صالح لإضافة ثيم 16+ مستقبلاً — استخدم أسلوب `theme-briefs.ts` (وصف موجز لكل حقل) كنموذج لتوثيق هوية أي ثيم جديد قبل بنائه.

هذا الدليل يوثّق كيف تبني هوية ثيم فعلية جديدة (من الـ 14 المتبقية في `theme-briefs.ts`، أو أي ثيم
إضافي مستقبلي) بدون أي حاجة لتعديل الصفحات أو منطق الجلب أو الـ Architecture — النظام مصمم مسبقًا
ليستوعب ذلك.

## قبل البدء

اقرأ إحاطة الثيم في `themes/theme-briefs.ts` (ابحث عن مفتاحه، مثل `luxury`): تحدد `signatureIdea`،
`typography`، `cardStyle`، `imageDisplayStyle`، `layoutVariant`، `animationDefaults`. هذه ليست
اقتراحات — هي قرارات هوية مأخوذة مسبقًا لتجنّب إعادة البناء أو الانحراف نحو "نفس القالب بلون مختلف".

## الخطوات

1. **انسخ القالب**: `themes/_template/*` إلى `themes/<key>/*` (مثال: `themes/luxury/`).
2. **نفّذ كل ملف فعليًا** حسب الإحاطة — الجدول أدناه يربط كل حقل بالملف الذي يجب أن يعكسه:

   | حقل الإحاطة | أين يُنفَّذ |
   |---|---|
   | `signatureIdea` | العنصر البصري الأساسي، غالبًا في `Hero.tsx` أو `MenuGrid.tsx` |
   | `cardStyle` | `MenuGrid.tsx` بالكامل — بنية مختلفة، وليس فقط CSS |
   | `imageDisplayStyle` | `Gallery.tsx`، وأي صور داخل `Hero.tsx`/`MenuGrid.tsx` |
   | `layoutVariant` | تخطيط `page.tsx` الفعلي يبقى كما هو (يستدعي المكونات بالترتيب)، لكن كل مكوّن ثيم ينفّذ عرضه الداخلي حسب هذا المتغير (مثال: `full-bleed-sections` تعني كل قسم بعرض `w-full` بدل `max-w-3xl mx-auto`) |
   | `typography` | خطوط `Hero`/عناوين الأقسام — استورد خطًا فعليًا (Google Fonts عبر `next/font` مثلاً) بدل الخط الافتراضي |
   | `animationDefaults` | تُستخدم تلقائيًا من `restaurant_sections.animation` عبر `RevealOnScroll` — لا حاجة لتعديل، لكن يمكن تخصيص حركة الـ Hero داخل `Hero.tsx` نفسه |
   | الفوتر | إن أردت شكلاً مختلفًا: نفّذ `Footer.tsx` بالمحتوى الإلزامي نفسه (راجع `components/site-sections/Footer.tsx`) بعرض بصري مختلف؛ وإلا اترك `Footer: SharedFooter` كما هو |

3. **سجّل الثيم في `themes/registry.ts`**: استبدل السطر التلقائي
   `themeRegistry[brief.key] = buildPlaceholderTheme(brief.key)` لهذا المفتاح تحديدًا بكائن
   `ThemeDefinition` كامل يستورد مكوناتك الفعلية، مطابقًا لنمط `minimalBuilt` أعلى الملف، مع
   `isBuilt: true`.
4. **فعّل الثيم في القاعدة**: `update themes set is_active = true where key = '<key>';` (عبر migration
   جديدة، وليس تعديلًا يدويًا مباشرًا على قاعدة الإنتاج).
5. **راجع** بمعايير `frontend-design` (تباين، حركة محترمة لـ `prefers-reduced-motion`، استجابة الجوال).

## ما لا يتغيّر أبدًا

- عقد `ThemeDefinition` في `themes/types.ts`.
- منطق جلب البيانات في `app/(public)/[slug]/page.tsx` و `layout.tsx`.
- محتوى الفوتر الإلزامي (حقوق النشر + سطر الاعتماد).
- طريقة حقن الألوان الديناميكية لكل مطعم عبر CSS variables (`--df-color-*`) — ثيمك يستهلكها
  عبر فئات Tailwind (`bg-primary`, `text-accent`, ...) وليس بقيم ثابتة.
