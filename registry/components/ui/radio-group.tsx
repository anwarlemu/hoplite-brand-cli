"use client";

import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { cn } from "@/lib/utils";

// A radio is a hexagon that fills (the site's principles), drawn as its bullets are (.pr-features svg, .bp-list__mark:
// a regular hexagon outlined in the strong line), stood point-up like every mark: a 14 by 16 hexagon in a 16px box,
// its 1px edge an outer hexagon of the strong line around an inner one of the ground. Chosen, the hexagon fills with
// the ink and holds an 8px hexagon of the ground. The edge turns the ink under the pointer; fills change in 120ms on the
// ease-out and nothing moves or grows. The box stays square so keyboard focus is the 2px ink outline 2px out. Invalid
// radios take the orange edge; disabled ones go quiet. Options stack 12px apart, each label 8px away in 14px medium ink.
type RadioGroupProps = Omit<React.ComponentProps<typeof BaseRadioGroup>, "onValueChange"> & { onValueChange?: (value: string) => void };

function RadioGroup({ className, onValueChange, ...props }: RadioGroupProps) {
  return <BaseRadioGroup data-slot="radio-group" className={cn("grid gap-3", className)} onValueChange={onValueChange ? (value) => onValueChange(String(value)) : undefined} {...props} />;
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof BaseRadio.Root>) {
  return (
    <BaseRadio.Root
      data-slot="radio-group-item"
      className={cn(
        "peer group/radio relative grid size-4 shrink-0 cursor-pointer place-items-center *:col-start-1 *:row-start-1 after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="radio-group-edge"
        className="ds-hex-mark h-4 w-3.5 bg-line-strong transition-[background-color] duration-fast ease-out group-hover/radio:bg-primary group-data-checked/radio:bg-primary group-aria-invalid/radio:bg-danger group-data-invalid/radio:bg-danger group-data-disabled/radio:bg-line group-data-disabled/radio:group-data-checked/radio:bg-off motion-reduce:transition-none"
      />
      <span
        aria-hidden
        className="ds-hex-mark h-3.5 w-3 bg-surface transition-[background-color] duration-fast ease-out group-data-checked/radio:bg-primary group-data-disabled/radio:group-data-checked/radio:bg-off motion-reduce:transition-none"
      />
      <BaseRadio.Indicator data-slot="radio-group-indicator" className="ds-hex-mark h-2 w-[7px] bg-surface" />
    </BaseRadio.Root>
  );
}

export { RadioGroup, RadioGroupItem };
