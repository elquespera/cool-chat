"use client";

import { PropsWithChildren, ReactNode, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IconButton } from "./icon-button";
import { Spinner } from "./spinner";

type ConfirmDialogProps = {
  title?: ReactNode;
  description?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => Promise<boolean | void>;
} & PropsWithChildren;

export default function ConfirmDialog({
  children,
  title = "Are you sure you want to perform this action?",
  description = "This action cannot be undone. Are you sure you want to continue?",
  onSuccess,
  onOpenChange,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (pending) return;
    setOpen(open);
    if (onOpenChange) onOpenChange(open);
  };

  const handleConfirmClick = async () => {
    setPending(true);
    try {
      const result = onSuccess ? await onSuccess() : true;
      if (result !== false) {
        setOpen(false);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={pending}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <IconButton
            disabled={pending}
            icon={pending && <Spinner className="mr-auto text-lg" />}
            onClick={handleConfirmClick}
          >
            Continue
          </IconButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
