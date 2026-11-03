"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage, reviewsApi } from "@/lib/api";
import type { ReviewRecord } from "@/lib/api";
import { redirectIfUnauthorized } from "@/lib/api-errors";

export function StudioReviews({
  studioId,
  initialReviews,
  reviewsError,
}: {
  studioId: string;
  initialReviews: ReviewRecord[];
  reviewsError: boolean;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(`/studios/${studioId}`)}`,
      );
      return;
    }

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setSubmitError("Write a few words about your studio experience.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await reviewsApi.create({
        studioId,
        rating,
        comment: trimmedComment,
      });
      setReviews((current) => [
        result.review,
        ...current.filter((review) => review._id !== result.review._id),
      ]);
      setComment("");
      setRating(5);
      toast.success("Review submitted.");
    } catch (caught) {
      if (
        await redirectIfUnauthorized(
          caught,
          router,
          `/studios/${studioId}`,
        )
      ) {
        return;
      }
      const message = getErrorMessage(
        caught,
        "Your review couldn't be submitted. Try again.",
      );
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8" aria-labelledby="guest-reviews-heading">
      <h2 id="guest-reviews-heading">Guest reviews</h2>
      <div className="mt-4 rounded-card border border-border bg-card p-5">
        <h3 className="text-h3">Write a review</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Share what worked well for your time in this studio.
        </p>
        {isPending ? (
          <div
            className="mt-4 h-11 animate-pulse rounded-control bg-muted"
            role="status"
          >
            <span className="sr-only">Checking your sign-in status</span>
          </div>
        ) : session ? (
          <form onSubmit={submitReview} className="mt-4 space-y-4">
            <div className="space-y-2">
              <p id={`review-rating-label-${studioId}`} className="text-sm font-medium">
                Rating
              </p>
              <div
                className="flex items-center gap-1"
                role="group"
                aria-labelledby={`review-rating-label-${studioId}`}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="grid size-11 place-items-center rounded-control text-tungsten outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                    disabled={submitting}
                  >
                    <Star
                      aria-hidden
                      className={`size-5 ${value <= rating ? "fill-current" : ""}`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} out of 5
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`review-comment-${studioId}`}>Your review</Label>
              <Textarea
                id={`review-comment-${studioId}`}
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  if (submitError) setSubmitError("");
                }}
                placeholder="What was the space like for your project?"
                maxLength={1000}
                required
                aria-invalid={Boolean(submitError)}
                aria-describedby={`review-count-${studioId}${submitError ? ` review-error-${studioId}` : ""}`}
                disabled={submitting}
              />
              <p
                id={`review-count-${studioId}`}
                className="text-right text-xs text-muted-foreground"
              >
                {comment.length}/1000
              </p>
            </div>
            {submitError ? (
              <p
                id={`review-error-${studioId}`}
                role="alert"
                className="rounded-control border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {submitError}
              </p>
            ) : null}
            <Button type="submit" disabled={submitting || !comment.trim()}>
              {submitting ? (
                <Loader2 aria-hidden className="animate-spin" />
              ) : null}
              {submitting ? "Submitting review…" : "Submit review"}
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-sm">
            <Link
              className="font-medium text-daylight underline-offset-4 hover:underline"
              href={`/login?callbackUrl=${encodeURIComponent(`/studios/${studioId}`)}`}
            >
              Sign in to write a review
            </Link>
          </p>
        )}
      </div>

      <div className="mt-4">
        {reviewsError ? (
          <ErrorState
            message="Reviews couldn't be loaded. Your review form is still available."
          />
        ) : reviews.length ? (
          <div className="grid gap-3">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-card border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{review.name}</p>
                  <span className="inline-flex items-center gap-1 text-sm">
                    <Star
                      aria-hidden
                      className="size-4 fill-tungsten text-tungsten"
                    />
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-border bg-card/60 p-5">
            <p className="text-sm text-muted-foreground">
              No reviews have been shared for this studio yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
