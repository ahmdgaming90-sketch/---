import type { Config } from "tailwindcss";

// نظام ألوان موسّع: 11 توكن قابل للتخصيص لكل مطعم (وليس primary/secondary/accent فقط).
// القيم الافتراضية هنا هي شبكة أمان أخيرة فقط — القيمة الفعلية تأتي من:
// 1) restaurants.color_palette (تخصيص المالك، إن وُجد) يُطبَّق فوق
// 2) themes.default_palette (افتراضي الثيم المختار) يُطبَّق فوق
// 3) القيم الثابتة أدناه (fallback أخير فقط لو تعذّر جلب أي منهما)
// الحقن الفعلي لكل مطعم يحدث في app/(public)/[slug]/layout.tsx عبر CSS variables.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./themes/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--df-color-primary, #111827)",
        secondary: "var(--df-color-secondary, #6b7280)",
        accent: "var(--df-color-accent, #f59e0b)",
        background: "var(--df-color-background, #ffffff)",
        surface: "var(--df-color-surface, #ffffff)",
        ink: "var(--df-color-text, #171717)",
        border: "var(--df-color-border, #e5e5e5)",
        button: "var(--df-color-button, var(--df-color-primary, #111827))",
        "button-ink": "var(--df-color-button-text, #ffffff)",
        heading: "var(--df-color-heading, var(--df-color-text, #171717))",
        muted: "var(--df-color-muted, var(--df-color-secondary, #6b7280))",
      },
      fontFamily: {
        "df-body": "var(--df-font-body, ui-sans-serif, system-ui)",
        "df-display": "var(--df-font-display, var(--df-font-body, ui-sans-serif, system-ui))",
      },
    },
  },
  plugins: [],
};

export default config;
