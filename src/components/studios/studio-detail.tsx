import Link from "next/link";
import { ArrowLeft, MapPin, Star, UserRound } from "lucide-react";

import { BookingDialog } from "@/components/studios/booking-dialog";
import { HostAvatar } from "@/components/studios/host-avatar";
import { StudioGallery } from "@/components/studios/studio-gallery";
import { StudioReviews } from "@/components/studios/studio-reviews";
import { categoryMeta } from "@/lib/constants";
import type { ReviewRecord, StudioRecord } from "@/lib/api";

export function StudioDetail({
  studio,
  reviews,
  reviewsError = false,
}: {
  studio: StudioRecord;
  reviews: ReviewRecord[];
  reviewsError?: boolean;
}) {
  const images = [studio.image, ...(studio.gallery ?? [])].filter(Boolean);
  const category = categoryMeta(studio.category);
  const hostPhoto = studio.ownerPhoto ?? studio.ownerImage;

  return (
    <main id="main" className="container-page section">
      <Link
        href="/studios"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-daylight hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" /> All studios
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <div className="min-w-0">
          <StudioGallery title={studio.title} images={images} />

          <section className="mt-8">
            <h2>About this studio</h2>
            <p className="measure mt-4 whitespace-pre-line text-muted-foreground">
              {studio.overview}
            </p>
          </section>

          <section className="mt-8">
            <h2>Amenities</h2>
            {studio.amenities.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-control border border-border bg-card px-3 py-2 text-sm"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                The host has not listed amenities for this space.
              </p>
            )}
          </section>

          <StudioReviews
            studioId={studio._id}
            initialReviews={reviews}
            reviewsError={reviewsError}
          />
        </div>

        <aside className="h-fit rounded-card border border-border bg-card p-5 lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-tape px-2.5 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `var(${category.colorVar})`,
                  color: category.ink,
                }}
              >
                <category.icon aria-hidden className="size-3.5" />
                {category.label}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-tungsten/15 px-2.5 py-1 text-xs font-semibold">
              <Star
                aria-hidden
                className="size-3.5 fill-tungsten text-tungsten"
              />
              {Number(studio.rating || 0).toFixed(1)}
            </span>
          </div>
          <h1 className="mt-4 text-h2">{studio.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin aria-hidden className="size-4" />
            {studio.location}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-control bg-muted p-3">
              <dt className="text-xs text-muted-foreground">Hourly rate</dt>
              <dd className="mt-1 font-heading text-lg font-semibold">
                ${studio.hourlyRate} / hr
              </dd>
            </div>
            <div className="rounded-control bg-muted p-3">
              <dt className="text-xs text-muted-foreground">
                Refundable deposit
              </dt>
              <dd className="mt-1 font-heading text-lg font-semibold">
                ${studio.securityDeposit}
              </dd>
            </div>
            <div className="col-span-2 rounded-control bg-muted p-3">
              <dt className="text-xs text-muted-foreground">
                Maximum capacity
              </dt>
              <dd className="mt-1 font-medium">{studio.capacity} people</dd>
            </div>
          </dl>

          <div className="mt-5">
            <BookingDialog
              studio={studio}
              callbackPath={`/studios/${encodeURIComponent(studio._id)}`}
            />
          </div>

          <section className="mt-6 border-t border-border pt-5">
            <h2 className="text-h3">Hosted by</h2>
            <div className="mt-4 flex items-center gap-3">
              <HostAvatar name={studio.ownerName || "Studio host"} photo={hostPhoto} />
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {studio.ownerName || "Studio host"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {studio.ownerEmail}
                </p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <UserRound aria-hidden className="size-3.5" />
              Contact details are shared for booking coordination.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
