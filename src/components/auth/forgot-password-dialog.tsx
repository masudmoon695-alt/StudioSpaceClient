"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";

export function ForgotPasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger className="rounded-control text-sm font-medium text-daylight underline-offset-4 hover:underline">
        Forgot password?
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Password reset isn&apos;t available</DialogTitle>
          <DialogDescription>
            This version of StudioSpace doesn&apos;t send password reset
            emails. If you&apos;re locked out of an account you need, contact the
            person who runs the studio and ask them to re-send your booking
            confirmation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
