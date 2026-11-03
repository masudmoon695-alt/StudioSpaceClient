import type { Metadata } from "next";

import { MyBookings } from "@/components/studios/my-bookings";

export const metadata: Metadata = {
  title: "My bookings",
  description: "Review your creative studio booking requests and reservations.",
};

export default function MyBookingsPage() {
  return <MyBookings />;
}
