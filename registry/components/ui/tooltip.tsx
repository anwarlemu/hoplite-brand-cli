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
