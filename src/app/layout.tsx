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

export const metadata: Metadata = {
  title: {
    default: "Verde CBD — Boutique CBD Premium en France",
    template: "%s | Verde CBD",
  },
  description:
    "Découvrez notre sélection de fleurs CBD, résines, huiles et cosmétiques. Produits certifiés, THC < 0,3%, analyses laboratoire. Livraison rapide en France.",
  keywords: ["CBD", "fleurs CBD", "huile CBD", "résine CBD", "chanvre", "France"],
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
