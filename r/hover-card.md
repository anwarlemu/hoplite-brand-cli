# Hover Card
A preview that opens while the pointer rests on a link: a square 320px panel of the ground with 16px of air, a quiet hairline and a long soft cast, 8px from the link. It waits 400ms to open and 150ms to close, and fades in with a slight scale from the link.

Install: npx hoplite-ds add hover-card
Requires: theme, utils, surface
Packages: @base-ui/react
Exports: HoverCard, HoverCardContent, HoverCardTrigger
Client boundary: yes
Reference: The Hoplite website's popups and nav feature card (.hn__sheet, .hn__card: the ground panel, the quiet line, 16px of air).


## Usage
Use to preview what a link points to (a pull request, a repository, a teammate) for people with a pointer. Keep it to a few lines; the link itself must lead to the same information, since touch and keyboard readers may never see the card.
- Avoid: Actions that exist only in the card
- Avoid: Rounded corners
- Avoid: A white panel
- Avoid: Opening on click
- Avoid: Long content


## Examples
Example components: npx hoplite-ds add hover-card
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/hover-card/Preview) | [Open](https://hoplite-ds.vercel.app/preview/hover-card/Open)

examples/hover-card.tsx

```tsx
"use client";

import { GitPullRequestIcon } from "@phosphor-icons/react/ssr";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

function PullRequestCard({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <p className="m-0 max-w-md text-body leading-body text-fg-secondary">
      The agent opened{" "}
      <HoverCard defaultOpen={defaultOpen}>
        <HoverCardTrigger href="#pull-482" className="font-medium text-fg underline decoration-line decoration-1 underline-offset-4 transition-[text-decoration-color] duration-base ease-out hover:decoration-current motion-reduce:transition-none">
          #482
        </HoverCardTrigger>
        <HoverCardContent align="start" className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <GitPullRequestIcon className="size-5 shrink-0 text-fg" />
            <div className="flex flex-col">
              <span className="font-medium text-fg">Fix flaky upload test</span>
              <span className="text-fg-muted">acme/web, fix/upload-retry into main</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3">
            <span className="ds-label">Checks</span>
            <span className="text-fg">4 of 4 passed</span>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      after its checks passed in the sandbox.
    </p>
  );
}

export function Preview() {
  return <PullRequestCard />;
}

export function Open() {
  return (
    <div className="min-h-64">
      <PullRequestCard defaultOpen />
    </div>
  );
}

```

## Source

components/ui/hover-card.tsx

```tsx
"use client";

import * as React from "react";
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";

// A preview that opens while the pointer rests on a link, drawn like the site's popups and the nav's feature card
// (.hn__sheet, .hn__card): a square panel of the ground, 320px wide with 16px of air, a quiet hairline and a long soft
// cast, 8px from the link. It waits 400ms before it opens and 150ms before it closes, so the pointer can cross into it.
// It opens from the link in 240ms (fade and 0.98 scale on the strong ease-out) and leaves in 200ms; with reduced motion
// it only fades. Whatever it shows must also be reachable without it.
const POPUP =
  "z-50 w-80 max-w-(--available-width) bg-surface p-4 text-body-sm leading-line-body-sm text-fg shadow-floating outline-none origin-(--transform-origin) transition-[opacity,scale] duration-slow ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-moderate data-instant:transition-none motion-reduce:transition-opacity";

const DelayContext = React.createContext<{ delay: number; closeDelay: number }>({ delay: 400, closeDelay: 150 });

type HoverCardProps = React.ComponentProps<typeof BasePreviewCard.Root> & { openDelay?: number; closeDelay?: number };

function HoverCard({ openDelay = 400, closeDelay = 150, ...props }: HoverCardProps) {
  return (
    <DelayContext.Provider value={{ delay: openDelay, closeDelay }}>
      <BasePreviewCard.Root data-slot="hover-card" {...props} />
    </DelayContext.Provider>
  );
}

function HoverCardTrigger({ asChild = false, render, children, delay, closeDelay, ...props }: React.ComponentProps<typeof BasePreviewCard.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  const delays = React.useContext(DelayContext);
  return (
    <BasePreviewCard.Trigger data-slot="hover-card-trigger" render={parts.render} delay={delay ?? delays.delay} closeDelay={closeDelay ?? delays.closeDelay} {...props}>
      {parts.children}
    </BasePreviewCard.Trigger>
  );
}

type Placement = Pick<React.ComponentProps<typeof BasePreviewCard.Positioner>, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding">;
type HoverCardContentProps = Omit<React.ComponentProps<typeof BasePreviewCard.Popup>, "className"> & Placement & { className?: string };

function HoverCardContent({ className, side = "bottom", align = "center", sideOffset = 8, alignOffset = 0, collisionPadding = 8, ...props }: HoverCardContentProps) {
  const container = usePortalContainer();
  return (
    <BasePreviewCard.Portal container={container}>
      <BasePreviewCard.Positioner className="z-50" side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} collisionPadding={collisionPadding}>
        <BasePreviewCard.Popup data-slot="hover-card-content" className={cn(POPUP, className)} {...props} />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };

```
