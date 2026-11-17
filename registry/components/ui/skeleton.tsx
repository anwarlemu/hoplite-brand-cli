import * as React from "react";

import { cn } from "@/lib/utils";

// A placeholder while content loads, extrapolated from the site's square frames: a square block of the hover wash that
// breathes softly (to 55 percent and back over 1.6s, in-out). With reduced motion it holds still.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" aria-hidden className={cn("animate-pulse-soft bg-subtle-hover motion-reduce:animate-none", className)} {...props} />;
}

export { Skeleton };
