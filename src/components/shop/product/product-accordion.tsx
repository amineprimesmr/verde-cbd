"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface ProductAccordionProps {
  items: AccordionItem[];
  variant?: "default" | "brutalist" | "faq";
  className?: string;
  defaultOpen?: string;
}

export function ProductAccordion({
  items,
  variant = "default",
  className,
  defaultOpen,
}: ProductAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);

  if (variant === "brutalist") {
    return (
      <div className={cn("space-y-3 bg-[#fff8e1] px-4 py-6 sm:px-6", className)}>
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="border border-black bg-white shadow-[4px_4px_0_0_#000]">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="pr-4 text-sm font-bold text-black sm:text-base">
                  {item.title}
                </span>
                <Plus
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isOpen && "rotate-45"
                  )}
                />
              </button>
              {isOpen && (
                <div className="border-t border-black px-4 py-4 text-sm leading-relaxed text-black/80">
                  {item.content.split("\n\n").map((p, i) => (
                    <p key={i} className={i > 0 ? "mt-3" : ""}>
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "faq") {
    return (
      <div className={cn("rounded-b-2xl bg-[#f4f4f4] px-4 py-2", className)}>
        {items.map((item, i) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={cn(i > 0 && "border-t border-[#ddd]")}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-sm font-bold text-black">{item.title}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8e8e8] text-black/60">
                  <Plus className={cn("h-4 w-4 transition-transform", isOpen && "rotate-45")} />
                </span>
              </button>
              {isOpen && (
                <p className="pb-5 text-sm leading-relaxed text-black/70">
                  {item.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("divide-y divide-[#eee] border-y border-[#eee] bg-white", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between px-4 py-5 text-left sm:px-0"
            >
              <span className="text-sm font-bold text-black sm:text-base">{item.title}</span>
              {isOpen ? (
                <Minus className="h-5 w-5 shrink-0" />
              ) : (
                <Plus className="h-5 w-5 shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 pb-5 text-sm leading-relaxed text-black/70 sm:px-0">
                {item.content.split("\n\n").map((p, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
