import { cn } from "@/lib/utils";

function TrustpilotStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className ?? "h-[16px] w-[16px] shrink-0 sm:h-[18px] sm:w-[18px]"}
    >
      <rect width="24" height="24" fill="#00b67a" />
      <path
        fill="#fff"
        d="M12 16.1l3.82 2.52-1.1-4.48L18.6 11H14.1L12 6.9 9.9 11H5.4l3.88 3.12-1.1 4.48L12 16.1z"
      />
    </svg>
  );
}

interface TrustpilotRatingProps {
  className?: string;
}

export function TrustpilotRating({ className }: TrustpilotRatingProps) {
  return (
    <div
      className={cn(
        "flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-full border border-white/10 bg-black/45 px-4 py-2.5 text-center text-[13px] text-white shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:gap-x-2.5 sm:px-5 sm:text-[14px]",
        "[&_span]:[text-shadow:0_1px_6px_rgba(0,0,0,0.9)]",
        className
      )}
      aria-label="Note Trustpilot : 4,7 sur 5"
    >
      <span className="font-medium">Excellent</span>

      <div className="flex items-center gap-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <TrustpilotStar key={i} />
        ))}
      </div>

      <span className="font-medium text-white/95">Noté 4,7/5 sur</span>

      <div className="flex items-center gap-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]">
        <TrustpilotStar />
        <span className="font-bold tracking-[-0.01em]">Trustpilot</span>
      </div>
    </div>
  );
}
