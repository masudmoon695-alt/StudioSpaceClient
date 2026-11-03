import { PageSkeleton } from "@/components/feedback/page-skeleton";

export default function StudiosLoading() {
  return <PageSkeleton label="Loading available studios" cards={6} />;
}
