"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrustpilotRating } from "@/components/home/trustpilot-rating-bar";

const MOBILE_BANNER_WIDTH = 1254;
const MOBILE_BANNER_HEIGHT = 1254;

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease },
  }),
};

function HeroContent() {
  return (
    <div className="w-full max-w-xl lg:max-w-2xl">
      <motion.h1
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="font-display text-[2.5rem] font-medium leading-[1.05] tracking-tight text-white sm:text-[2.75rem] md:text-6xl lg:text-[4.25rem] lg:leading-[1.02]"
      >
        L&apos;équilibre
        <br />
        <span className="text-[#6dcc8a]">naturel.</span>
      </motion.h1>

      <motion.p
        custom={0.08}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/65 sm:mt-6 sm:max-w-md sm:text-lg lg:mt-7"
      >
        Des produits CBD premium, français &amp; éco-responsables.
        <span className="hidden sm:inline">
          {" "}
          Pre-rolls, résines, vapes et accessoires sélectionnés avec exigence.
        </span>
      </motion.p>

      <motion.div
        custom={0.16}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-8 flex flex-col items-center sm:mt-9 lg:mt-10 lg:items-start"
      >
        <div className="flex w-full flex-col items-center gap-6 lg:w-max lg:items-stretch">
          <Link href="/boutique" className="w-full">
            <Button
              size="lg"
              className="h-[52px] w-full rounded-full bg-[#2d6a4f] px-8 text-base font-black uppercase tracking-[-0.02em] text-white shadow-[0_8px_32px_rgba(45,106,79,0.45)] transition-all duration-500 hover:bg-[#40916c] hover:shadow-[0_12px_40px_rgba(45,106,79,0.55)] active:scale-[0.98] sm:h-14 sm:text-lg sm:tracking-[-0.03em] sm:hover:scale-[1.02] lg:min-w-0"
            >
              Découvrir les offres
            </Button>
          </Link>

          <TrustpilotRating className="w-auto lg:w-full lg:justify-start lg:text-left" />
        </div>
      </motion.div>
    </div>
  );
}

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#050505]">
      {/* ── Mobile — image native 1:1, pleine largeur, sans recadrage ── */}
      <div className="relative w-full lg:hidden">
        <Image
          src="/images/bannermobile.png"
          alt="Pre-rolls et produits CBD premium Verde"
          width={MOBILE_BANNER_WIDTH}
          height={MOBILE_BANNER_HEIGHT}
          priority
          unoptimized
          sizes="100vw"
          className="block h-auto w-full max-w-none"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505]/55 via-[#050505]/15 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505]/45 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-x-0 top-0 px-5 pt-10 sm:px-8 sm:pt-14">
          <HeroContent />
        </div>
      </div>

      {/* ── Desktop — banner.png ── */}
      <div className="relative hidden min-h-[88vh] lg:block">
        <div className="absolute inset-0">
          <Image
            src="/images/banner.png"
            alt="Pre-rolls et produits CBD premium Verde"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-10 pt-16">
          <HeroContent />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
