/**
 * هذا الملف placeholder فقط.
 *
 * بعد ربط المشروع بـ Supabase الفعلي وتطبيق الـ migrations، وّلد الأنواع الحقيقية بالأمر:
 *
 *   supabase login
 *   supabase link --project-ref <project-ref>
 *   npm run supabase:gen-types
 *
 * (السكربت معرّف في package.json ويعتمد على متغير SUPABASE_PROJECT_ID)
 *
 * إلى أن يتم ذلك، النوع أدناه عام (any) حتى لا تفشل عمليات type-check قبل توليد الأنواع الحقيقية.
 */
export type Database = any;
