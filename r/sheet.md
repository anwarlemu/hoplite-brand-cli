# Sheet
A square full-height panel of the ground, 384px wide, ruled off by the quiet line and casting the long soft shadow over the page under the ink at 32 percent, with a Chakra Petch light 20px title, a 14px graphite description, footer keys at the end and a compact ghost X. It slides its own width on the dock curve. A long body scrolls inside the panel and fades at the edge it scrolls past (fade-y).

Install: npx hoplite-ds add sheet
Requires: theme, utils, surface, button
Packages: @base-ui/react, @phosphor-icons/react
Exports: Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger
Client boundary: yes
Reference: Extrapolated from the Hoplite website: the square ground panel and quiet line of its popups (.hn__sheet), the dock curve its frames slide on (--dock) and its long soft cast.


## Usage
Use for detail or settings that sit beside the page (a pull request's checks, sandbox settings) without leaving it. Open from the right by default; side="left" for navigation, "top" or "bottom" for a band. Put the title in SheetHeader and the actions in SheetFooter with one ink Button. On phones use Drawer for a swipeable bottom sheet.
- Avoid: Rounded corners
- Avoid: A white panel
- Avoid: A sheet wider than half the screen on desktop
- Avoid: A sheet that opens another sheet
- Avoid: Easing in


## Examples
Example components: npx hoplite-ds add sheet button input
[Preview](https://hoplite-ds.vercel.app/preview/sheet/Preview) | [Open](https://hoplite-ds.vercel.app/preview/sheet/Open) | [Sides](https://hoplite-ds.vercel.app/preview/sheet/Sides) | [Form](https://hoplite-ds.vercel.app/preview/sheet/Form)

examples/sheet.tsx

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const CHECKS = [
  { name: "Unit tests", state: "Passed" },
  { name: "Type check", state: "Passed" },
  { name: "End-to-end", state: "Running" },
  { name: "Lint", state: "Passed" },
];

function PullRequest({ defaultOpen, side = "right" }: { defaultOpen?: boolean; side?: "right" | "left" | "top" | "bottom" }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger render={<Button variant="outline" />}>{side === "right" ? "Review pull request" : `Open ${side}`}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Fix flaky upload test</SheetTitle>
          <SheetDescription>#482 on acme/web, opened by the agent after its checks passed in the sandbox.</SheetDescription>
        </SheetHeader>
        <ul className="m-0 list-none px-6 py-0">
          {CHECKS.map((check) => (
            <li key={check.name} className="flex items-center justify-between border-b border-line py-3 text-body-sm leading-line-body-sm first:border-t">
              <span className="text-fg-secondary">{check.name}</span>
              <span className="text-fg">{check.state}</span>
            </li>
          ))}
        </ul>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
          <Button>Merge</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function Preview() {
  return <PullRequest />;
}

export function Open() {
  return (
    <div className="min-h-120">
      <PullRequest defaultOpen />
    </div>
  );
}

export function Sides() {
  return (
    <div className="flex flex-wrap gap-3">
      <PullRequest side="left" />
      <PullRequest side="top" />
      <PullRequest side="bottom" />
    </div>
  );
}

export function Form() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Edit sandbox</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sandbox settings</SheetTitle>
          <SheetDescription>Applies to new threads in acme-web.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-6">
          <label className="flex flex-col gap-2">
            <span className="text-body-sm leading-line-body-sm font-medium text-fg">Setup command</span>
            <Input defaultValue="pnpm install" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-body-sm leading-line-body-sm font-medium text-fg">Idle timeout, minutes</span>
            <Input type="number" defaultValue={30} />
          </label>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

```

## Source

components/ui/sheet.tsx

```tsx
"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react/ssr";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";
import { Button } from "@/components/ui/button";

// A side panel: a square, full-height panel of the ground, 384px wide (three quarters of a phone), ruled off from the
// page by the quiet line and casting the long soft shadow over it (shadow-cast), over the ink at 32 percent. A 24px
// header holds a Chakra Petch light 20px title and a 14px graphite description; the footer sits at the bottom with its
// hexagon keys at the end; the close key is a compact ghost hexagon with an X in the top right corner. The panel slides
// its own width (or height, from the top or bottom) on the dock curve: in 240ms, out in 200ms. With reduced motion it
// appears in place.
const SIDES = {
  right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-line shadow-cast data-starting-style:translate-x-full data-ending-style:translate-x-full",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-line shadow-floating data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
  top: "inset-x-0 top-0 max-h-dvh border-b border-line shadow-floating data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
  bottom: "inset-x-0 bottom-0 max-h-dvh border-t border-line shadow-floating data-starting-style:translate-y-full data-ending-style:translate-y-full",
} as const;

/** A trigger renders a native button unless its `render` (or asChild child) is another tag. */
function isNativeButton(render: unknown) {
  return !React.isValidElement(render) || typeof render.type !== "string" || render.type === "button";
}

type SheetProps = Omit<React.ComponentProps<typeof BaseDialog.Root>, "onOpenChange"> & { onOpenChange?: (open: boolean) => void };

function Sheet({ onOpenChange, ...props }: SheetProps) {
  return <BaseDialog.Root data-slot="sheet" onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined} {...props} />;
}

function SheetTrigger({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseDialog.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseDialog.Trigger data-slot="sheet-trigger" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseDialog.Trigger>
  );
}

function SheetClose({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseDialog.Close> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseDialog.Close data-slot="sheet-close" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseDialog.Close>
  );
}

function SheetPortal(props: React.ComponentProps<typeof BaseDialog.Portal>) {
  const container = usePortalContainer();
  return <BaseDialog.Portal data-slot="sheet-portal" container={container} {...props} />;
}

function SheetOverlay({ className, ...props }: Omit<React.ComponentProps<typeof BaseDialog.Backdrop>, "className"> & { className?: string }) {
  return (
    <BaseDialog.Backdrop
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-scrim transition-opacity duration-slow ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-moderate motion-reduce:transition-none", className)}
      {...props}
    />
  );
}

type SheetContentProps = Omit<React.ComponentProps<typeof BaseDialog.Popup>, "className"> & { className?: string; side?: keyof typeof SIDES; showCloseButton?: boolean; showClose?: boolean };

function SheetContent({ className, children, side = "right", showCloseButton, showClose, ...props }: SheetContentProps) {
  const close = showClose ?? showCloseButton ?? true;
  return (
    <SheetPortal>
      <SheetOverlay />
      <BaseDialog.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col bg-surface text-fg outline-none transition-[translate] duration-slow ease-drawer data-ending-style:duration-moderate motion-reduce:transition-none",
          SIDES[side],
          className,
        )}
        {...props}
      >
        {/* The body scrolls inside the panel, so a long sheet fades at its edges while the panel stays whole. */}
        <div data-slot="sheet-body" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain fade-y">
          {children}
        </div>
        {close && (
          <BaseDialog.Close data-slot="sheet-close" render={<Button variant="ghost" size="icon-sm" />} className="absolute top-4 right-4" aria-label="Close">
            <XIcon />
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-2 p-6 pr-14", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col-reverse gap-3 p-6 sm:flex-row sm:items-center sm:justify-end", className)} {...props} />;
}

function SheetTitle({ className, ...props }: Omit<React.ComponentProps<typeof BaseDialog.Title>, "className"> & { className?: string }) {
  return <BaseDialog.Title data-slot="sheet-title" className={cn("font-display text-h5 leading-title font-light text-balance text-fg", className)} {...props} />;
}

function SheetDescription({ className, ...props }: Omit<React.ComponentProps<typeof BaseDialog.Description>, "className"> & { className?: string }) {
  return <BaseDialog.Description data-slot="sheet-description" className={cn("text-body-sm leading-line-body-sm text-pretty text-fg-secondary", className)} {...props} />;
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger };

```
