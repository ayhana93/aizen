import type { Metadata, Viewport } from "next";
import { Inter_Tight, Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

// Oswald reads like plant signage and stencilled billet marking — and unlike
// most condensed display faces it carries a proper Cyrillic set.
const display = Oswald({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#07080a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AIZEN METAL — леярна за алуминиеви билети | Пловдив",
    template: "%s · AIZEN METAL",
  },
  description:
    "AIZEN METAL претопява алуминиев скрап и лее хомогенизирани билети за екструзия в сплави 6060 и 6063. Собствена лаборатория и сертификат за всяка партида. Радиново, Северна индустриална зона, Пловдив.",
  keywords: [
    "алуминиеви билети",
    "леярна алуминий",
    "6060",
    "6063",
    "изкупуване алуминиев скрап",
    "екструзия",
    "Пловдив",
    "aluminium billets",
    "aluminium foundry Bulgaria",
  ],
  openGraph: {
    type: "website",
    locale: "bg_BG",
    alternateLocale: ["en_GB", "tr_TR"],
    siteName: site.name,
    title: "AIZEN METAL — леярна за алуминиеви билети",
    description:
      "Претопяване на алуминиев скрап и леене на билети за екструзия в сплави 6060 и 6063. Сертификат от собствена лаборатория за всяка партида.",
    url: site.url,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  description:
    "Леярна за алуминиеви билети за екструзия — сплави EN AW-6060 и EN AW-6063, изкупуване и претопяване на алуминиев скрап.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Северна индустриална зона",
    addressLocality: "с. Радиново",
    addressRegion: "Пловдив",
    addressCountry: "BG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
