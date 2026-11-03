import Link from "next/link";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

export interface ButtonLinkProps
  extends Omit<ButtonProps, "render" | "nativeButton"> {
  href: string;
}

/**
 * The one primary/secondary button style, used for navigation so a link keeps
 * its anchor semantics while wearing the same shape as every other button.
 */
export function ButtonLink({ href, ...props }: ButtonLinkProps) {
  return (
    <Button nativeButton={false} render={<Link href={href} />} {...props} />
  );
}
