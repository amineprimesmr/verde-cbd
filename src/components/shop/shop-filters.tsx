"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

interface ShopFiltersProps {
  categories: { id: ProductCategory; name: string }[];
  activeCategory?: ProductCategory;
}

export function ShopFilters({ categories, activeCategory }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`/boutique?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/boutique"
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
            !activeCategory
              ? "bg-primary text-white shadow-sm"
              : "bg-warm text-muted hover:bg-cream hover:text-primary"
          )}
        >
          Tous
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/boutique?category=${cat.id}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              activeCategory === cat.id
                ? "bg-primary text-white shadow-sm"
                : "bg-warm text-muted hover:bg-cream hover:text-primary"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <form onSubmit={handleSearch} className="relative w-full sm:w-72">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </form>
    </div>
  );
}
