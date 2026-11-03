import { CheckCircle2 } from "lucide-react";

import { SITE } from "@/lib/constants";

const POINTS = [
  "See the hourly rate and the refundable deposit before you book.",
  "Keep pending requests and confirmed bookings on one page.",
  "List a space and approve requests when it suits you.",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main"
      className="container-page grid flex-1 gap-10 py-12 lg:grid-cols-[1.05fr_minmax(0,430px)] lg:items-center lg:gap-16 lg:py-20"
    >
      <section aria-labelledby="auth-heading" className="max-w-xl">
        <h1 id="auth-heading" className="text-h1">
          Your next shoot starts with the right room.
        </h1>
        <p className="measure mt-5 text-lede">
          {SITE.name} is the booking desk for creative space. Sign in to reserve
          studio time, track every request, and manage the rooms you host.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          {POINTS.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span className="measure">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label="Account form"
        className="w-full rounded-card border border-border bg-card p-5 shadow-[0_1px_0_0_var(--border)] sm:p-7"
      >
        {children}
      </section>
    </main>
  );
}
