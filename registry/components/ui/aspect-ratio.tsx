import * as React from "react";

import { cn } from "@/lib/utils";

// Holds media at a fixed shape (a product shot in a frame, a video still). The box takes no style of its own: square
// corners, and the media inside fills it (object-cover). Put it inside a Card with corners for the site's framed art.
function AspectRatio({ ratio = 1, className, style, ...props }: React.ComponentProps<"div"> & { ratio?: number }) {
  return <div data-slot="aspect-ratio" className={cn("relative w-full overflow-hidden [&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-cover", className)} style={{ aspectRatio: ratio, ...style }} {...props} />;
}

export { AspectRatio };
