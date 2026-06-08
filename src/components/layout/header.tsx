"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const NAV_LEFT = [
  { href: "/boutique", label: "Boutique" },
  { href: "/boutique?category=fleurs", label: "Pre-rolls" },
  { href: "/boutique?category=resines", label: "Résines" },
];

const NAV_RIGHT = [
  { href: "/boutique?category=vapes", label: "Vapes" },
  { href: "/boutique?category=accessoires", label: "Accessoires" },
  { href: "/a-propos", label: "À propos" },
];

const NAV_LINKS = [...NAV_LEFT, ...NAV_RIGHT];

function navLinkClass(pathname: string, href: string) {
  return cn(
    "rounded-full px-3 py-2 text-sm font-medium text-black/70 transition-colors hover:text-black lg:px-4 lg:text-[15px] xl:px-5",
    pathname === href.split("?")[0] && !href.includes("?") && "text-black"
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="border-b border-black/[0.06] bg-white">
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-16 lg:px-10 xl:px-14">
        {/* Gauche — icônes + nav (PC) */}
        <div className="flex min-w-0 flex-1 items-center justify-start gap-0.5 sm:gap-1 lg:gap-5 xl:gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 text-black hover:bg-black/5 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? (
              <X className="h-[22px] w-[22px] stroke-[1.5]" />
            ) : (
              <Menu className="h-[22px] w-[22px] stroke-[1.5]" />
            )}
          </Button>
          <Link href="/boutique">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 text-black hover:bg-black/5"
              aria-label="Rechercher"
            >
              <Search className="h-[20px] w-[20px] stroke-[1.5]" />
            </Button>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            {NAV_LEFT.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(pathname, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centre — logo */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto">
            <Logo variant="dark" priority className="lg:[&_img]:h-9" />
          </div>
        </div>

        {/* Droite — nav (PC) + panier */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 sm:gap-1 lg:gap-5 xl:gap-8">
          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            {NAV_RIGHT.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(pathname, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-black hover:bg-black/5"
            aria-label="Panier"
          >
            <ShoppingBag className="h-[21px] w-[21px] stroke-[1.5]" />
            <AnimatePresence>
              {mounted && itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            {/* Barre du haut — même format que le header */}
            <div className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-black/[0.06] px-4 sm:px-6">
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-black hover:bg-black/5"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <X className="h-[22px] w-[22px] stroke-[1.5]" />
                </Button>
                <Link href="/boutique" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-black hover:bg-black/5"
                    aria-label="Rechercher"
                  >
                    <Search className="h-[20px] w-[20px] stroke-[1.5]" />
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center px-2">
                <Logo variant="dark" />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    openCart();
                  }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-black hover:bg-black/5"
                  aria-label="Panier"
                >
                  <ShoppingBag className="h-[21px] w-[21px] stroke-[1.5]" />
                  {mounted && itemCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-3 text-lg font-medium text-black"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 space-y-3 border-t border-black/[0.06] pt-6">
                <Link
                  href="/compte"
                  className="flex items-center gap-3 py-2 text-sm font-medium text-black/70"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Mon compte
                </Link>
                <Link href="/boutique" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-full bg-black text-white hover:bg-black/90">
                    Découvrir la boutique
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
