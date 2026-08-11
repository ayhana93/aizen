/**
 * Single source of truth for company data.
 *
 * TODO(AIZEN): the values marked PLACEHOLDER are best guesses and must be
 * replaced with the real ones before the site goes public.
 */
export const site = {
  name: "AIZEN METAL",
  domain: "aizenmetal.bg", // PLACEHOLDER
  url: "https://aizenmetal.bg", // PLACEHOLDER
  email: "office@aizenmetal.bg", // PLACEHOLDER
  phone: "+359 000 000 000", // PLACEHOLDER
  phoneHref: "+359000000000", // PLACEHOLDER
  address: {
    bg: "с. Радиново, Северна индустриална зона, обл. Пловдив, България",
    en: "Radinovo, North Industrial Zone, Plovdiv Province, Bulgaria",
  },
  /** Radinovo, Plovdiv — approximate, refine with the exact plant entrance. */
  geo: { lat: 42.2019, lng: 24.6206 },
  alloys: ["6060", "6063"] as const,
  /** Billet diameters in millimetres. */
  diameters: [152, 178, 203, 228] as const,
  /** Billet lengths in millimetres. */
  lengths: [500, 1000, 2000, 3000, 4000, 6000] as const,
  castTempC: 720,
  homogenizationC: 575,
} as const;

export type Locale = "bg" | "en";
