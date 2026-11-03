import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ExpressSessionSync } from "@/components/auth/express-session-sync";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "wdth"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace — book creative spaces by the hour",
    template: "%s · StudioSpace",
  },
  description:
    "Rent photography cyc walls, film stages, podcast lounges, music suites and art workshops by the hour. See availability, the price and the deposit before you book.",
  applicationName: "StudioSpace",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF1F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1222" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-background font-sans text-foreground"
      >
        <a
          href="#main"
          className="sr-only rounded-control bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <TooltipProvider delay={150}>
            <ExpressSessionSync />
            <Suspense
              fallback={
                <header className="sticky top-0 z-50 border-b border-border bg-background">
                  <div className="container-page flex h-16 items-center justify-between">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="size-10" />
                  </div>
                </header>
              }
            >
              <Navbar />
            </Suspense>
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
            <Toaster
              position="top-center"
              offset={80}
              className="toaster group [&_[data-sonner-toast]]:max-w-[calc(100vw-2rem)]"
              closeButton
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
