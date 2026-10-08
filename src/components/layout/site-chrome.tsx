"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/shop/cart-drawer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalLayout =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/connexion") ||
    pathname.startsWith("/inscription");

  if (isMinimalLayout) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:text-primary-foreground"
      >
        Aller au contenu
      </a>
      <AnnouncementBar />
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <CartDrawer />
      <Footer />
    </MotionConfig>
  );
}
