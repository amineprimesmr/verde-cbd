"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "verde-cbd-age-verified";

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    setVerified(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (verified === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!verified) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Vérification de l&apos;âge
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Ce site vend des produits à base de CBD réservés aux personnes
              majeures. En entrant, vous confirmez avoir 18 ans ou plus et
              acceptez nos conditions générales de vente.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  localStorage.setItem(STORAGE_KEY, "true");
                  setVerified(true);
                }}
              >
                J&apos;ai 18 ans ou plus — Entrer
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  window.location.href = "https://www.google.com";
                }}
              >
                J&apos;ai moins de 18 ans — Quitter
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Les produits CBD ne sont pas des médicaments. Consultez un
              professionnel de santé en cas de doute.
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return <>{children}</>;
}
