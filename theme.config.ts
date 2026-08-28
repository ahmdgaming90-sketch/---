import type { ColorTokens, ThemeDefinition } from "@/themes/types";
import { RetroDinerHero } from "./Hero";
import { RetroDinerAbout } from "./About";
import { RetroDinerMenu } from "./MenuGrid";
import { RetroDinerGallery } from "./Gallery";
import { RetroDinerContact } from "./Contact";
import { RetroDinerFooter } from "./Footer";

export const retroDinerPalette: ColorTokens = {
  primary: "#273B43", secondary: "#71675C", accent: "#C84C3A",
  background: "#F7EEDB", surface: "#FFF9ED", text: "#22282B",
  border: "#E2B34F", button: "#273B43", buttonText: "#FFF9ED",
  heading: "#22282B", muted: "#71675C",
};

export const retroDinerDefinition: ThemeDefinition = {
  key: "retro-diner",
  isBuilt: true,
  Hero: RetroDinerHero, About: RetroDinerAbout, Menu: RetroDinerMenu,
  Gallery: RetroDinerGallery, Contact: RetroDinerContact, Footer: RetroDinerFooter,
  typography: { displayFont: "'Arial Black', Impact, sans-serif", bodyFont: "ui-sans-serif, system-ui, sans-serif", personality: "ريترو نظيف قوي" },
  cardStyle: "boxed-card",
  imageDisplayStyle: "grid",
  layoutVariant: "asymmetric-grid",
  animationDefaults: { hero: "quick-scale", sections: "quick-scale" },
  defaultPalette: retroDinerPalette,
};
