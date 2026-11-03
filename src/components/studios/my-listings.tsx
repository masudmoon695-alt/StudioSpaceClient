"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PrivateRoute } from "@/components/auth/private-route";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { ButtonLink } from "@/components/button-link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getErrorMessage, ApiError, studiosApi } from "@/lib/api";
import { redirectIfUnauthorized } from "@/lib/api-errors";
import type { StudioRecord } from "@/lib/api";

function ListingsContent() {
  const router = useRouter();
  const [studios, setStudios] = useState<StudioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StudioRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadStudios() {
    try {
      const result = await studiosApi.mine();
      setStudios(result.studios ?? []);
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, "/my-listings")) return;
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    studiosApi
      .mine()
      .then((result) => {
        if (active) setStudios(result.studios ?? []);
      })
      .catch(async (caught: unknown) => {
        if (await redirectIfUnauthorized(caught, router, "/my-listings")) return;
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  function retryStudios() {
    setLoading(true);
    setLoadError(false);
    void loadStudios();
  }

  async function deleteStudio() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studiosApi.remove(deleteTarget._id);
      setStudios((current) => current.filter((studio) => studio._id !== deleteTarget._id));
      toast.success("Studio deleted.");
      setDeleteTarget(null);
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, "/my-listings")) return;
      const message =
        caught instanceof ApiError
          ? caught.status === 403
            ? "You can't change this studio."
            : getErrorMessage(caught)
          : getErrorMessage(caught, "The studio couldn't be deleted. Try again.");
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">My studio listings</h1>
          <p className="mt-3 text-muted-foreground">Keep your spaces accurate and ready for the next booking request.</p>
        </div>
        <ButtonLink href="/add-studio"><Plus aria-hidden /> Add a studio</ButtonLink>
      </div>
      {loading ? (
        <PageSkeleton label="Loading your studios" cards={3} />
      ) : loadError ? (
        <ErrorState message="Your studio listings couldn't be loaded. Try again." onRetry={retryStudios} />
      ) : studios.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="You have no studio listings"
          description="Add your first space to share its rates, amenities and booking details with creators."
          actionLabel="List a studio"
          actionHref="/add-studio"
        />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {studios.map((studio) => (
              <article key={studio._id} className="overflow-hidden rounded-card border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={studio.image} alt={`${studio.title} studio`} className="aspect-4/3 w-full object-cover" />
                <div className="p-4">
                  <h2 className="text-h3">{studio.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{studio.category} · {studio.location}</p>
                  <p className="mt-3 font-heading font-semibold">${studio.hourlyRate} / hr</p>
                  <div className="mt-4 flex gap-2">
                    <ButtonLink href={`/studios/edit/${encodeURIComponent(studio._id)}`} variant="outline" className="flex-1"><Pencil aria-hidden /> Update</ButtonLink>
                    <Button type="button" variant="destructive" onClick={() => setDeleteTarget(studio)}><Trash2 aria-hidden /> Delete</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-card border border-border bg-card md:block">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th scope="col" className="p-4 font-medium">Studio</th>
                  <th scope="col" className="p-4 font-medium">Category</th>
                  <th scope="col" className="p-4 font-medium">Rate</th>
                  <th scope="col" className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {studios.map((studio) => (
                  <tr key={studio._id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={studio.image} alt="" className="size-16 rounded-control object-cover" />
                        <div>
                          <p className="font-medium">{studio.title}</p>
                          <p className="text-muted-foreground">{studio.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{studio.category}</td>
                    <td className="p-4">${studio.hourlyRate} / hr</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <ButtonLink href={`/studios/edit/${encodeURIComponent(studio._id)}`} variant="outline" size="sm"><Pencil aria-hidden /> Update</ButtonLink>
                        <Button type="button" variant="destructive" size="sm" onClick={() => setDeleteTarget(studio)}><Trash2 aria-hidden /> Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open && !deleting) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.title}?</AlertDialogTitle>
            <AlertDialogDescription>
              This also removes its pending booking requests. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep studio</AlertDialogCancel>
            <AlertDialogAction onClick={(event) => { event.preventDefault(); void deleteStudio(); }} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? <Loader2 aria-hidden className="animate-spin" /> : <Trash2 aria-hidden />}
              Delete studio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MyListings() {
  return (
    <PrivateRoute>
      <main id="main" className="container-page section">
        <ListingsContent />
      </main>
    </PrivateRoute>
  );
}
