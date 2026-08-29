import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";
import { AgeGate } from "@/components/layout/age-gate";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Verde CBD — Boutique CBD Premium en France",
    template: "%s | Verde CBD",
  },
  description:
    "Découvrez notre sélection de pre-rolls CBD, résines, vapes et accessoires. Produits certifiés, THC < 0,3%, analyses laboratoire. Livraison rapide en France.",
  keywords: ["CBD", "pre-roll CBD", "résine CBD", "vape CBD", "e-liquide CBD", "chanvre", "France"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Verde CBD",
    title: "Verde CBD — Boutique CBD Premium en France",
    description:
      "Pre-rolls, résines, vapes et accessoires CBD certifiés. THC < 0,3%, analyses laboratoire, livraison rapide en France.",
    images: [{ url: "/images/logo-cbd.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verde CBD — Boutique CBD Premium en France",
    description:
      "Pre-rolls, résines, vapes et accessoires CBD certifiés. THC < 0,3%, analyses laboratoire, livraison rapide en France.",
    images: ["/images/logo-cbd.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col antialiased">
        <AgeGate>
          <SiteChrome>{children}</SiteChrome>
        </AgeGate>
      </body>
    </html>
  );
}
