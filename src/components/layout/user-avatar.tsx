"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { initialsFromName } from "@/lib/user";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
}

/**
 * User-supplied avatar URLs can point anywhere, so this uses a plain img and
 * falls back to initials when the image fails.
 */
export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(image) && failedImage !== image;

  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-9 shrink-0 overflow-hidden rounded-full bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image as string}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedImage(image ?? null)}
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center text-xs font-semibold tracking-wide">
          {initialsFromName(name)}
        </span>
      )}
    </span>
  );
}
