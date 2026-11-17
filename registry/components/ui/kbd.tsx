import * as React from "react";

import { cn } from "@/lib/utils";

// A key cap, extrapolated from the site's nav shortcuts: a square 20px cap with a quiet 16 percent edge, 12px Kode Mono
// in the quiet gray, 4px in. On an ink tooltip the edge and label follow the tooltip's light ink. Caps in a group sit
// 4px apart.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 shrink-0 items-center justify-center gap-1 border border-line px-1 font-mono text-caption leading-none font-normal tracking-code text-fg-muted select-none [&_svg:not([class*='size-'])]:size-3 in-data-[slot=tooltip-content]:border-current/30 in-data-[slot=tooltip-content]:text-on-primary",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="kbd-group" className={cn("inline-flex items-center gap-1 font-mono text-caption text-fg-muted", className)} {...props} />;
}

export { Kbd, KbdGroup };
