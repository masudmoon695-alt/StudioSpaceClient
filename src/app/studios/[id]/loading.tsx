import { PageSkeleton } from "@/components/feedback/page-skeleton";

export default function StudioDetailsLoading() {
  return <PageSkeleton label="Loading studio and booking details" cards={2} />;
}
