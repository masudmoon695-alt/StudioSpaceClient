import { PageSkeleton } from "@/components/feedback/page-skeleton";

export default function DashboardLoading() {
  return <PageSkeleton label="Loading your dashboard" cards={3} />;
}
