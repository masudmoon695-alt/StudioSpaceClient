import Link from "next/link";
import { cacheLife } from "next/cache";
import {
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { CATEGORIES, NAV_LINKS } from "@/lib/constants";

async function getCopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const SOCIALS = [
  { label: "StudioSpace on X", href: "https://x.com/studiospace", Icon: FaXTwitter },
  { label: "StudioSpace on Instagram", href: "https://instagram.com/studiospace", Icon: FaInstagram },
  { label: "StudioSpace on YouTube", href: "https://youtube.com/@studiospace", Icon: FaYoutube },
  { label: "StudioSpace on LinkedIn", href: "https://linkedin.com/company/studiospace", Icon: FaLinkedin },
];

export async function Footer() {
  const year = await getCopyrightYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr] lg:gap-10">
          <div>
            <Logo />
            <p className="measure-tight mt-4 text-sm text-muted-foreground">
              StudioSpace is a booking marketplace for the rooms creators need,
              with the rate and the deposit shown before you commit.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-control border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon aria-hidden className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base">Explore</h3>
            <ul className="mt-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-9 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base">Categories</h3>
            <ul className="mt-4 space-y-1">
              {CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category.value)}`}
                    className="flex min-h-9 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {category.plural}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base">The call sheet</h3>
            <p className="measure-tight mt-3 text-sm text-muted-foreground">
              One email a month with new spaces, host notes and open studio
              days. No filler.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-1 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} StudioSpace. All rights reserved.</p>
          <p className="measure-tight">
            Every booking is subject to the host&rsquo;s house rules and the
            StudioSpace terms of service.
          </p>
        </div>
      </div>
    </footer>
  );
}
