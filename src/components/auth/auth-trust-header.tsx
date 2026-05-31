import { Clock, Lock, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SatisfiedClientsBadge } from "@/components/shop/satisfied-clients-badge";
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

      <SatisfiedClientsBadge className="mt-5" />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-[#666]">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Livraison <span className="font-bold text-black">RAPIDE</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Garantie <span className="font-bold text-black">30 jours</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" />
          Paiement <span className="font-bold text-black">sécurisé</span>
        </span>
      </div>
    </header>
  );
}
