import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";
import { COMMERCE_ENABLED } from "@/lib/commerce";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  robots: { index: COMMERCE_ENABLED, follow: COMMERCE_ENABLED },
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CBD — Boutique CBD Premium en France",
    template: "%s | CBD",
  },
  description:
    "Découvrez notre sélection de fleurs et pre-rolls CBD, résines, vapes et accessoires.",
  keywords: ["CBD", "pre-roll CBD", "résine CBD", "vape CBD", "e-liquide CBD", "chanvre", "France"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "CBD",
    title: "CBD — Boutique CBD Premium en France",
    description:
      "Fleurs, pre-rolls, résines, vapes et accessoires CBD.",
    images: [{ url: "/images/hero/hero-desktop.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CBD — Boutique CBD Premium en France",
    description:
      "Fleurs, pre-rolls, résines, vapes et accessoires CBD.",
    images: ["/images/hero/hero-desktop.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${fraunces.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col antialiased">
        {!COMMERCE_ENABLED && <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">Boutique de démonstration · Catalogue et visuels illustratifs · Aucun paiement réel</div>}
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
