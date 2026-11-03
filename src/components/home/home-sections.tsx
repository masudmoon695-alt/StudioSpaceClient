"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Camera,
  CircleCheck,
  Headphones,
  Lightbulb,
  Mic,
  Music2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StudioCard } from "@/components/studios/studio-card";
import { Skeleton } from "@/components/ui/skeleton";
import { studiosApi } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { StudioRecord } from "@/lib/api";

const CATEGORY_IMAGES: Record<string, string> = {
  "Photo Studio": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80",
  "Film Stage": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80",
  "Podcast Lounge": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=80",
  "Music Suite": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80",
  Workshop: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=900&q=80",
};

const STEPS = [
  { title: "Discover spaces", detail: "Compare studios by category, location and hourly rate.", icon: Camera },
  { title: "Select shoot hours", detail: "Choose the date and time that fits your call sheet.", icon: CalendarCheck },
  { title: "Book your space", detail: "Send a request with the deposit and total shown up front.", icon: CircleCheck },
  { title: "Create and produce", detail: "Arrive ready to make something worth sharing.", icon: Sparkles },
];

const SUPPORT = [
  { title: "Clear booking details", detail: "Rates, deposits and capacity are visible before you request a time.", icon: Lightbulb },
  { title: "Host-reviewed requests", detail: "Hosts manage incoming bookings from their production desk.", icon: ShieldCheck },
  { title: "Rooms built for the work", detail: "Find the right light, sound treatment, gear and working space.", icon: Headphones },
  { title: "A human host on set", detail: "Contact the space owner directly when you need practical details.", icon: Mic },
];

export function HomeSections() {
  const [studios, setStudios] = useState<StudioRecord[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoryCountsLoading, setCategoryCountsLoading] = useState(true);
  const [categoryCountsError, setCategoryCountsError] = useState(false);

  async function loadStudios() {
    try {
      const result = await studiosApi.list({ limit: 6, sort: "rating" });
      setStudios(result.studios);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    studiosApi
      .list({ limit: 6, sort: "rating" })
      .then((result) => {
        if (active) setStudios(result.studios);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all(
      CATEGORIES.map((category) =>
        studiosApi.list({ category: category.value, limit: 1 }),
      ),
    )
      .then((results) => {
        if (!active) return;
        setCategoryCounts(
          Object.fromEntries(
            CATEGORIES.map((category, index) => [
              category.value,
              results[index]?.pagination.total ?? 0,
            ]),
          ),
        );
      })
      .catch(() => {
        if (active) setCategoryCountsError(true);
      })
      .finally(() => {
        if (active) setCategoryCountsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function retryStudios() {
    setLoading(true);
    setError(false);
    void loadStudios();
  }

  return (
    <>
      <section className="container-page section" aria-labelledby="featured-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading">Studios ready for your next call</h2>
            <p className="measure mt-3 text-muted-foreground">
              A few well-equipped rooms to get your next project moving.
            </p>
          </div>
          <Link className="inline-flex min-h-11 items-center gap-2 font-medium text-daylight hover:underline" href="/studios">
            Explore all studios <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="rounded-card border border-border bg-card p-4">
                  <Skeleton className="aspect-4/3 w-full" />
                  <Skeleton className="mt-4 h-6 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-1/2" />
                  <Skeleton className="mt-5 h-11 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState onRetry={retryStudios} />
          ) : studios.length ? (
            <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {studios.slice(0, 6).map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Camera}
              title="No studios are listed yet"
              description="Hosts are getting their rooms ready. Check back soon or explore all categories."
              actionLabel="Explore studios"
              actionHref="/studios"
            />
          )}
        </div>
      </section>

      <section className="section border-y border-border bg-card/50" aria-labelledby="categories-heading">
        <div className="container-page">
          <h2 id="categories-heading">Find the room for the work</h2>
          <p className="measure mt-3 text-muted-foreground">
            From controlled light to a quiet vocal booth, start with what you need to make.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.value}
                  href={`/studios?category=${encodeURIComponent(category.value)}`}
                  className="group relative aspect-[4/5] min-h-56 overflow-hidden rounded-card border border-border bg-muted focus-visible:outline"
                  aria-label={`Explore ${category.plural}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CATEGORY_IMAGES[category.value]}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                  <span
                    className="absolute inset-x-0 bottom-0 flex min-h-24 flex-col justify-end p-4 text-left"
                    style={{ background: `linear-gradient(transparent, color-mix(in srgb, var(${category.colorVar}) 88%, #0c1222))`, color: category.ink }}
                  >
                    <span className="flex items-center gap-2 font-heading text-lg font-semibold">
                      <Icon aria-hidden className="size-5" />
                      {category.plural}
                    </span>
                    <span className="mt-1 text-sm">
                      {categoryCountsLoading
                        ? "Loading spaces…"
                        : categoryCountsError
                          ? "Count unavailable · browse spaces"
                          : `${categoryCounts[category.value] ?? 0} ${categoryCounts[category.value] === 1 ? "space" : "spaces"}`}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page section" aria-labelledby="steps-heading">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="steps-heading">A clear route from search to shoot</h2>
          <p className="mt-3 text-muted-foreground">
            Book creative space without a long email chain.
          </p>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative rounded-card border border-border bg-card p-5">
              <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground font-heading font-semibold">
                {index + 1}
              </span>
              <step.icon aria-hidden className="mt-5 size-5 text-primary" />
              <h3 className="mt-3 text-h3">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section border-y border-border bg-card/50" aria-labelledby="support-heading">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 id="support-heading">A better set starts with a good room</h2>
            <p className="mt-3 text-muted-foreground">
              Practical details stay visible, so creators and hosts can focus on the work.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT.map((item) => (
              <article key={item.title} className="rounded-card border border-border bg-card p-5">
                <item.icon aria-hidden className="size-5 text-primary" />
                <h3 className="mt-4 text-h3">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Music2 aria-hidden className="size-4 text-primary" />
            Need a music suite, a podcast lounge or a full workshop? Start with Explore.
          </p>
        </div>
      </section>
    </>
  );
}
