import type { Metadata } from "next";
import { CalendarDays, Camera, Check, Clock3, Search } from "lucide-react";

import { ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "How it works",
  description: "Find a creative studio, choose your hours and send a booking request with clear pricing.",
};

const STEPS = [
  { title: "Discover a space", text: "Filter by room type, neighborhood, rate and capacity until the setup fits your production.", icon: Search },
  { title: "Choose your hours", text: "Open a listing to review the gear, house details, hourly rate and refundable deposit.", icon: Clock3 },
  { title: "Send a booking request", text: "Pick the date and time. Your estimate is shown before the request reaches the host.", icon: CalendarDays },
  { title: "Make the work", text: "Once the host confirms, arrive at the agreed time and focus on your shoot, session or workshop.", icon: Camera },
];

export default function HowItWorksPage() {
  return (
    <main id="main">
      <section className="container-page section">
        <div className="max-w-3xl">
          <h1 className="text-h1">Studio time, without the long email chain</h1>
          <p className="measure mt-5 text-lede">
            StudioSpace keeps the details in one place, from the first search to the host’s decision.
          </p>
        </div>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-card border border-border bg-card p-5">
              <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground font-heading font-semibold">
                {index + 1}
              </span>
              <step.icon aria-hidden className="mt-5 size-5 text-primary" />
              <h2 className="mt-3 text-h3">{step.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="border-y border-border bg-card/50">
        <div className="container-page section grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2>Know the number before you book</h2>
            <p className="measure mt-4 text-muted-foreground">
              Studio listings show the hourly rate and refundable deposit separately. The booking estimate updates with your selected hours; the server confirms the final amount.
            </p>
          </div>
          <div className="rounded-card border border-border bg-card p-6">
            <h3 className="text-h3">Your booking estimate includes</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {["Selected hours × hourly rate", "Refundable security deposit", "A clear total before you submit"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-positive" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="container-page section flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2>Ready to find your room?</h2>
          <p className="mt-2 text-muted-foreground">Browse spaces built for the work you want to make.</p>
        </div>
        <ButtonLink href="/studios">Explore studios</ButtonLink>
      </section>
    </main>
  );
}
