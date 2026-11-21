# Aspect Ratio
Holds media at a fixed shape with square corners; an image inside fills it.

Install: npx hoplite-ds add aspect-ratio
Requires: theme, utils
Packages: none
Exports: AspectRatio
Client boundary: not required by this entry file
Reference: Extrapolated from the Hoplite website: its fixed-shape frames (.how__frame at 4:3, .band__frame)


## Usage
Use AspectRatio for product shots, video stills and figures so the page does not jump while they load. Give it the ratio as a number (16 / 9) and put it in a Card with corners for the site's framed art.
- Avoid: Rounded media
- Avoid: A drop shadow around media


## Examples
Example components: npx hoplite-ds add aspect-ratio
[Preview](https://hoplite-ds.vercel.app/preview/aspect-ratio/Preview) | [Ratios](https://hoplite-ds.vercel.app/preview/aspect-ratio/Ratios)

examples/aspect-ratio.tsx

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Preview() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="ds-corners grid place-items-center">
        <span className="ds-label">16:9 product shot</span>
      </AspectRatio>
    </div>
  );
}

export function Ratios() {
  return (
    <div className="grid w-full max-w-xl grid-cols-3 items-start gap-4">
      {[
        [1, "1:1"],
        [4 / 3, "4:3"],
        [3 / 4, "3:4"],
      ].map(([ratio, label]) => (
        <AspectRatio key={label} ratio={ratio as number} className="grid place-items-center border border-line-frame">
          <span className="ds-label">{label}</span>
        </AspectRatio>
      ))}
    </div>
  );
}

```

## Source

components/ui/aspect-ratio.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// Holds media at a fixed shape (a product shot in a frame, a video still). The box takes no style of its own: square
// corners, and the media inside fills it (object-cover). Put it inside a Card with corners for the site's framed art.
function AspectRatio({ ratio = 1, className, style, ...props }: React.ComponentProps<"div"> & { ratio?: number }) {
  return <div data-slot="aspect-ratio" className={cn("relative w-full overflow-hidden [&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-cover", className)} style={{ aspectRatio: ratio, ...style }} {...props} />;
}

export { AspectRatio };

```
