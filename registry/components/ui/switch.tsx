"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

// The product's switch from the site's app demo (.pa-sw): a 28 by 16 rounded track (one of the few round things) in the
// off gray, the orange when on, holding a 12px knob of the ground 2px in that travels 12px. `size="sm"` is the
// demo's 20 by 12 switch with an 8px knob (.tt-sw). The track's color changes in 160ms on the ease-out; the knob
// travels on screen, so it moves in 160ms on the in-out curve; with reduced motion both are instant. Keyboard focus is
// the 2px ink outline 2px out; invalid adds the orange outline; disabled turns the track the quiet line (the off gray
// when on). An invisible 8px margin widens the hit area.
type SwitchProps = React.ComponentProps<typeof BaseSwitch.Root> & { size?: "default" | "sm" };

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-pill bg-off p-[calc(var(--ds-space-1)/2)] transition-[background-color] duration-base ease-out after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-checked:bg-brand aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-danger data-disabled:cursor-not-allowed data-disabled:bg-line data-disabled:data-checked:bg-off data-[size=default]:h-4 data-[size=default]:w-7 data-[size=sm]:h-3 data-[size=sm]:w-5 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-pill bg-surface transition-[translate] duration-base ease-in-out group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2 data-checked:translate-x-3 group-data-[size=sm]/switch:data-checked:translate-x-2 motion-reduce:transition-none"
      />
    </BaseSwitch.Root>
  );
}

export { Switch };
