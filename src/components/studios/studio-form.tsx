"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PrivateRoute } from "@/components/auth/private-route";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/button-link";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, imgbbApi, studiosApi } from "@/lib/api";
import { redirectIfUnauthorized } from "@/lib/api-errors";
import type { StudioRecord } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CATEGORIES } from "@/lib/constants";
import { isHttpUrl } from "@/lib/validators";

interface StudioFormState {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  capacity: string;
  location: string;
  image: string;
  gallery: string;
  amenities: string[];
  overview: string;
}

const EMPTY_FORM: StudioFormState = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  capacity: "",
  location: "",
  image: "",
  gallery: "",
  amenities: [],
  overview: "",
};

function formFromStudio(studio: StudioRecord): StudioFormState {
  return {
    title: studio.title,
    category: studio.category,
    hourlyRate: String(studio.hourlyRate),
    securityDeposit: String(studio.securityDeposit),
    capacity: String(studio.capacity),
    location: studio.location,
    image: studio.image,
    gallery: (studio.gallery ?? []).join("\n"),
    amenities: studio.amenities ?? [],
    overview: studio.overview,
  };
}

function StudioFormContent({ studioId }: { studioId?: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [values, setValues] = useState(EMPTY_FORM);
  const [studio, setStudio] = useState<StudioRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(studioId));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (!studioId) return;
    let active = true;
    studiosApi
      .byId(studioId)
      .then(({ studio: loadedStudio }) => {
        if (!active) return;
        setStudio(loadedStudio);
        setValues(formFromStudio(loadedStudio));
      })
      .catch(async (caught: unknown) => {
        if (await redirectIfUnauthorized(caught, router, `/studios/edit/${studioId}`)) return;
        if (active) setError("This studio couldn't be loaded. Check the listing and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router, studioId]);

  function update<K extends keyof StudioFormState>(key: K, value: StudioFormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleAmenity(amenity: string, checked: boolean) {
    update(
      "amenities",
      checked
        ? [...values.amenities, amenity]
        : values.amenities.filter((item) => item !== amenity),
    );
  }

  async function uploadImage() {
    if (!selectedImage) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await imgbbApi.upload(selectedImage);
      update("image", url);
      toast.success("Image uploaded.");
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "The image couldn't be uploaded. Try again or paste an image URL.";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const gallery = values.gallery
      .split(/\r?\n/)
      .map((url) => url.trim())
      .filter(Boolean);
    if (!isHttpUrl(values.image.trim()) || gallery.some((url) => !isHttpUrl(url))) {
      const message = "Use a complete http:// or https:// URL for each studio image.";
      setError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    setError("");
    const payload = {
      title: values.title.trim(),
      category: values.category,
      hourlyRate: Number(values.hourlyRate),
      securityDeposit: Number(values.securityDeposit),
      capacity: Number(values.capacity),
      location: values.location.trim(),
      image: values.image.trim(),
      gallery,
      amenities: values.amenities,
      overview: values.overview.trim(),
      ownerName: session?.user?.name ?? "",
      ownerEmail: session?.user?.email ?? "",
      ownerPhoto: session?.user?.image ?? "",
    };

    try {
      if (studioId) {
        await studiosApi.update(studioId, payload);
        toast.success("Studio updated.");
      } else {
        await studiosApi.create(payload);
        toast.success("Studio published.");
      }
      router.replace("/my-listings");
      router.refresh();
    } catch (caught) {
      if (await redirectIfUnauthorized(caught, router, studioId ? `/studios/edit/${studioId}` : "/add-studio")) return;
      const message =
        caught instanceof ApiError
          ? caught.status === 403
            ? "You can't change this studio."
            : caught.message
          : "The studio couldn't be saved. Check your connection and try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageSkeleton label="Loading studio form" cards={2} />;
  if (error && studioId && !studio) {
    return <ErrorState message={error} />;
  }
  if (studio && session?.user?.id && studio.ownerId !== session.user.id && studio.ownerEmail !== session.user.email) {
    return (
      <div className="rounded-card border border-border bg-card p-6">
        <h2 className="text-h3">You can&apos;t edit this studio</h2>
        <p className="mt-2 text-muted-foreground">
          Only the host who published this listing can change it.
        </p>
        <ButtonLink href="/my-listings" variant="outline" className="mt-5">
          Back to my listings
        </ButtonLink>
      </div>
    );
  }

  const amenities = [
    "Natural light",
    "Blackout curtains",
    "Cyclorama wall",
    "Lighting equipment",
    "Audio recording gear",
    "Sound treatment",
    "Wi-Fi",
    "Parking",
    "Makeup station",
    "Kitchen access",
  ];

  return (
    <form onSubmit={submit} className="space-y-7">
      {error ? (
        <p role="alert" className="rounded-control border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      ) : null}
      <section className="grid gap-5 rounded-card border border-border bg-card p-5 sm:grid-cols-2 sm:p-6">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="studio-title">Title</Label>
          <Input id="studio-title" value={values.title} onChange={(event) => update("title", event.target.value)} minLength={3} maxLength={100} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-category">Category</Label>
          <select id="studio-category" value={values.category} onChange={(event) => update("category", event.target.value)} required className="h-11 w-full rounded-control border border-input bg-card px-3 text-sm">
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-location">Location / address</Label>
          <Input id="studio-location" value={values.location} onChange={(event) => update("location", event.target.value)} minLength={3} maxLength={160} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-rate">Hourly rate ($)</Label>
          <Input id="studio-rate" type="number" min="1" max="5000" step="1" inputMode="numeric" value={values.hourlyRate} onChange={(event) => update("hourlyRate", event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-deposit">Security deposit ($)</Label>
          <Input id="studio-deposit" type="number" min="0" max="50000" step="1" inputMode="numeric" value={values.securityDeposit} onChange={(event) => update("securityDeposit", event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-capacity">Maximum capacity</Label>
          <Input id="studio-capacity" type="number" min="1" max="500" inputMode="numeric" value={values.capacity} onChange={(event) => update("capacity", event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studio-image">Cover image URL</Label>
          <Input id="studio-image" type="url" inputMode="url" value={values.image} onChange={(event) => update("image", event.target.value)} required />
          <p className="text-xs text-muted-foreground">Paste a public image URL. The cover image uses a 4:3 crop.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="studio-image-upload">Choose an image to upload</Label>
              <Input id="studio-image-upload" type="file" accept="image/*" onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)} />
            </div>
            <Button type="button" onClick={() => void uploadImage()} disabled={!selectedImage || uploading} className="min-h-11">
              {uploading ? <Loader2 aria-hidden className="animate-spin" /> : null}
              {uploading ? "Uploading image" : "Upload image"}
            </Button>
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="studio-gallery">Additional gallery image URLs</Label>
          <Textarea id="studio-gallery" value={values.gallery} onChange={(event) => update("gallery", event.target.value)} rows={3} />
        </div>
        <fieldset className="space-y-3 sm:col-span-2">
          <legend className="text-sm font-medium">Amenities</legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => (
              <Label key={amenity} className="flex min-h-11 items-center gap-3 rounded-control border border-border px-3 py-2 font-normal">
                <Checkbox checked={values.amenities.includes(amenity)} onCheckedChange={(checked) => toggleAmenity(amenity, checked === true)} />
                {amenity}
              </Label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="studio-overview">Detailed overview</Label>
          <Textarea id="studio-overview" value={values.overview} onChange={(event) => update("overview", event.target.value)} minLength={30} maxLength={2000} rows={6} required />
          <p className="text-xs text-muted-foreground">Describe the room, equipment and house details creators should know.</p>
        </div>
      </section>

      <section className="rounded-card border border-border bg-muted/50 p-5 sm:p-6">
        <h2 className="text-h3">Host details</h2>
        <p className="mt-1 text-sm text-muted-foreground">These details come from your account and can’t be edited here.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="host-name">Host name</Label>
            <Input id="host-name" value={session?.user?.name ?? ""} readOnly aria-readonly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="host-email">Host email</Label>
            <Input id="host-email" type="email" value={session?.user?.email ?? ""} readOnly aria-readonly />
          </div>
        </div>
      </section>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" nativeButton={false} render={<Link href="/my-listings" />}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 aria-hidden className="animate-spin" /> : null}
          {submitting ? "Saving studio…" : studioId ? "Save changes" : "Publish studio"}
        </Button>
      </div>
    </form>
  );
}

export function StudioForm({ studioId }: { studioId?: string }) {
  return (
    <PrivateRoute>
      <main id="main" className="container-page section">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-h1">{studioId ? "Update your studio" : "List a studio"}</h1>
          <p className="mt-4 text-muted-foreground">
            {studioId
              ? "Keep the space details current so creators know what to expect."
              : "Give creators the practical details they need to book your space."}
          </p>
        </div>
        <StudioFormContent studioId={studioId} />
      </main>
    </PrivateRoute>
  );
}
