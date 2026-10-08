"use client";

import { useId, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  /** "light" = sur fond clair, "dark" = sur fond sauge profond. */
  tone?: "light" | "dark";
  className?: string;
}

export function NewsletterForm({ tone = "light", className }: NewsletterFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputId = useId();
  const errorId = useId();
  const dark = tone === "dark";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Une erreur est survenue");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p
        role="status"
        className={cn(
          "mt-4 flex items-center gap-2 text-sm font-medium",
          dark ? "text-primary-foreground" : "text-primary",
          className
        )}
      >
        <Check className="h-4 w-4" aria-hidden />
        Merci, votre inscription est confirmée.
      </p>
    );
  }

  return (
    <form className={cn("mt-4", className)} onSubmit={handleSubmit} noValidate={false}>
      <label htmlFor={inputId} className="sr-only">
        Adresse e-mail
      </label>
      <div
        className={cn(
          "flex items-center gap-2 border-b pb-2 transition-colors",
          dark
            ? "border-primary-foreground/40 focus-within:border-primary-foreground"
            : "border-foreground/25 focus-within:border-foreground"
        )}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          placeholder="votre@email.fr"
          autoComplete="email"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-10 min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:outline-none",
            dark
              ? "text-primary-foreground placeholder:text-primary-foreground/55"
              : "text-foreground placeholder:text-foreground/40"
          )}
        />
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium disabled:opacity-60",
            dark
              ? "bg-primary-foreground text-foreground hover:bg-white"
              : "bg-primary text-primary-foreground hover:bg-primary-light"
          )}
        >
          {loading ? "Envoi…" : "S'inscrire"}
          {!loading && <ArrowRight className="h-3.5 w-3.5" aria-hidden />}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className={cn("mt-2 text-xs", dark ? "text-[#f3c9bd]" : "text-[#9b3a26]")}>
          {error}
        </p>
      )}
    </form>
  );
}
