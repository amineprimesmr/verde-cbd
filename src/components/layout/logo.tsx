import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "light" = logo clair sur fond sombre. "dark" = logo sombre sur fond clair. */
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = "dark", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("relative block shrink-0 transition-opacity hover:opacity-80", className)}
      aria-label="CBD — Accueil"
    >
      <span className={cn("font-display text-3xl tracking-[0.12em]", variant === "light" ? "text-white" : "text-foreground")}>CBD<span className="text-primary">.</span></span>
    </Link>
  );
}
