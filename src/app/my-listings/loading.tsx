import { PageSkeleton } from "@/components/feedback/page-skeleton";

export default function MyListingsLoading() {
  return <PageSkeleton label="Loading your studio listings" cards={3} />;
}
