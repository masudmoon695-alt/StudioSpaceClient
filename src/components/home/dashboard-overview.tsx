"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, CalendarDays, Check, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { PrivateRoute } from "@/components/auth/private-route";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { ButtonLink } from "@/components/button-link";
import { Button } from "@/components/ui/button";
import { bookingsApi, getErrorMessage, studiosApi } from "@/lib/api";
import { redirectIfUnauthorized } from "@/lib/api-errors";
import type { BookingRecord } from "@/lib/api";
import type { StudioRecord } from "@/lib/api";

function formatBookingSchedule(booking: BookingRecord): string {
  if (booking.startAt && booking.endAt) {
    const start = new Date(booking.startAt);
    const end = new Date(booking.endAt);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const datePart = start.toLocaleDateString(undefined, { dateStyle: "long" });
      const startPart = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      const endPart = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      return `${datePart} · ${startPart}–${endPart}`;
    }
  }
  if (booking.date) {
    const dateObj = new Date(`${booking.date}T00:00:00`);
    const datePart = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString(undefined, { dateStyle: "long" })
      : booking.date;
    const timePart = [booking.startTime, booking.endTime].filter(Boolean).join("–");
    return timePart ? `${datePart} · ${timePart}` : datePart;
  }
  return "";
}

function DashboardContent() {
  const router = useRouter();
  const [studios, setStudios] = useState<StudioRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [hostBookings, setHostBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      const [studioResult, bookingResult, hostResult] = await Promise.all([
        studiosApi.mine(),
        bookingsApi.mine(),
        bookingsApi.host(),
      ]);
      setStudios(studioResult.studios ?? []);
      setBookings(bookingResult.bookings ?? []);
      setHostBookings(hostResult.bookings ?? []);
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, "/dashboard")) return;
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      studiosApi.mine(),
      bookingsApi.mine(),
      bookingsApi.host(),
    ])
      .then(([studioResult, bookingResult, hostResult]) => {
        if (!active) return;
        setStudios(studioResult.studios ?? []);
        setBookings(bookingResult.bookings ?? []);
        setHostBookings(hostResult.bookings ?? []);
      })
      .catch(async (caught: unknown) => {
        if (await redirectIfUnauthorized(caught, router, "/dashboard")) return;
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  function retryDashboard() {
    setLoading(true);
    setError(false);
    void loadDashboard();
  }

  async function updateBooking(booking: BookingRecord, status: "Confirmed" | "Cancelled") {
    setUpdating(booking._id);
    try {
      await bookingsApi.updateStatus(booking._id, { status });
      setHostBookings((current) =>
        current.map((item) => item._id === booking._id ? { ...item, status } : item),
      );
      toast.success(status === "Confirmed" ? "Booking confirmed." : "Booking request declined.");
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, "/dashboard")) return;
      toast.error(
        getErrorMessage(
          caught,
          "The booking status couldn't be updated. Try again.",
        ),
      );
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <PageSkeleton label="Loading your dashboard" cards={3} />;
  if (error) {
    return <ErrorState message="Your production desk couldn't load. Try again." onRetry={retryDashboard} />;
  }

  const pendingRequests = hostBookings.filter((booking) => booking.status === "Pending");
  const stats = [
    { title: "My listings", value: studios.length, description: "Spaces you host", icon: Building2, href: "/my-listings" },
    { title: "My bookings", value: bookings.length, description: "Requests and reservations", icon: CalendarDays, href: "/my-bookings" },
    { title: "Incoming requests", value: pendingRequests.length, description: "Pending on your studios", icon: Plus, href: "#incoming-requests" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">Your production desk</h1>
          <p className="mt-3 text-muted-foreground">Keep your spaces and studio time on one call sheet.</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/add-studio"><Plus aria-hidden /> List a studio</ButtonLink>
          <ButtonLink href="/studios" variant="outline">Explore studios</ButtonLink>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="rounded-card border border-border bg-card p-5 transition-colors hover:bg-muted">
            <div className="flex items-center justify-between gap-4">
              <span className="grid size-10 place-items-center rounded-control bg-accent text-primary"><stat.icon aria-hidden className="size-5" /></span>
              <span className="font-heading text-3xl font-semibold">{stat.value}</span>
            </div>
            <h2 className="mt-4 text-h3">{stat.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
          </Link>
        ))}
      </div>

      <section id="incoming-requests" className="mt-12 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2>Incoming booking requests</h2>
            <p className="mt-2 text-muted-foreground">Confirm or decline requests for the spaces you host.</p>
          </div>
          <ButtonLink href="/my-listings" variant="outline">Manage listings</ButtonLink>
        </div>
        {pendingRequests.length ? (
          <div className="mt-5 grid gap-4">
            {pendingRequests.map((booking) => (
              <article key={booking._id} className="flex flex-col gap-4 rounded-card border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-h3">{booking.studioTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{booking.userEmail}</p>
                  <p className="mt-1 text-sm">{formatBookingSchedule(booking)}</p>
                  <p className="mt-2 font-heading font-semibold">${booking.totalPrice.toFixed(2)} total</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={() => void updateBooking(booking, "Confirmed")} disabled={updating === booking._id}>
                    {updating === booking._id ? <Loader2 aria-hidden className="animate-spin" /> : <Check aria-hidden />}
                    Confirm
                  </Button>
                  <Button type="button" variant="outline" onClick={() => void updateBooking(booking, "Cancelled")} disabled={updating === booking._id}>
                    <X aria-hidden /> Decline
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-card border border-dashed border-border bg-card/60 p-6">
            <p className="font-medium">No requests need your decision</p>
            <p className="mt-1 text-sm text-muted-foreground">New booking requests for your spaces will appear here.</p>
          </div>
        )}
      </section>
    </>
  );
}

export function DashboardOverview() {
  return (
    <PrivateRoute>
      <main id="main" className="container-page section">
        <DashboardContent />
      </main>
    </PrivateRoute>
  );
}
