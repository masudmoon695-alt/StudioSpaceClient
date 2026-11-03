import type { Metadata } from "next";

import { StudioForm } from "@/components/studios/studio-form";

export const metadata: Metadata = {
  title: "Edit studio",
  description: "Update the details on your StudioSpace listing.",
};

export default async function EditStudioPage({
  params,
}: PageProps<"/studios/edit/[id]">) {
  const { id } = await params;
  return <StudioForm studioId={id} />;
}
