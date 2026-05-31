import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "success";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          default: "bg-accent-soft text-primary",
          secondary: "bg-warm text-muted",
          outline: "border border-border text-muted-foreground",
          success: "bg-accent-soft text-primary",
        }[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
