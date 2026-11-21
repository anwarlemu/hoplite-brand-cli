# Tooltip
A small square panel of the ink with 12px Satoshi in the ground color, 8px by 12px of air, 8px from its trigger. It waits 400ms the first time, then neighbors open at once; it only fades, and not at all between tooltips.

Install: npx hoplite-ds add tooltip
Requires: theme, utils, surface
Packages: @base-ui/react
Exports: Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
Client boundary: yes
Reference: Extrapolated from the Hoplite website's ink (the main key's fill, .button--primary) and its 12px labels; the site has no tooltips.


## Usage
Use to name an icon-only control (New thread, Open in terminal) or add one short line about a control. Wrap a toolbar in TooltipProvider so moving along it opens each tooltip at once. Use asChild or render on TooltipTrigger to attach it to a Button.
- Avoid: Information found nowhere else
- Avoid: Interactive content
- Avoid: Rounded corners or an arrow
- Avoid: Text over two lines
- Avoid: A tooltip on a disabled control


## Examples
Example components: npx hoplite-ds add tooltip button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/tooltip/Preview) | [Open](https://hoplite-ds.vercel.app/preview/tooltip/Open) | [Toolbar](https://hoplite-ds.vercel.app/preview/tooltip/Toolbar) | [Long](https://hoplite-ds.vercel.app/preview/tooltip/Long)

examples/tooltip.tsx

```tsx
"use client";

import { ArchiveIcon, GitBranchIcon, PlusIcon, ShareNetworkIcon, TerminalWindowIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Preview() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="New thread" />}>
        <PlusIcon />
      </TooltipTrigger>
      <TooltipContent>New thread</TooltipContent>
    </Tooltip>
  );
}

export function Open() {
  return (
    <div className="flex min-h-32 items-end justify-center">
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Open in terminal" />}>
          <TerminalWindowIcon />
        </TooltipTrigger>
        <TooltipContent>Open in terminal</TooltipContent>
      </Tooltip>
    </div>
  );
}

const TOOLS = [
  { label: "Open in terminal", icon: TerminalWindowIcon },
  { label: "Branch from here", icon: GitBranchIcon },
  { label: "Share thread", icon: ShareNetworkIcon },
  { label: "Archive", icon: ArchiveIcon },
];

export function Toolbar() {
  return (
    <TooltipProvider>
      <div className="flex w-fit items-center gap-1 border border-line p-1">
        {TOOLS.map(({ label, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} />}>
              <Icon />
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

export function Long() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="link" />}>Why is this check queued?</TooltipTrigger>
      <TooltipContent>Your plan runs two sandboxes at once. This check starts when the end-to-end run on acme-web finishes.</TooltipContent>
    </Tooltip>
  );
}

```

## Source

components/ui/tooltip.tsx

```tsx
"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";

// A tooltip: a small square panel of the ink with 12px Satoshi in the ground color, 8px above and below and 12px in,
// at most 240px wide, 8px from its trigger. It waits 400ms the first time, then neighbors open at once while one is
// showing (a delay group). It only fades: in over 160ms, out over 120ms on the strong ease-out, and not at all when
// moving between tooltips.
const HasProvider = React.createContext(false);

type ProviderProps = React.ComponentProps<typeof BaseTooltip.Provider> & { delayDuration?: number; skipDelayDuration?: number };

function TooltipProvider({ delayDuration, skipDelayDuration, delay, timeout, ...props }: ProviderProps) {
  return (
    <HasProvider.Provider value>
      <BaseTooltip.Provider delay={delay ?? delayDuration ?? 400} timeout={timeout ?? skipDelayDuration ?? 400} {...props} />
    </HasProvider.Provider>
  );
}

function Tooltip(props: React.ComponentProps<typeof BaseTooltip.Root>) {
  const root = <BaseTooltip.Root data-slot="tooltip" {...props} />;
  return React.useContext(HasProvider) ? root : <TooltipProvider>{root}</TooltipProvider>;
}

function TooltipTrigger({ asChild = false, render, children, ...props }: React.ComponentProps<typeof BaseTooltip.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseTooltip.Trigger data-slot="tooltip-trigger" render={parts.render} {...props}>
      {parts.children}
    </BaseTooltip.Trigger>
  );
}

type Placement = Pick<React.ComponentProps<typeof BaseTooltip.Positioner>, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding">;
type TooltipContentProps = Omit<React.ComponentProps<typeof BaseTooltip.Popup>, "className"> & Placement & { className?: string };

function TooltipContent({ className, side = "top", align = "center", sideOffset = 8, alignOffset = 0, collisionPadding = 8, ...props }: TooltipContentProps) {
  const container = usePortalContainer();
  return (
    <BaseTooltip.Portal container={container}>
      <BaseTooltip.Positioner className="z-50" side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} collisionPadding={collisionPadding}>
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            "max-w-60 bg-primary px-3 py-2 font-sans text-caption leading-line-caption text-balance text-on-primary transition-opacity duration-base ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-fast data-instant:transition-none",
            className,
          )}
          {...props}
        />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

```
