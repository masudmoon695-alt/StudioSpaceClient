import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryMeta } from "@/lib/constants";
import type { StudioRecord } from "@/lib/api";

export function StudioCard({ studio }: { studio: StudioRecord }) {
  const category = categoryMeta(studio.category);
  const Icon = category?.icon;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-card">
      <Link
        href={`/studios/${encodeURIComponent(studio._id)}`}
        className="group relative block aspect-4/3 overflow-hidden bg-muted"
        aria-label={`View ${studio.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={`${studio.title} in ${studio.location}`}
          className="size-full object-cover"
        />
        {category ? (
          <span
            className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-tape px-2.5 py-1 text-xs font-semibold"
            style={{
              backgroundColor: `var(${category.colorVar})`,
              color: category.ink,
            }}
          >
            {Icon ? <Icon aria-hidden className="size-3.5" /> : null}
            {category.label}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-h3">{studio.title}</h2>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-tungsten/15 px-2 py-1 text-xs font-semibold">
            <Star aria-hidden className="size-3.5 fill-tungsten text-tungsten" />
            {Number(studio.rating || 0).toFixed(1)}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin aria-hidden className="size-4 shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <p className="mt-4 font-heading text-lg font-semibold">
          ${studio.hourlyRate} <span className="font-sans text-sm font-normal text-muted-foreground">/ hr</span>
        </p>
        <Button
          nativeButton={false}
          render={<Link href={`/studios/${encodeURIComponent(studio._id)}`} />}
          className="mt-auto min-h-11 w-full"
        >
          View details
        </Button>
      </div>
    </article>
  );
}
