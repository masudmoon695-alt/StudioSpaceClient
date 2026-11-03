import { Skeleton } from "@/components/ui/skeleton";

export function AuthFormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-5"
    >
      <div className="space-y-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-56" />
      </div>

      <Skeleton className="h-11 w-full rounded-control" />

      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-control" />
          </div>
        ))}
      </div>

      <Skeleton className="h-11 w-full rounded-control" />

      <span className="sr-only">Checking your session…</span>
    </div>
  );
}
