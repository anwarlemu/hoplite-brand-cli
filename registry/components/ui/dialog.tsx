"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react/ssr";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";
import { Button } from "@/components/ui/button";

// A dialog as the site would draw one from its popups: a square panel of the ground, 512px wide with 24px of air, a
// quiet hairline and a deep soft cast (shadow-dialog), centered over the ink at 32 percent. The title is Chakra Petch
// light at 20px in the ink, the description 14px graphite under it; the actions are hexagon keys at the end of the
// footer, the main one in ink. The close key is a compact ghost hexagon with a 16px X in the top right corner. It opens
// in place from 0.96 with a fade in 200ms on the strong ease-out and leaves in 120ms; with reduced motion it only fades.
const OVERLAY =
  "fixed inset-0 z-50 bg-scrim transition-opacity duration-moderate ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-fast motion-reduce:transition-none";

const POPUP =
  "relative flex w-full max-w-lg flex-col gap-6 bg-surface p-6 text-fg shadow-dialog outline-none transition-[opacity,scale] duration-moderate ease-out data-starting-style:scale-96 data-starting-style:opacity-0 data-ending-style:scale-96 data-ending-style:opacity-0 data-ending-style:duration-fast motion-reduce:transition-opacity";

/** A trigger renders a native button unless its `render` (or asChild child) is another tag. */
function isNativeButton(render: unknown) {
  return !React.isValidElement(render) || typeof render.type !== "string" || render.type === "button";
}

type DialogProps = Omit<React.ComponentProps<typeof BaseDialog.Root>, "onOpenChange"> & { onOpenChange?: (open: boolean) => void };

function Dialog({ onOpenChange, ...props }: DialogProps) {
  return <BaseDialog.Root data-slot="dialog" onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined} {...props} />;
}

function DialogTrigger({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseDialog.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseDialog.Trigger data-slot="dialog-trigger" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseDialog.Trigger>
  );
}

function DialogPortal(props: React.ComponentProps<typeof BaseDialog.Portal>) {
  const container = usePortalContainer();
  return <BaseDialog.Portal data-slot="dialog-portal" container={container} {...props} />;
}

function DialogClose({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseDialog.Close> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseDialog.Close data-slot="dialog-close" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseDialog.Close>
  );
}

function DialogOverlay({ className, ...props }: Omit<React.ComponentProps<typeof BaseDialog.Backdrop>, "className"> & { className?: string }) {
  return <BaseDialog.Backdrop data-slot="dialog-overlay" className={cn(OVERLAY, className)} {...props} />;
}

type DialogContentProps = Omit<React.ComponentProps<typeof BaseDialog.Popup>, "className"> & { className?: string; showClose?: boolean; showCloseButton?: boolean };

function DialogContent({ className, children, showClose, showCloseButton, ...props }: DialogContentProps) {
  const close = showClose ?? showCloseButton ?? true;
  return (
    <DialogPortal>
      <DialogOverlay />
      <BaseDialog.Viewport data-slot="dialog-viewport" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 fade-y sm:p-6">
        <BaseDialog.Popup data-slot="dialog-content" className={cn(POPUP, className)} {...props}>
          {children}
          {close && (
            <BaseDialog.Close data-slot="dialog-close" render={<Button variant="ghost" size="icon-sm" />} className="absolute top-4 right-4" aria-label="Close">
              <XIcon />
            </BaseDialog.Close>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 pr-10", className)} {...props} />;
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("flex min-w-0 flex-col gap-4 text-body-sm leading-line-body-sm text-fg-secondary", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end", className)} {...props} />;
}

function DialogTitle({ className, ...props }: Omit<React.ComponentProps<typeof BaseDialog.Title>, "className"> & { className?: string }) {
  return <BaseDialog.Title data-slot="dialog-title" className={cn("font-display text-h5 leading-title font-light text-balance text-fg", className)} {...props} />;
}

function DialogDescription({ className, ...props }: Omit<React.ComponentProps<typeof BaseDialog.Description>, "className"> & { className?: string }) {
  return <BaseDialog.Description data-slot="dialog-description" className={cn("text-body-sm leading-line-body-sm text-pretty text-fg-secondary", className)} {...props} />;
}

export { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
