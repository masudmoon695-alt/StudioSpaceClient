import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { StudioDetail } from "@/components/studios/studio-detail";
import { ApiError, reviewsApi, studiosApi } from "@/lib/api";
import type { ReviewRecord, StudioRecord } from "@/lib/api";

export const metadata: Metadata = {
  title: "Studio details",
  description: "See the room, host, amenities, rates and booking details for this creative studio.",
};

export default async function StudioDetailsPage({
  params,
}: PageProps<"/studios/[id]">) {
  const { id } = await params;
  if (!/^[\da-f]{24}$/i.test(id)) notFound();

  let studio: StudioRecord | undefined;
  try {
    studio = (await studiosApi.byId(id)).studio;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <main id="main" className="container-page section">
        <ErrorState message="This studio couldn't be loaded. Check your connection and try again." />
      </main>
    );
  }
  if (!studio) notFound();

  let reviews: ReviewRecord[] = [];
  let reviewsError = false;
  try {
    const result = await reviewsApi.forStudio(id);
    reviews = result.reviews ?? [];
  } catch {
    reviewsError = true;
  }

  return (
    <StudioDetail
      studio={studio}
      reviews={reviews}
      reviewsError={reviewsError}
    />
  );
}
