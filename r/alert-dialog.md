# Alert Dialog
The dialog's square ground panel for a decision that a click outside cannot dismiss: 448px (384px small) with a deep soft cast over the ink at 32 percent, a Chakra Petch light 20px title, a 14px graphite description, an outlined Cancel hexagon and the action as an ink hexagon, or orange when it destroys something. A dialog taller than the screen scrolls and fades at the screen edge it scrolls past (fade-y).

Install: npx hoplite-ds add alert-dialog
Requires: theme, utils, surface, button
Packages: @base-ui/react
Exports: AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger
Client boundary: yes
Reference: Extrapolated from the Hoplite website's popups and keys: the square ground panel (.hn__sheet), the hexagon keys (.button, .button--line), the orange as the mark of a destructive action from the brand principles.


## Usage
Use to confirm an action that cannot be undone or that loses work (Delete sandbox, Leave the team). Say what happens in the description, name the action in the key (Delete sandbox, not OK), and pass variant="destructive" to AlertDialogAction when it deletes. AlertDialogMedia adds a hexagon mark with a glyph above the title.
- Avoid: A confirmation for an action that can be undone
- Avoid: OK and Cancel as labels
- Avoid: Rounded corners
- Avoid: An orange panel or title
- Avoid: Closing on a click outside


## Examples
Example components: npx hoplite-ds add alert-dialog button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/alert-dialog/Preview) | [Open](https://hoplite-ds.vercel.app/preview/alert-dialog/Open) | [Small](https://hoplite-ds.vercel.app/preview/alert-dialog/Small)

examples/alert-dialog.tsx

```tsx
"use client";

import { WarningIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DeleteSandbox({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger render={<Button variant="outline" />}>Delete sandbox</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this sandbox?</AlertDialogTitle>
          <AlertDialogDescription>The acme-web sandbox and its uncommitted changes are removed. Threads that used it keep their history.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete sandbox</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function Preview() {
  return <DeleteSandbox />;
}

export function Open() {
  return (
    <div className="min-h-96">
      <DeleteSandbox defaultOpen />
    </div>
  );
}

export function Small() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>Leave the team</AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <WarningIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Leave Acme?</AlertDialogTitle>
          <AlertDialogDescription>You lose access to its threads, repositories and automations. Your seat goes back to the plan.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction>Leave team</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

```

## Source

components/ui/alert-dialog.tsx

```tsx
"use client";

import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";
import { Button } from "@/components/ui/button";

// The dialog's panel for a decision that cannot be dismissed by a click outside: a square panel of the ground, 448px
// wide (384px for `sm`) with 24px of air, a quiet hairline and a deep soft cast, centered over the ink at 32 percent.
// The title is Chakra Petch light at 20px, the description 14px graphite. The footer ends in two hexagon keys: Cancel
// outlined, the action in ink, or in the orange when it destroys something. An optional media mark above the title is
// a 40px point-up hexagon of the hover wash holding a 20px glyph. It opens in place from 0.96 with a fade in 200ms on
// the strong ease-out and leaves in 120ms; with reduced motion it only fades.
const OVERLAY =
  "fixed inset-0 z-50 bg-scrim transition-opacity duration-moderate ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-fast motion-reduce:transition-none";

const POPUP =
  "relative flex w-full max-w-md flex-col gap-6 bg-surface p-6 text-fg shadow-dialog outline-none transition-[opacity,scale] duration-moderate ease-out data-starting-style:scale-96 data-starting-style:opacity-0 data-ending-style:scale-96 data-ending-style:opacity-0 data-ending-style:duration-fast data-[size=sm]:max-w-sm motion-reduce:transition-opacity";

/** A trigger renders a native button unless its `render` (or asChild child) is another tag. */
function isNativeButton(render: unknown) {
  return !React.isValidElement(render) || typeof render.type !== "string" || render.type === "button";
}

type AlertDialogProps = Omit<React.ComponentProps<typeof BaseAlertDialog.Root>, "onOpenChange"> & { onOpenChange?: (open: boolean) => void };

function AlertDialog({ onOpenChange, ...props }: AlertDialogProps) {
  return <BaseAlertDialog.Root data-slot="alert-dialog" onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined} {...props} />;
}

function AlertDialogTrigger({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseAlertDialog.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseAlertDialog.Trigger data-slot="alert-dialog-trigger" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseAlertDialog.Trigger>
  );
}

function AlertDialogPortal(props: React.ComponentProps<typeof BaseAlertDialog.Portal>) {
  const container = usePortalContainer();
  return <BaseAlertDialog.Portal data-slot="alert-dialog-portal" container={container} {...props} />;
}

function AlertDialogOverlay({ className, ...props }: Omit<React.ComponentProps<typeof BaseAlertDialog.Backdrop>, "className"> & { className?: string }) {
  return <BaseAlertDialog.Backdrop data-slot="alert-dialog-overlay" className={cn(OVERLAY, className)} {...props} />;
}

function AlertDialogContent({ className, size = "default", ...props }: Omit<React.ComponentProps<typeof BaseAlertDialog.Popup>, "className"> & { className?: string; size?: "default" | "sm" }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <BaseAlertDialog.Viewport data-slot="alert-dialog-viewport" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 fade-y sm:p-6">
        <BaseAlertDialog.Popup data-slot="alert-dialog-content" data-size={size} className={cn(POPUP, className)} {...props} />
      </BaseAlertDialog.Viewport>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end", className)} {...props} />;
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-media" className={cn("ds-hex-mark mb-2 flex size-10 shrink-0 items-center justify-center bg-subtle-hover text-fg [&_svg:not([class*='size-'])]:size-5", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: Omit<React.ComponentProps<typeof BaseAlertDialog.Title>, "className"> & { className?: string }) {
  return <BaseAlertDialog.Title data-slot="alert-dialog-title" className={cn("font-display text-h5 leading-title font-light text-balance text-fg", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: Omit<React.ComponentProps<typeof BaseAlertDialog.Description>, "className"> & { className?: string }) {
  return <BaseAlertDialog.Description data-slot="alert-dialog-description" className={cn("text-body-sm leading-line-body-sm text-pretty text-fg-secondary", className)} {...props} />;
}

type KeyProps = Omit<React.ComponentProps<typeof Button>, "variant"> & { variant?: "default" | "destructive" };

/** The decision: an ink hexagon (or orange, for destructive) that closes the dialog after its own onClick runs. */
function AlertDialogAction({ variant = "default", children, ...props }: KeyProps) {
  return (
    <BaseAlertDialog.Close data-slot="alert-dialog-action" render={<Button variant={variant} {...props} />}>
      {children}
    </BaseAlertDialog.Close>
  );
}

function AlertDialogCancel({ children, ...props }: Omit<React.ComponentProps<typeof Button>, "variant">) {
  return (
    <BaseAlertDialog.Close data-slot="alert-dialog-cancel" render={<Button variant="outline" {...props} />}>
      {children}
    </BaseAlertDialog.Close>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};

```
