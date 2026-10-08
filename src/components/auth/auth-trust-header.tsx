import { Lock, RotateCcw, Truck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

interface AuthTrustHeaderProps {
  className?: string;
}

export function AuthTrustHeader({ className }: AuthTrustHeaderProps) {
  return (
    <header className={cn("flex flex-col items-center text-center", className)}>
      <div className="flex w-full justify-center">
        <Logo className="h-8 sm:h-9" priority />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" aria-hidden />
          Expédié sous 24 h
        </span>
        <span className="inline-flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Retours sous 14 jours
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Paiement sécurisé
        </span>
      </div>
    </header>
  );
}
