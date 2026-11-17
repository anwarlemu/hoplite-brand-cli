"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// A ground: the warm ground (pages, dialogs, popups), the paper (a card under the pointer, a story), or the night (a
// dark band: the dark theme scoped to this element). Dialogs, menus and tooltips opened inside a Surface render inside
// it, so a preview or an embedded panel keeps its overlays and its theme.
const PortalContainer = React.createContext<HTMLElement | null>(null);

const GROUNDS = {
  ground: "bg-surface text-fg",
  paper: "bg-subtle text-fg",
  night: "ds-theme dark bg-surface text-fg",
} as const;

export function Surface({ ground = "ground", className, children, ...props }: React.ComponentProps<"div"> & { ground?: keyof typeof GROUNDS }) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setElement} data-ground={ground} className={cn(GROUNDS[ground], className)} {...props}>
      <PortalContainer.Provider value={element}>{children}</PortalContainer.Provider>
    </div>
  );
}

/** Where overlays render: the nearest Surface, else the page body. */
export function usePortalContainer() {
  return React.useContext(PortalContainer) ?? undefined;
}
