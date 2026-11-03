import type { Metadata } from "next";

import { StudioForm } from "@/components/studios/studio-form";

export const metadata: Metadata = {
  title: "List a studio",
  description: "Share your creative space and manage booking requests on StudioSpace.",
};

export default function AddStudioPage() {
  return <StudioForm />;
}
