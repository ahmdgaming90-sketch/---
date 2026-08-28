import type { ColorTokens } from "@/themes/types";
import type React from "react";

/** تخصيص جزئي أو كلي يخزّنه المالك في restaurants.color_palette (jsonb) */
export type RestaurantPaletteOverride = Partial<{
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
}>;

/**
 * يدمج: تخصيص المطعم (أولوية أولى) فوق افتراضي الثيم المختار (أولوية ثانية)،
 * وينتج CSS variables جاهزة للحقن على عنصر الجذر — كل مكوّنات الثيمات تستهلكها
 * عبر فئات Tailwind (bg-surface, text-heading, border-border...) بدل قيم ثابتة.
 */
export function buildPaletteCssVars(
  themeDefault: ColorTokens,
  restaurantOverride: RestaurantPaletteOverride | null | undefined
): React.CSSProperties {
  const o = restaurantOverride ?? {};
  const merged: ColorTokens = {
    primary: o.primary || themeDefault.primary,
    secondary: o.secondary || themeDefault.secondary,
    accent: o.accent || themeDefault.accent,
    background: o.background || themeDefault.background,
    surface: o.surface || themeDefault.surface,
    text: o.text || themeDefault.text,
    border: o.border || themeDefault.border,
    button: o.button || themeDefault.button,
    buttonText: o.buttonText || themeDefault.buttonText,
    heading: o.heading || themeDefault.heading,
    muted: o.muted || themeDefault.muted,
  };

  return {
    "--df-color-primary": merged.primary,
    "--df-color-secondary": merged.secondary,
    "--df-color-accent": merged.accent,
    "--df-color-background": merged.background,
    "--df-color-surface": merged.surface,
    "--df-color-text": merged.text,
    "--df-color-border": merged.border,
    "--df-color-button": merged.button,
    "--df-color-button-text": merged.buttonText,
    "--df-color-heading": merged.heading,
    "--df-color-muted": merged.muted,
  } as React.CSSProperties;
}
