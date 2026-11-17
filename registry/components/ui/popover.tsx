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
