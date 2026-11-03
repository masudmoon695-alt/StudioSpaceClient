import { PageSkeleton } from "@/components/feedback/page-skeleton";

export default function MyBookingsLoading() {
  return <PageSkeleton label="Loading your bookings" cards={4} />;
}
