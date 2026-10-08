"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/boutique", label: "Tout voir" },
  { href: "/boutique?category=fleurs", label: "Fleurs & Pre-rolls" },
  { href: "/boutique?category=resines", label: "Résines" },
  { href: "/boutique?category=vapes", label: "Vapes" },
  { href: "/boutique?category=accessoires", label: "Accessoires" },
];

const SECONDARY_LINKS = [
  { href: "/a-propos", label: "Notre histoire" },
  { href: "/livraison", label: "Livraison" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const SEARCH_SUGGESTIONS = ["Amnesia", "Mango Kush", "Pollen", "Hash", "E-liquide", "Grinder"];

const ease = [0.16, 1, 0.3, 1] as const;

const iconBtn =
  "relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.06]";

/** Lit ?category=… séparément pour isoler useSearchParams dans un Suspense. */
function DesktopNav({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <>
      {NAV_LINKS.map((link) => {
        const [path, query] = link.href.split("?");
        const linkCategory = query ? new URLSearchParams(query).get("category") : null;
        const isActive =
          pathname === path &&
          (linkCategory ? activeCategory === linkCategory : !activeCategory);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative px-1 py-2 text-[13px] tracking-wide text-foreground/70 transition-colors hover:text-foreground",
              isActive && "text-foreground"
            )}
          >
            {link.label}
            {isActive && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-1 -bottom-0.5 h-px bg-foreground"
                transition={{ duration: 0.35, ease }}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}

function StaticDesktopNav() {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="px-1 py-2 text-[13px] tracking-wide text-foreground/70 hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const inputId = useId();

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [open]);

  function go(q: string) {
    const value = q.trim();
    onClose();
    router.push(value ? `/boutique?q=${encodeURIComponent(value)}` : "/boutique");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-ink/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Rechercher un produit"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-x-0 top-0 z-[95] bg-background shadow-[0_24px_64px_rgb(31_35_30/0.12)]"
          >
            <div className="container-x pb-8 pt-4 sm:pb-10 sm:pt-6">
              <div className="flex justify-end">
                <button type="button" onClick={onClose} className={iconBtn} aria-label="Fermer la recherche">
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  go(query);
                }}
                className="mx-auto mt-2 max-w-3xl"
              >
                <label htmlFor={inputId} className="eyebrow">
                  Que recherchez-vous&nbsp;?
                </label>
                <div className="mt-3 flex items-center gap-3 border-b border-foreground/25 pb-3 focus-within:border-foreground">
                  <Search className="h-5 w-5 shrink-0 stroke-[1.5] text-foreground/60" aria-hidden />
                  <input
                    ref={inputRef}
                    id={inputId}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pre-roll, résine, e-liquide…"
                    autoComplete="off"
                    enterKeyHint="search"
                    className="min-w-0 flex-1 bg-transparent font-display text-2xl text-foreground outline-none placeholder:text-foreground/35 focus-visible:outline-none sm:text-4xl"
                  />
                  <button
                    type="submit"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary-light"
                    aria-label="Lancer la recherche"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground">Recherches fréquentes</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {SEARCH_SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => go(s)}
                          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/80 hover:border-foreground/40 hover:text-foreground"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-ink/35 lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="menu-panel"
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-y-0 left-0 z-[95] flex w-[88vw] max-w-sm flex-col bg-background lg:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <Logo variant="dark" />
              <button type="button" onClick={onClose} className={iconBtn} aria-label="Fermer le menu">
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Navigation mobile">
              <p className="eyebrow">Boutique</p>
              <ul className="mt-4 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.045, duration: 0.4, ease }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-2.5 font-display text-[1.75rem] leading-tight text-foreground"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 text-foreground/40" aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <p className="eyebrow mt-10">CBD</p>
              <ul className="mt-3 space-y-0.5">
                {SECONDARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onClose} className="block py-2 text-[15px] text-foreground/75 hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border px-6 py-5">
              <Link
                href="/compte"
                onClick={onClose}
                className="flex items-center gap-3 text-sm text-foreground/80 hover:text-foreground"
              >
                <User className="h-5 w-5 stroke-[1.5]" aria-hidden />
                Mon compte
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [previousPath, setPreviousPath] = useState(pathname);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  const overlayOpen = mobileOpen || searchOpen;

  useEffect(() => {
    if (!overlayOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [overlayOpen]);

  const cartLabel =
    mounted && itemCount > 0
      ? `Ouvrir le panier, ${itemCount} article${itemCount > 1 ? "s" : ""}`
      : "Ouvrir le panier";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "glass border-border shadow-[0_1px_0_rgb(31_35_30/0.02),0_8px_24px_-12px_rgb(31_35_30/0.12)]"
            : "border-transparent bg-background"
        )}
      >
        <div
          className={cn(
            "container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[4.5rem] lg:grid-cols-[auto_1fr_auto]"
          )}
        >
          {/* Gauche */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              className={cn(iconBtn, "-ml-2.5")}
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
            >
              <Menu className="h-[22px] w-[22px] stroke-[1.5]" />
            </button>
          </div>
          <div className="justify-self-center lg:justify-self-start">
            <Logo variant="dark" priority />
          </div>

          {/* Centre — navigation desktop */}
          <nav className="hidden items-center justify-center gap-7 lg:flex xl:gap-9" aria-label="Navigation principale">
            <Suspense fallback={<StaticDesktopNav />}>
              <DesktopNav pathname={pathname} />
            </Suspense>
            <span className="h-4 w-px bg-border" aria-hidden />
            <Link
              href="/a-propos"
              aria-current={pathname === "/a-propos" ? "page" : undefined}
              className={cn(
                "px-1 py-2 text-[13px] tracking-wide text-foreground/70 hover:text-foreground",
                pathname === "/a-propos" && "text-foreground"
              )}
            >
              Notre histoire
            </Link>
          </nav>

          {/* Droite */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <button
              type="button"
              className={iconBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5 stroke-[1.5]" />
            </button>
            <Link href="/compte" className={cn(iconBtn, "hidden sm:flex")} aria-label="Mon compte">
              <User className="h-5 w-5 stroke-[1.5]" />
            </Link>
            <button type="button" onClick={openCart} className={cn(iconBtn, "-mr-2.5")} aria-label={cartLabel}>
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              <AnimatePresence>
                {mounted && itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="absolute right-1 top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold tabular-nums text-primary-foreground"
                    aria-hidden
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
