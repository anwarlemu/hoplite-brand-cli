# Progress
A square usage bar: a 2px quiet track with the ink filling it to the value, or the orange when a limit is close; a 14px medium label and a Kode Mono value can sit above it.

Install: npx hoplite-ds add progress
Requires: theme, utils
Packages: @base-ui/react
Exports: Progress, ProgressLabel, ProgressValue
Client boundary: yes
Reference: The Hoplite website's plan usage meter (.pa-usage, .pa-usage__bar), drawn square on the quiet line


## Usage
Use Progress for a known amount: usage against a plan, a clone or an upload. Put ProgressLabel and ProgressValue inside it to show what it measures. Use variant="accent" only near a limit. value={null} shows work with no known end.
- Avoid: A rounded or thick bar
- Avoid: A striped or glowing fill
- Avoid: The orange for a normal amount


## Examples
Example components: npx hoplite-ds add progress
[Preview](https://hoplite-ds.vercel.app/preview/progress/Preview) | [WithLabel](https://hoplite-ds.vercel.app/preview/progress/WithLabel) | [Live](https://hoplite-ds.vercel.app/preview/progress/Live) | [Indeterminate](https://hoplite-ds.vercel.app/preview/progress/Indeterminate)

examples/progress.tsx

```tsx
"use client";

import * as React from "react";

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";

export function Preview() {
  return <Progress value={62} aria-label="Monthly usage" className="max-w-sm" />;
}

export function WithLabel() {
  return (
    <div className="grid max-w-sm gap-6">
      <Progress value={84}>
        <ProgressLabel>Usage this month</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={96} variant="accent">
        <ProgressLabel>Sandbox hours</ProgressLabel>
        <ProgressValue>{(formatted) => `${formatted} of 400 h`}</ProgressValue>
      </Progress>
    </div>
  );
}

export function Live() {
  const [value, setValue] = React.useState(12);
  React.useEffect(() => {
    // ds-latency: the demo advances a simulated clone; nothing waits on it.
    const id = window.setInterval(() => setValue((current) => (current >= 100 ? 12 : Math.min(100, current + 11))), 900);
    return () => window.clearInterval(id);
  }, []);
  return (
    <Progress value={value} className="max-w-sm">
      <ProgressLabel>Cloning acme/storefront</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

export function Indeterminate() {
  return (
    <Progress value={null} className="max-w-sm">
      <ProgressLabel>Waiting for a sandbox</ProgressLabel>
    </Progress>
  );
}

```

## Source

components/ui/progress.tsx

```tsx
"use client";

import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

// A usage bar, after the site's plan usage meter (.pa-usage__bar) drawn square: a 2px track of the quiet 16 percent line
// with the ink filling it to the value (or, `accent`, the orange: a limit close at hand). The fill moves in 240ms on the
// strong ease-out. A label and its value (Kode Mono 12px, quiet) can sit above it as children. With value={null} it
// breathes softly across the track.
type ProgressProps = React.ComponentProps<typeof BaseProgress.Root> & { variant?: "default" | "accent"; indicatorClassName?: string };

function Progress({ className, variant = "default", indicatorClassName, children, value = 0, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root data-slot="progress" data-variant={variant} value={value} className={cn("grid w-full grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2", className)} {...props}>
      {children}
      <BaseProgress.Track data-slot="progress-track" className="col-span-2 h-0.5 w-full overflow-hidden bg-line">
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className={cn(
            "block h-full transition-[width] duration-slow ease-out data-indeterminate:w-full data-indeterminate:animate-pulse-soft motion-reduce:transition-none motion-reduce:data-indeterminate:animate-none",
            variant === "accent" ? "bg-brand" : "bg-primary",
            indicatorClassName,
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

function ProgressLabel({ className, ...props }: React.ComponentProps<typeof BaseProgress.Label>) {
  return <BaseProgress.Label data-slot="progress-label" className={cn("min-w-0 truncate font-sans text-body-sm leading-line-body-sm font-medium text-fg", className)} {...props} />;
}

function ProgressValue({ className, ...props }: React.ComponentProps<typeof BaseProgress.Value>) {
  return <BaseProgress.Value data-slot="progress-value" className={cn("font-mono text-caption leading-line-caption tracking-code text-fg-muted tabular-nums", className)} {...props} />;
}

export { Progress, ProgressLabel, ProgressValue };

```
