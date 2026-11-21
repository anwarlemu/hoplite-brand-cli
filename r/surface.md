# Surface
A ground (the warm gray, the paper, or the night: the dark theme scoped to one element) that also keeps the dialogs, menus and tooltips opened inside it.

Install: npx hoplite-ds add surface
Requires: utils
Packages: none
Exports: Surface, usePortalContainer
Client boundary: yes

## Usage
Wrap an embedded panel or a preview in Surface so its overlays render inside it. Pick night for a dark band or a dark preview, paper for a card that needs to lift off the ground.


## Source

lib/surface.tsx

```tsx
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

```
