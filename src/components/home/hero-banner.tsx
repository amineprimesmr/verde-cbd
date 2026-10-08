"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease },
  }),
};

const HERO_ALT =
  "Produits CBD posés sur une pierre naturelle, dans une lumière douce";

/**
 * Art direction : 9:16 sur mobile, 21:9 dès la tablette paysage.
 * Les images sont servies telles quelles (images.unoptimized) : on référence
 * directement les fichiers, getImageProps ne produirait pas de srcSet.
 */
function HeroPicture() {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet="/images/hero/hero-desktop.jpg" />
      {/* eslint-disable-next-line @next/next/no-img-element -- <picture> pour l'art direction */}
      <img
        src="/images/hero/hero-mobile.jpg"
        alt={HERO_ALT}
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_75%] md:object-[70%_center]"
      />
    </picture>
  );
}

export function HeroBanner() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-sand h-[calc(100svh-6rem)] lg:h-[calc(100svh-6.5rem)] lg:min-h-[640px] lg:items-center"
    >
      <motion.div
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0 -z-10"
      >
        <HeroPicture />
      </motion.div>

      {/* Voile pour la lisibilité du texte */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/65 via-ink/15 to-transparent lg:bg-gradient-to-r lg:from-ink/55 lg:via-ink/15 lg:to-transparent"
      />

      <div className="container-x pb-12 sm:pb-16 lg:pb-0">
        <div className="max-w-xl text-primary-foreground lg:max-w-2xl">
          <motion.p
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/85"
          >
            Chanvre européen · THC &lt; 0,3&nbsp;%
          </motion.p>
          <motion.h1
            id="hero-title"
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-4 font-display text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[5.25rem]"
          >
            Le calme,
            <br />
            <em className="font-light italic">cultivé avec soin.</em>
          </motion.h1>
          <motion.p
            custom={0.32}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 max-w-md text-[15px] leading-relaxed text-primary-foreground/85 sm:text-base"
          >
            Fleurs, pre-rolls, résines et accessoires : explorez les
            classiques du chanvre, dans une boutique pensée pour vous.
          </motion.p>
          <motion.div
            custom={0.44}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/boutique"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-foreground px-7 text-sm font-medium text-foreground hover:bg-white"
            >
              Découvrir la boutique
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="/a-propos"
              className="inline-flex h-12 items-center justify-center rounded-full border border-primary-foreground/50 px-7 text-sm font-medium text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10"
            >
              Notre démarche
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
