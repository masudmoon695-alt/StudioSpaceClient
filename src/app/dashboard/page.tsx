import type { Metadata } from "next";
import { DashboardOverview } from "@/components/home/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your StudioSpace listings, bookings and incoming requests in one place.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
