import type { Metadata } from "next";
import Link from "next/link";
import { Aperture, Clapperboard, Mic, Music4, Palette, Camera } from "lucide-react";

import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "About StudioSpace",
  description: "StudioSpace connects creators with the independent rooms where good work gets made.",
};

const ROOM_TYPES = [
  { name: "Photo studios", icon: Camera },
  { name: "Film stages", icon: Clapperboard },
  { name: "Podcast lounges", icon: Mic },
  { name: "Music suites", icon: Music4 },
  { name: "Art workshops", icon: Palette },
];

export default function AboutPage() {
  return (
    <main id="main">
      <section className="container-page section">
        <div className="max-w-3xl">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-primary">
            <Aperture aria-hidden className="size-6" />
          </span>
          <h1 className="mt-6 text-h1">Good work needs the right room</h1>
          <p className="measure mt-5 text-lede">
            StudioSpace helps creators find and book independent creative spaces by the hour, with practical details and pricing shown up front.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-card border border-border bg-card p-6 sm:p-8">
            <h2>Built for creators and hosts</h2>
            <p className="measure mt-4 text-muted-foreground">
              A studio day is easier when the room, equipment and house details are clear before you arrive. We bring independent hosts and working creators together around that simple idea.
            </p>
            <p className="measure mt-4 text-muted-foreground">
              Hosts can present their spaces, set an hourly rate and manage booking requests. Creators can compare rooms and send a request without losing the useful details in a thread of messages.
            </p>
            <ButtonLink href="/studios" className="mt-6">Explore available spaces</ButtonLink>
          </article>
          <aside className="rounded-card border border-border bg-card p-6 sm:p-8">
            <h2>Spaces for the whole production</h2>
            <ul className="mt-5 space-y-3">
              {ROOM_TYPES.map(({ name, icon: Icon }) => (
                <li key={name}>
                  <Link href={`/studios?search=${encodeURIComponent(name)}`} className="flex min-h-11 items-center gap-3 text-sm hover:text-daylight">
                    <Icon aria-hidden className="size-4 text-primary" /> {name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
