"use client";

import { usePathname } from "next/navigation";
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
    return <>{children}</>;
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <Footer />
    </>
  );
}
