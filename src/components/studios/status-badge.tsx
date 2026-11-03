import type { BookingStatus } from "@/lib/api";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: "bg-tungsten/20 text-foreground",
  Confirmed: "bg-daylight/15 text-foreground",
  Completed: "bg-positive/15 text-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
