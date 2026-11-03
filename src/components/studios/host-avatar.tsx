"use client";

import { useState } from "react";

import { initialsFromName } from "@/lib/user";

export function HostAvatar({
  name,
  photo,
}: {
  name: string;
  photo?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-accent font-semibold text-accent-foreground"
    >
      {photo && !imageFailed ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo}
          alt=""
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initialsFromName(name)
      )}
    </span>
  );
}
