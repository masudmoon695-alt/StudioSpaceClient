import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="container-page flex flex-1 flex-col items-center justify-center py-16 text-center">
      <svg
        aria-labelledby="empty-studio-title"
        role="img"
        viewBox="0 0 360 230"
        className="mb-8 w-full max-w-sm text-muted-foreground"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="empty-studio-title">A quiet studio with a light stand and a bare cyc wall</title>
        <path d="M25 190H335M55 190V42H305V190" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M55 154C105 154 124 185 180 185C236 185 255 154 305 154" stroke="currentColor" strokeWidth="3" />
        <path d="M121 190L157 95M160 190L157 95M144 146H166M145 117H169" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M141 91L157 78L176 92L171 106H146L141 91Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M152 79L135 49M163 79L185 50" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6" />
      </svg>
      <p className="font-heading text-sm font-semibold text-primary">404 · Set not found</p>
      <h1 className="mt-3 text-h1">This room isn’t on the call sheet.</h1>
      <p className="measure mt-4 text-muted-foreground">
        That page may have moved or the link may be out of date. Head back to the production desk and find another space.
      </p>
      <Button nativeButton={false} render={<Link href="/" />} className="mt-7 min-h-11">
        Return to Home
      </Button>
    </main>
  );
}
