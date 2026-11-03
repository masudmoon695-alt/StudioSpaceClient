"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PrivateRoute } from "@/components/auth/private-route";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { bookingsApi, getErrorMessage } from "@/lib/api";
import { redirectIfUnauthorized } from "@/lib/api-errors";
import type { BookingRecord } from "@/lib/api";
import { StatusBadge } from "@/components/studios/status-badge";

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

function BookingsContent() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<BookingRecord | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function loadBookings() {
    try {
      const result = await bookingsApi.mine();
      setBookings(result.bookings ?? []);
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, "/my-bookings")) return;
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    bookingsApi
      .mine()
      .then((result) => {
        if (active) setBookings(result.bookings ?? []);
      })
      .catch(async (caught: unknown) => {
        if (await redirectIfUnauthorized(caught, router, "/my-bookings")) return;
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  function retryBookings() {
    setLoading(true);
    setLoadError(false);
    void loadBookings();
  }

  async function cancelBooking() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await bookingsApi.cancel(cancelTarget._id);
      setBookings((current) =>
        current.map((booking) =>
          booking._id === cancelTarget._id ? { ...booking, status: "Cancelled" } : booking,
        ),
      );
      toast.success("Booking cancelled.");
      setCancelTarget(null);
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, "/my-bookings")) return;
      toast.error(
        getErrorMessage(
          caught,
          "The booking couldn't be cancelled. Try again.",
        ),
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-h1">My bookings</h1>
        <p className="mt-3 text-muted-foreground">Track your studio requests and confirmed production time.</p>
      </div>
      {loading ? (
        <PageSkeleton label="Loading your bookings" cards={4} />
      ) : loadError ? (
        <ErrorState message="Your bookings couldn't be loaded. Try again." onRetry={retryBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings on your call sheet"
          description="When you request time at a studio, the date, total and host response appear here."
          actionLabel="Explore studios"
          actionHref="/studios"
        />
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article key={booking._id} className="grid gap-4 rounded-card border border-border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-h3">{booking.studioTitle}</h2>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {formatBookingSchedule(booking)}
                </p>
                <p className="mt-2 font-heading font-semibold">${booking.totalPrice.toFixed(2)} total</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {booking.status === "Pending" ? (
                  <Button type="button" variant="outline" onClick={() => setCancelTarget(booking)}>Cancel booking</Button>
                ) : null}
                {booking.status === "Confirmed" ? (
                  <span className="flex min-h-11 items-center text-sm text-muted-foreground">Invoice download isn’t available in this version.</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
      <AlertDialog open={Boolean(cancelTarget)} onOpenChange={(open) => { if (!open && !cancelling) setCancelTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking request?</AlertDialogTitle>
            <AlertDialogDescription>
              Cancel your pending request for {cancelTarget?.studioTitle}. The host will no longer need to review it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep request</AlertDialogCancel>
            <AlertDialogAction onClick={(event) => { event.preventDefault(); void cancelBooking(); }} disabled={cancelling} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {cancelling ? <Loader2 aria-hidden className="animate-spin" /> : null}
              Cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MyBookings() {
  return (
    <PrivateRoute>
      <main id="main" className="container-page section">
        <BookingsContent />
      </main>
    </PrivateRoute>
  );
}
