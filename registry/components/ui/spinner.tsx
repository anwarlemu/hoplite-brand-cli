import * as React from "react";

import { cn } from "@/lib/utils";

// Work in progress, extrapolated from the site's hexagonal marks: a 16px hexagon outline (points left and right, like
// the FAQ's mark) in a faint line of the current color, with a third of its edge drawn in the current color, turning at
// a steady 0.8s a turn. With reduced motion it stops turning and breathes instead. It takes the color of its text, so
// it reads on an ink key as well as on the ground.
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      className={cn("size-4 shrink-0 animate-spin-steady motion-reduce:animate-pulse-soft", className)}
      {...props}
    >
      <path d="M19 10L14.5 17.79L5.5 17.79L1 10L5.5 2.21L14.5 2.21Z" strokeWidth={1.5} className="opacity-20" />
      <path d="M19 10L14.5 17.79L5.5 17.79L1 10L5.5 2.21L14.5 2.21Z" strokeWidth={1.5} pathLength={6} strokeDasharray="2 4" strokeLinejoin="miter" />
    </svg>
  );
}

export { Spinner };
