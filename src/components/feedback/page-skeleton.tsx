import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  label?: string;
  cards?: number;
}

/** Branded placeholder for pages that wait on a session or a fetch. */
export function PageSkeleton({
  label = "Loading this page",
  cards = 3,
}: PageSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="container-page section"
    >
      <div className="max-w-xl space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="rounded-card border border-border bg-card p-4"
          >
            <Skeleton className="aspect-4/3 w-full rounded-md" />
            <Skeleton className="mt-4 h-4 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <Skeleton className="mt-4 h-11 w-full rounded-control" />
          </div>
        ))}
      </div>

      <span className="sr-only">{label}…</span>
    </div>
  );
}
