# Drawer
A square sheet of the ground that rises from the bottom edge, ruled off by the quiet line with a long soft cast, over the ink at 32 percent: a small square handle near its top, a centered Chakra Petch light 20px title over a 14px graphite description, stacked hexagon keys. It slides its own height on the dock curve and follows a swipe down to close. A long body scrolls inside the panel and fades at the edge it scrolls past (fade-y).

Install: npx hoplite-ds add drawer
Requires: theme, utils, surface
Packages: @base-ui/react
Exports: Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger
Client boundary: yes
Reference: Extrapolated from the Hoplite website: the square ground panel of its popups (.hn__sheet), the dock curve (--dock) and the long soft cast; built on Base UI's drawer for the swipe.


## Usage
Use on touch screens for a short task or a list to act on (steering running subagents) that should feel like part of the page. Put the title in DrawerHeader and stacked actions in DrawerFooter. direction="right" or "left" makes a swipeable side panel; on desktop prefer Dialog or Sheet.
- Avoid: A rounded top or handle
- Avoid: A white panel
- Avoid: Content that needs a long scroll
- Avoid: Nested drawers
- Avoid: Easing in


## Examples
Example components: npx hoplite-ds add drawer button
[Preview](https://hoplite-ds.vercel.app/preview/drawer/Preview) | [Open](https://hoplite-ds.vercel.app/preview/drawer/Open) | [Side](https://hoplite-ds.vercel.app/preview/drawer/Side)

examples/drawer.tsx

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const AGENTS = [
  { name: "Fix flaky upload test", state: "Running checks" },
  { name: "Prorate seats on upgrade", state: "Waiting for review" },
  { name: "Bump the Node image", state: "Done" },
];

function Subagents({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Drawer defaultOpen={defaultOpen}>
      <DrawerTrigger render={<Button variant="outline" />}>Steer subagents</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader>
            <DrawerTitle>Running subagents</DrawerTitle>
            <DrawerDescription>Three agents are working in acme-web. Swipe down to close.</DrawerDescription>
          </DrawerHeader>
          <ul className="m-0 list-none px-6 py-0">
            {AGENTS.map((agent) => (
              <li key={agent.name} className="flex items-center justify-between gap-4 border-b border-line py-3 text-body-sm leading-line-body-sm first:border-t">
                <span className="text-fg">{agent.name}</span>
                <span className="shrink-0 text-fg-muted">{agent.state}</span>
              </li>
            ))}
          </ul>
          <DrawerFooter>
            <Button>Open threads</Button>
            <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function Preview() {
  return <Subagents />;
}

export function Open() {
  return (
    <div className="min-h-120">
      <Subagents defaultOpen />
    </div>
  );
}

export function Side() {
  return (
    <Drawer direction="right">
      <DrawerTrigger render={<Button variant="outline" />}>Open from the right</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Thread details</DrawerTitle>
          <DrawerDescription>Swipe right to close.</DrawerDescription>
        </DrawerHeader>
        <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 px-6 text-body-sm leading-line-body-sm">
          <dt className="text-fg-muted">Repository</dt>
          <dd className="m-0 text-fg">acme/web</dd>
          <dt className="text-fg-muted">Branch</dt>
          <dd className="m-0 text-fg">fix/upload-retry</dd>
          <dt className="text-fg-muted">Agent</dt>
          <dd className="m-0 text-fg">Claude Code</dd>
        </dl>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

```

## Source

components/ui/drawer.tsx

```tsx
"use client";

import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";

// A sheet that rises from the bottom edge and follows the finger: a square panel of the ground the full width of the
// screen, ruled off from the page by the quiet line with the long soft cast over it, over the ink at 32 percent. A
// small square handle of the 32 percent line sits 12px from its top edge. The header centers a Chakra Petch light 20px
// title over a 14px graphite description; the footer stacks its hexagon keys. It slides its own height on the dock curve
// in 240ms; a swipe down dismisses it and the release runs shorter the faster the flick. `direction` puts it on another
// edge (no handle there). With reduced motion it appears in place.
type Direction = "bottom" | "top" | "left" | "right";

const SWIPE = { bottom: "down", top: "up", left: "left", right: "right" } as const;

const PLACE: Record<Direction, string> = {
  bottom:
    "inset-x-0 bottom-0 max-h-[85dvh] border-t border-line [transform:translateY(var(--drawer-swipe-movement-y))] data-starting-style:[transform:translateY(100%)] data-ending-style:[transform:translateY(100%)]",
  top: "inset-x-0 top-0 max-h-[85dvh] border-b border-line [transform:translateY(var(--drawer-swipe-movement-y))] data-starting-style:[transform:translateY(-100%)] data-ending-style:[transform:translateY(-100%)]",
  right:
    "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-line [transform:translateX(var(--drawer-swipe-movement-x))] data-starting-style:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-line [transform:translateX(var(--drawer-swipe-movement-x))] data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)]",
};

const DirectionContext = React.createContext<Direction>("bottom");

/** A trigger renders a native button unless its `render` (or asChild child) is another tag. */
function isNativeButton(render: unknown) {
  return !React.isValidElement(render) || typeof render.type !== "string" || render.type === "button";
}

type DrawerProps = Omit<React.ComponentProps<typeof BaseDrawer.Root>, "onOpenChange" | "swipeDirection"> & { direction?: Direction; onOpenChange?: (open: boolean) => void };

function Drawer({ direction = "bottom", onOpenChange, ...props }: DrawerProps) {
  return (
    <DirectionContext.Provider value={direction}>
      <BaseDrawer.Root data-slot="drawer" swipeDirection={SWIPE[direction]} onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined} {...props} />
    </DirectionContext.Provider>
  );
}

function DrawerTrigger({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseDrawer.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseDrawer.Trigger data-slot="drawer-trigger" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseDrawer.Trigger>
  );
}

function DrawerPortal(props: React.ComponentProps<typeof BaseDrawer.Portal>) {
  const container = usePortalContainer();
  return <BaseDrawer.Portal data-slot="drawer-portal" container={container} {...props} />;
}

function DrawerClose({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseDrawer.Close> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseDrawer.Close data-slot="drawer-close" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseDrawer.Close>
  );
}

function DrawerOverlay({ className, ...props }: Omit<React.ComponentProps<typeof BaseDrawer.Backdrop>, "className"> & { className?: string }) {
  return (
    <BaseDrawer.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-scrim opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-slow ease-drawer data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*var(--ds-duration-slow))] data-swiping:duration-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({ className, children, ...props }: Omit<React.ComponentProps<typeof BaseDrawer.Popup>, "className"> & { className?: string }) {
  const direction = React.useContext(DirectionContext);
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <BaseDrawer.Viewport data-slot="drawer-viewport" className="fixed inset-0 z-50">
        <BaseDrawer.Popup
          data-slot="drawer-content"
          data-direction={direction}
          className={cn(
            "fixed flex flex-col bg-surface text-fg shadow-floating outline-none touch-auto transition-transform duration-slow ease-drawer data-ending-style:duration-[calc(var(--drawer-swipe-strength)*var(--ds-duration-slow))] data-swiping:duration-0 data-swiping:select-none motion-reduce:transition-none",
            PLACE[direction],
            className,
          )}
          {...props}
        >
          {direction === "bottom" && <div data-slot="drawer-handle" aria-hidden className="mx-auto mt-3 h-1 w-12 shrink-0 bg-line-field" />}
          <BaseDrawer.Content data-slot="drawer-body" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain fade-y">
            {children}
          </BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  const direction = React.useContext(DirectionContext);
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-2 p-6", direction === "bottom" || direction === "top" ? "items-center text-center" : "", className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-3 p-6 pb-[max(var(--ds-space-6),env(safe-area-inset-bottom))]", className)} {...props} />;
}

function DrawerTitle({ className, ...props }: Omit<React.ComponentProps<typeof BaseDrawer.Title>, "className"> & { className?: string }) {
  return <BaseDrawer.Title data-slot="drawer-title" className={cn("font-display text-h5 leading-title font-light text-balance text-fg", className)} {...props} />;
}

function DrawerDescription({ className, ...props }: Omit<React.ComponentProps<typeof BaseDrawer.Description>, "className"> & { className?: string }) {
  return <BaseDrawer.Description data-slot="drawer-description" className={cn("text-body-sm leading-line-body-sm text-pretty text-fg-secondary", className)} {...props} />;
}

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger };

```
