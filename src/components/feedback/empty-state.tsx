import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-card border border-dashed border-border bg-card/60 px-6 py-10 text-center">
      <Icon aria-hidden className="size-8 text-muted-foreground" />
      <h2 className="mt-4 text-h3">{title}</h2>
      <p className="measure-tight mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      {actionHref ? (
        <Button nativeButton={false} render={<Link href={actionHref} />} className="mt-5">
          {actionLabel}
        </Button>
      ) : (
        <Button type="button" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
