# Skeleton
A square block of the hover wash that breathes softly while content loads, and holds still with reduced motion.

Install: npx hoplite-ds add skeleton
Requires: theme, utils
Packages: none
Exports: Skeleton
Client boundary: not required by this entry file
Reference: Extrapolated from the Hoplite website: its square frames and the hover wash (--panel)


## Usage
Use Skeleton in the shape of the content that is coming (lines of text, an avatar hexagon, a key) when it takes more than a moment to load. Size each block like the real content; clip it with ds-hex-mark or ds-hex for avatars and keys.
- Avoid: A shimmer sweep
- Avoid: Rounded blocks
- Avoid: A skeleton for content that loads instantly


## Examples
Example components: npx hoplite-ds add skeleton
[Preview](https://hoplite-ds.vercel.app/preview/skeleton/Preview) | [CardShape](https://hoplite-ds.vercel.app/preview/skeleton/CardShape) | [List](https://hoplite-ds.vercel.app/preview/skeleton/List)

examples/skeleton.tsx

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function Preview() {
  return (
    <div className="flex max-w-sm items-center gap-4">
      <Skeleton className="ds-hex-mark size-10 shrink-0" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function CardShape() {
  return (
    <div className="grid max-w-sm gap-6 border border-line-frame p-8">
      <Skeleton className="h-8 w-24" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="ds-hex h-10 w-full" />
    </div>
  );
}

export function List() {
  return (
    <div className="grid max-w-md">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center justify-between gap-4 border-b border-line py-3 first:border-t">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

```

## Source

components/ui/skeleton.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// A placeholder while content loads, extrapolated from the site's square frames: a square block of the hover wash that
// breathes softly (to 55 percent and back over 1.6s, in-out). With reduced motion it holds still.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" aria-hidden className={cn("animate-pulse-soft bg-subtle-hover motion-reduce:animate-none", className)} {...props} />;
}

export { Skeleton };

```
