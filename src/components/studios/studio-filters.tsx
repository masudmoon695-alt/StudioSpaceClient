"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import type { StudioFilters } from "@/components/studios/studio-types";

function queryFor(filters: StudioFilters): string {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `/studios?${query}` : "/studios";
}

export function StudioFilters({ initialFilters }: { initialFilters: StudioFilters }) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const firstSearchEffect = useRef(true);

  useEffect(() => {
    if (firstSearchEffect.current) {
      firstSearchEffect.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (filters.search.trim()) {
        params.set("search", filters.search.trim());
      } else {
        params.delete("search");
      }
      params.delete("page");
      const query = params.toString();
      router.replace(query ? `/studios?${query}` : "/studios", {
        scroll: false,
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [filters.search, router]);

  function updateFilter<K extends keyof StudioFilters>(
    key: K,
    value: StudioFilters[K],
  ) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (key !== "search") {
      router.replace(queryFor(next), { scroll: false });
    }
  }

  function clearFilters() {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
    router.replace("/studios", { scroll: false });
  }

  return (
    <section
      aria-label="Filter studios"
      className="mt-8 rounded-card border border-border bg-card p-5"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal aria-hidden className="size-4 text-primary" />
        Narrow your search
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="studio-search">Search by studio or location</Label>
          <div className="relative">
            <Search
              aria-hidden
              className="absolute top-3 left-3 size-4 text-muted-foreground"
            />
            <Input
              id="studio-search"
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-category">Category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              updateFilter("category", value === "all" ? "" : value ?? "")
            }
          >
            <SelectTrigger id="studio-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-sort">Sort by</Label>
          <Select
            value={filters.sort}
            onValueChange={(value) => {
              if (
                value === "newest" ||
                value === "rating" ||
                value === "price-asc" ||
                value === "price-desc"
              ) {
                updateFilter("sort", value);
              }
            }}
          >
            <SelectTrigger id="studio-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-min-price">Minimum price / hr</Label>
          <Input
            id="studio-min-price"
            type="number"
            min="0"
            inputMode="numeric"
            value={filters.minPrice}
            onChange={(event) => updateFilter("minPrice", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-max-price">Maximum price / hr</Label>
          <Input
            id="studio-max-price"
            type="number"
            min="0"
            inputMode="numeric"
            value={filters.maxPrice}
            onChange={(event) => updateFilter("maxPrice", event.target.value)}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-4"
        onClick={clearFilters}
      >
        Clear filters
      </Button>
    </section>
  );
}
