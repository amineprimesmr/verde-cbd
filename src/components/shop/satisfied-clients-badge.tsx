import Image from "next/image";
import { cn } from "@/lib/utils";

export const SATISFIED_CLIENT_AVATARS = [
  { src: "/images/clients/client-1.png", alt: "Client Verde CBD" },
  { src: "/images/clients/client-2.png", alt: "Client Verde CBD" },
  { src: "/images/clients/client-3.png", alt: "Client Verde CBD" },
  { src: "/images/clients/client-4.png", alt: "Client Verde CBD" },
] as const;

interface SatisfiedClientsBadgeProps {
  className?: string;
}

export function SatisfiedClientsBadge({ className }: SatisfiedClientsBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full bg-[#f5ebe3] px-4 py-2",
        className
      )}
    >
      <div className="flex -space-x-2">
        {SATISFIED_CLIENT_AVATARS.map((client, index) => (
          <div
            key={client.src}
            className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#f5ebe3] bg-[#e8ddd4]"
            style={{ zIndex: SATISFIED_CLIENT_AVATARS.length - index }}
          >
            <Image
              src={client.src}
              alt={client.alt}
              fill
              className="object-cover"
              sizes="28px"
            />
          </div>
        ))}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wide text-black">
        + 2 000 clients satisfaits
      </span>
    </div>
  );
}
