# Popover
A square 288px panel of the ground with 16px of air, a quiet hairline and a long soft cast, 8px from its trigger: a 14px medium title over a quiet 14px line, as the nav's rows read, then any small form or detail. It opens from its trigger with a fade and a slight scale.

Install: npx hoplite-ds add popover
Requires: theme, utils, surface
Packages: @base-ui/react
Exports: Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger
Client boundary: yes
Reference: The Hoplite website's popups (.hn__sheet: the ground panel and quiet line) and nav rows (.hn__item-label, .hn__item-body: 14px medium over 14px quiet).


## Usage
Use for a little interactive content tied to a control: a short form (Add seats), an explanation behind an info glyph, a picker. Put PopoverTitle and PopoverDescription in PopoverHeader. For plain text on hover use Tooltip; for a list of actions use Dropdown Menu; for a task that needs full attention use Dialog.
- Avoid: Rounded corners
- Avoid: A white panel
- Avoid: An arrow
- Avoid: A long form
- Avoid: Content that only appears on hover


## Examples
Example components: npx hoplite-ds add popover button input
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/popover/Preview) | [Open](https://hoplite-ds.vercel.app/preview/popover/Open) | [Info](https://hoplite-ds.vercel.app/preview/popover/Info)

examples/popover.tsx

```tsx
"use client";

import { CaretDownIcon, InfoIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

function Seats({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>
        Add seats
        <CaretDownIcon />
      </PopoverTrigger>
      {/* Shown open on load, nobody opened it: it keeps focus where it is instead of pulling it (and the page's scroll)
          into the field. Opened from the trigger, focus moves in as usual. */}
      <PopoverContent align="start" initialFocus={defaultOpen ? false : undefined} className="flex flex-col gap-4">
        <PopoverHeader>
          <PopoverTitle>Seats on the Team plan</PopoverTitle>
          <PopoverDescription>$20 per seat a month, prorated from today.</PopoverDescription>
        </PopoverHeader>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm leading-line-body-sm font-medium text-fg">Seats</span>
          <Input type="number" defaultValue={8} min={1} />
        </label>
        <Button size="sm" className="self-end">
          Update plan
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function Preview() {
  return <Seats />;
}

export function Open() {
  return (
    <div className="min-h-80">
      <Seats defaultOpen />
    </div>
  );
}

export function Info() {
  return (
    <div className="flex items-center gap-2 text-body-sm leading-line-body-sm text-fg-secondary">
      Sandbox minutes
      <Popover>
        <PopoverTrigger render={<Button variant="ghost" size="icon-sm" aria-label="About sandbox minutes" />}>
          <InfoIcon />
        </PopoverTrigger>
        <PopoverContent side="top">
          <PopoverHeader>
            <PopoverTitle>Sandbox minutes</PopoverTitle>
            <PopoverDescription>Counted while a sandbox is running a thread. Idle sandboxes stop after 30 minutes and are not counted.</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  );
}

```

## Source

components/ui/popover.tsx

```tsx
"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";

// A popover as the site draws its popups (the nav's sheet, .hn__sheet): a square panel of the ground, 288px wide with
// 16px of air, a quiet hairline and a long soft cast. A title is 14px medium in the ink with a 14px quiet line under it,
// as the nav's items read (.hn__item-label, .hn__item-body). It opens from its trigger in 240ms (fade and 0.98 scale on
// the strong ease-out) and leaves in 200ms; with reduced motion it only fades.
const POPUP =
  "z-50 w-72 max-w-(--available-width) bg-surface p-4 text-body-sm leading-line-body-sm text-fg shadow-floating outline-none origin-(--transform-origin) transition-[opacity,scale] duration-slow ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-moderate data-instant:transition-none motion-reduce:transition-opacity";

/** A trigger renders a native button unless its `render` (or asChild child) is another tag. */
function isNativeButton(render: unknown) {
  return !React.isValidElement(render) || typeof render.type !== "string" || render.type === "button";
}

// Base UI positions against the trigger, or against any element passed as the positioner's anchor: PopoverAnchor
// registers one here.
const AnchorContext = React.createContext<{ anchor: HTMLElement | null; setAnchor: (el: HTMLElement | null) => void } | null>(null);

type PopoverProps = Omit<React.ComponentProps<typeof BasePopover.Root>, "onOpenChange"> & { onOpenChange?: (open: boolean) => void };

function Popover({ onOpenChange, ...props }: PopoverProps) {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  return (
    <AnchorContext.Provider value={{ anchor, setAnchor }}>
      <BasePopover.Root data-slot="popover" onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined} {...props} />
    </AnchorContext.Provider>
  );
}

function PopoverTrigger({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BasePopover.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BasePopover.Trigger data-slot="popover-trigger" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BasePopover.Trigger>
  );
}

function PopoverAnchor({ className, ...props }: React.ComponentProps<"div">) {
  const context = React.useContext(AnchorContext);
  return <div data-slot="popover-anchor" ref={context?.setAnchor} className={className} {...props} />;
}

type Placement = Pick<React.ComponentProps<typeof BasePopover.Positioner>, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding">;
type PopoverContentProps = Omit<React.ComponentProps<typeof BasePopover.Popup>, "className"> & Placement & { className?: string };

function PopoverContent({ className, side = "bottom", align = "center", sideOffset = 8, alignOffset = 0, collisionPadding = 8, ...props }: PopoverContentProps) {
  const container = usePortalContainer();
  const anchor = React.useContext(AnchorContext)?.anchor ?? undefined;
  return (
    <BasePopover.Portal container={container}>
      <BasePopover.Positioner className="z-50" side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} collisionPadding={collisionPadding} anchor={anchor}>
        <BasePopover.Popup data-slot="popover-content" className={cn(POPUP, className)} {...props} />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-header" className={cn("flex flex-col gap-1", className)} {...props} />;
}

function PopoverTitle({ className, ...props }: Omit<React.ComponentProps<typeof BasePopover.Title>, "className"> & { className?: string }) {
  return <BasePopover.Title data-slot="popover-title" className={cn("font-sans text-body-sm leading-line-body-sm font-medium text-fg", className)} {...props} />;
}

function PopoverDescription({ className, ...props }: Omit<React.ComponentProps<typeof BasePopover.Description>, "className"> & { className?: string }) {
  return <BasePopover.Description data-slot="popover-description" className={cn("text-body-sm leading-line-body-sm text-fg-muted", className)} {...props} />;
}

export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };

```
