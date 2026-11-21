# Spinner
A 16px hexagon outline with a third of its edge drawn, turning steadily; it takes the color of its text and breathes in place with reduced motion.

Install: npx hoplite-ds add spinner
Requires: theme, utils
Packages: none
Exports: Spinner
Client boundary: not required by this entry file
Reference: Extrapolated from the Hoplite website: the FAQ's hexagon mark (.faq__hex) set turning


## Usage
Use Spinner for work that takes a few seconds with no known end (starting a thread, running checks), inside a disabled key, a tag or beside a line of text. For work with a known end, use Progress.
- Avoid: A round spinner
- Avoid: An orange spinner
- Avoid: A spinner larger than 32px
- Avoid: A spinner for content that should show a Skeleton


## Examples
Example components: npx hoplite-ds add spinner badge button
[Preview](https://hoplite-ds.vercel.app/preview/spinner/Preview) | [Sizes](https://hoplite-ds.vercel.app/preview/spinner/Sizes) | [InControls](https://hoplite-ds.vercel.app/preview/spinner/InControls)

examples/spinner.tsx

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Preview() {
  return (
    <div className="flex items-center gap-3 text-body-sm leading-line-body-sm text-fg-secondary">
      <Spinner />
      Setting up the sandbox
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-6 text-fg">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-5" />
      <Spinner className="size-8" />
    </div>
  );
}

export function InControls() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Spinner />
        Starting thread
      </Button>
      <Button variant="outline" disabled>
        <Spinner />
        Running checks
      </Button>
      <Badge variant="secondary">
        <Spinner />
        Queued
      </Badge>
    </div>
  );
}

```

## Source

components/ui/spinner.tsx

```tsx
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

```
