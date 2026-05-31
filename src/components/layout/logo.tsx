import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "light" = logo blanc sur fond sombre (hero). "dark" = logo sombre sur fond clair. */
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = "dark", className, priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("relative block shrink-0 transition-opacity hover:opacity-90", className)}
      aria-label="Verde CBD — Accueil"
    >
      <Image
        src="/images/logo-cbd.png"
        alt="CBD"
        width={820}
        height={360}
        priority={priority}
        className={cn(
          "h-7 w-auto sm:h-8 lg:h-9",
          variant === "light"
            ? "[mix-blend-mode:screen]"
            : "brightness-0"
        )}
      />
    </Link>
  );
}
