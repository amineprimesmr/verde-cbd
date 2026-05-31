"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthTrustHeader } from "@/components/auth/auth-trust-header";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const inputClass =
  "h-[52px] w-full rounded-[10px] border border-[#d9d9d9] bg-white px-4 pr-14 text-[15px] text-black placeholder:text-[#999] focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10";

export function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/compte";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authError === "auth"
      ? "Le lien de connexion est invalide ou expiré. Réessayez."
      : null
  );
  const [sent, setSent] = useState(false);

  async function sendMagicLink(e?: React.FormEvent) {
    e?.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Adresse e-mail invalide.");
      return;
    }

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(
        "La connexion en ligne n'est pas encore disponible. Contactez-nous ou passez commande en invité."
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`;

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
        data: {
          marketing_opt_in: marketingOptIn,
        },
      },
    });

    setLoading(false);

    if (otpError) {
      setError(
        otpError.message === "Email rate limit exceeded"
          ? "Trop de tentatives. Réessayez dans quelques minutes."
          : "Impossible d'envoyer le lien. Vérifiez votre e-mail et réessayez."
      );
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto min-h-screen max-w-[520px] bg-white px-5 pb-12 pt-8">
        <AuthTrustHeader />

        <div className="mt-10 text-left">
          <h1 className="text-[28px] font-semibold tracking-tight text-black">
            Consultez votre boîte mail
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#666]">
            Nous avons envoyé un lien de connexion à{" "}
            <span className="font-semibold text-black">{email.trim()}</span>.
            Cliquez dessus pour vous connecter ou créer votre compte Verde CBD.
          </p>

          <button
            type="button"
            onClick={() => {
              setSent(false);
              void sendMagicLink();
            }}
            disabled={loading}
            className="mt-8 text-[14px] font-medium text-[#1773b0] underline underline-offset-2 disabled:opacity-50"
          >
            Renvoyer le lien
          </button>

          <button
            type="button"
            onClick={() => router.push(redirect)}
            className="mt-6 flex h-[54px] w-full items-center justify-center rounded-xl bg-black text-[15px] font-bold text-white"
          >
            Continuer mes achats
          </button>
        </div>

        <p className="mt-10 text-center text-[12px] text-[#888]">
          <Link
            href="/politique-confidentialite"
            className="underline underline-offset-2"
          >
            Politique de confidentialité
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[520px] bg-white px-5 pb-12 pt-8">
      <AuthTrustHeader />

      <div className="mt-10 text-left">
        <h1 className="text-[28px] font-semibold tracking-tight text-black">
          Se connecter
        </h1>
        <p className="mt-2 text-[15px] text-[#666]">
          Se connecter ou créer un compte
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={() => void sendMagicLink()}
          className="mt-6 flex h-[54px] w-full items-center justify-center rounded-xl bg-[#5a31f4] text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Continuer avec{" "}
          <span className="ml-1 font-normal italic tracking-tight">shop</span>
        </button>

        <div className="relative my-6 flex items-center">
          <div className="flex-1 border-t border-[#e5e5e5]" />
          <span className="px-4 text-xs font-medium text-[#999]">ou</span>
          <div className="flex-1 border-t border-[#e5e5e5]" />
        </div>

        <form onSubmit={sendMagicLink}>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              className={inputClass}
              autoComplete="email"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Continuer avec mon e-mail"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-black transition-colors hover:bg-[#f5f5f5] disabled:opacity-40"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#d9d9d9] accent-black"
            />
            <span className="text-[13px] leading-snug text-[#333]">
              🚚 Recevez nos conseils et le suivi par email en cochant cette
              case.
            </span>
          </label>

          {error && (
            <p className="mt-4 rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <p className="mt-5 text-[12px] leading-relaxed text-[#888]">
            En continuant, vous acceptez nos{" "}
            <Link href="/cgv" className="underline underline-offset-2">
              Conditions d&apos;utilisation
            </Link>
            .
          </p>
        </form>
      </div>

      <p className="mt-10 text-center text-[12px] text-[#888]">
        <Link
          href="/politique-confidentialite"
          className="underline underline-offset-2"
        >
          Politique de confidentialité
        </Link>
      </p>
    </div>
  );
}
