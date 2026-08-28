import type { ThemeDefinition } from "@/themes/types";

import { minimalDefinition } from "@/themes/minimal/theme.config";
import { midnightLuxuryDefinition } from "@/themes/midnight-luxury/theme.config";
import { mediterraneanDefinition } from "@/themes/mediterranean/theme.config";
import { urbanGrillDefinition } from "@/themes/urban-grill/theme.config";
import { specialtyCoffeeDefinition } from "@/themes/specialty-coffee/theme.config";
import { modernJapaneseDefinition } from "@/themes/modern-japanese/theme.config";
import { arabicHeritageDefinition } from "@/themes/arabic-heritage/theme.config";
import { freshGreenDefinition } from "@/themes/fresh-green/theme.config";
import { bakeryAtelierDefinition } from "@/themes/bakery-atelier/theme.config";
import { coastalDefinition } from "@/themes/coastal/theme.config";
import { contemporaryBlackDefinition } from "@/themes/contemporary-black/theme.config";
import { retroDinerDefinition } from "@/themes/retro-diner/theme.config";
import { streetFoodDefinition } from "@/themes/street-food/theme.config";
import { gardenBistroDefinition } from "@/themes/garden-bistro/theme.config";
import { editorialFineDiningDefinition } from "@/themes/editorial-fine-dining/theme.config";

/**
 * الـ 15 ثيمًا مبنية فعليًا بهوية بصرية وبنيوية مستقلة (Hero/About/Menu/Gallery/Contact/Footer
 * خاصة بكل واحد، وليست إعادة استخدام لثيم آخر) — كل واحد isBuilt: true.
 * لا يوجد أي placeholder في هذا السجل.
 */
export const themeRegistry: Record<string, ThemeDefinition> = {
  minimal: minimalDefinition,
  "midnight-luxury": midnightLuxuryDefinition,
  mediterranean: mediterraneanDefinition,
  "urban-grill": urbanGrillDefinition,
  "specialty-coffee": specialtyCoffeeDefinition,
  "modern-japanese": modernJapaneseDefinition,
  "arabic-heritage": arabicHeritageDefinition,
  "fresh-green": freshGreenDefinition,
  "bakery-atelier": bakeryAtelierDefinition,
  coastal: coastalDefinition,
  "contemporary-black": contemporaryBlackDefinition,
  "retro-diner": retroDinerDefinition,
  "street-food": streetFoodDefinition,
  "garden-bistro": gardenBistroDefinition,
  "editorial-fine-dining": editorialFineDiningDefinition,
};

/**
 * Minimal هنا ليس "ثيمًا احتياطيًا لأي ثيم آخر" — هو فقط شبكة أمان دفاعية إن وصل مفتاح
 * غير معروف إطلاقًا (بيانات تالفة، أو مطعم أُنشئ قبل إضافة ثيم لاحقًا ثم حُذف مفتاحه).
 * لا يوجد أي مطعم يُفترض أن يستخدم هذا المسار في التشغيل الطبيعي، لأن قائمة "إنشاء مطعم"
 * تعرض فقط الثيمات الموجودة فعليًا في قاعدة البيانات وكلها من هذا السجل.
 */
export function getThemeComponents(themeKey: string | null | undefined): ThemeDefinition {
  if (themeKey && themeRegistry[themeKey]) return themeRegistry[themeKey];
  return minimalDefinition;
}
