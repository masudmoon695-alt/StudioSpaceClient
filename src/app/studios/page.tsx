import type { Metadata } from "next";
import { Camera } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioFilters } from "@/components/studios/studio-filters";
import { ButtonLink } from "@/components/button-link";
import { studiosApi } from "@/lib/api";
import type { StudioListResult } from "@/lib/api";
import type { StudioFilters as StudioFilterValues, StudioSort } from "@/components/studios/studio-types";

export const metadata: Metadata = {
  title: "Explore studios",
  description: "Search creative studios by category, location, hourly rate and capacity.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const single = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";
  const sortValue = single(query.sort);
  const sort: StudioSort =
    sortValue === "rating" ||
    sortValue === "price-asc" ||
    sortValue === "price-desc"
      ? sortValue
      : "newest";
  const parsedPage = Number.parseInt(single(query.page), 10);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const parsePrice = (value: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  };
  const minPriceValue = parsePrice(single(query.minPrice));
  const maxPriceValue = parsePrice(single(query.maxPrice));
  const filters: StudioFilterValues = {
    search: single(query.search),
    category: single(query.category),
    minPrice: single(query.minPrice),
    maxPrice: single(query.maxPrice),
    sort,
  };

  let result: StudioListResult;
  try {
    result = await studiosApi.list({
      search: filters.search || undefined,
      category: filters.category || undefined,
      minPrice: minPriceValue,
      maxPrice: maxPriceValue,
      sort,
      page,
      limit: 9,
    });
  } catch {
    return (
      <main id="main" className="container-page section">
        <h1 className="text-h1">Find your next creative space</h1>
        <StudioFilters key={JSON.stringify(filters)} initialFilters={filters} />
        <div className="mt-8">
          <ErrorState message="Studios couldn't be loaded. Check your connection and try again." />
        </div>
      </main>
    );
  }

  const pages = Math.max(1, result.pagination.pages);
  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    if (target > 1) params.set("page", String(target));
    const suffix = params.toString();
    return `/studios${suffix ? `?${suffix}` : ""}`;
  };

  return (
    <main id="main" className="container-page section">
      <div className="max-w-3xl">
        <h1 className="text-h1">Find your next creative space</h1>
        <p className="measure mt-4 text-lede">
          Search studios by what you make, where you work and what your production needs.
        </p>
      </div>
      <StudioFilters key={JSON.stringify(filters)} initialFilters={filters} />
      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="text-h3">
          {result.pagination.total} {result.pagination.total === 1 ? "studio" : "studios"}
        </h2>
        {filters.category ? (
          <span className="rounded-tape bg-accent px-3 py-1 text-sm text-accent-foreground">
            {filters.category}
          </span>
        ) : null}
      </div>
      {result.studios.length ? (
        <div className="mt-5 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            icon={Camera}
            title="No studios match these filters"
            description="Try a different search or clear your filters to see every available room."
            actionLabel="Clear filters"
            actionHref="/studios"
          />
        </div>
      )}
      {pages > 1 ? (
        <nav aria-label="Studio results pages" className="mt-8 flex items-center justify-center gap-3">
          {page > 1 ? (
            <ButtonLink href={pageHref(page - 1)} variant="outline">Previous</ButtonLink>
          ) : null}
          <span className="px-2 text-sm text-muted-foreground" aria-current="page">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <ButtonLink href={pageHref(page + 1)} variant="outline">Next</ButtonLink>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
