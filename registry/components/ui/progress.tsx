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
