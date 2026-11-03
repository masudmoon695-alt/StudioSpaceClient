"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookingsApi, getErrorMessage } from "@/lib/api";
import { redirectIfUnauthorized } from "@/lib/api-errors";
import type { StudioRecord } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

function localDateValue() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function BookingDialog({
  studio,
  callbackPath,
}: {
  studio: StudioRecord;
  callbackPath: string;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const hours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    return minutes > 0 ? minutes / 60 : 0;
  }, [startTime, endTime]);
  const subtotal = hours * studio.hourlyRate;
  const deposit = studio.securityDeposit;

  function openBooking() {
    if (isPending) return;
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
      return;
    }
    setError("");
    setOpen(true);
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
      return;
    }
    if (!date || date < localDateValue()) {
      const message = "Choose today or a future date.";
      setError(message);
      toast.error(message);
      return;
    }
    if (!startTime || !endTime) {
      const message = "Choose a start time and an end time.";
      setError(message);
      toast.error(message);
      return;
    }
    const startAt = new Date(`${date}T${startTime}:00`).toISOString();
    const endAt = new Date(`${date}T${endTime}:00`).toISOString();

    if (Date.parse(endAt) <= Date.parse(startAt)) {
      const message = "Choose an end time after your start time.";
      setError(message);
      toast.error(message);
      return;
    }

    if (Date.parse(startAt) <= Date.now()) {
      const message = "Choose a start time in the future.";
      setError(message);
      toast.error(message);
      return;
    }

    if (hours < 1) {
      const message = "Choose a time range of at least one hour.";
      setError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await bookingsApi.create({
        studioId: studio._id,
        startAt,
        endAt,
      });
      toast.success("Booking request sent.", {
        description: "The host will review your request.",
        action: {
          label: "My bookings",
          onClick: () => router.push("/my-bookings"),
        },
      });
      setOpen(false);
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, callbackPath)) return;
      const message = getErrorMessage(
        caught,
        "The booking request couldn't be sent. Check your connection and try again.",
      );
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button type="button" className="min-h-12 w-full" onClick={openBooking} disabled={isPending}>
        <CalendarDays aria-hidden />
        Book workspace now
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request time at {studio.title}</DialogTitle>
            <DialogDescription>
              Pick a date and time. The server confirms availability and the final amount.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitBooking} className="space-y-4">
            {error ? (
              <p role="alert" className="rounded-control border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input id="booking-date" type="date" min={localDateValue()} value={date} onChange={(event) => setDate(event.target.value)} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booking-start">Start time</Label>
                <Input id="booking-start" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-end">End time</Label>
                <Input id="booking-end" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required />
              </div>
            </div>
            <section aria-label="Price estimate" className="space-y-2 rounded-card border border-border bg-muted/50 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{hours ? `${hours} hours × $${studio.hourlyRate} / hr` : "Hourly studio rate"}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Refundable security deposit</span>
                <span>${deposit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-2 font-semibold">
                <span>Estimated total</span>
                <span>${(subtotal + deposit).toFixed(2)}</span>
              </div>
            </section>
            <p className="text-xs text-muted-foreground">
              The host reviews your request. The final price is calculated by the server.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
                Keep browsing
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 aria-hidden className="animate-spin" /> : null}
                {submitting ? "Sending request…" : "Send booking request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
