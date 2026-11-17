"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

// Extrapolated from the site's lines and marks (the site has no slider): a 1px track of the strong line, with the
// chosen range drawn over it as a 2px line of the ink, and a 16px point-up hexagon of the ink as the thumb (the
// site's hexagonal mark). The thumb follows the pointer without easing and never changes size or shape while dragged;
// under the pointer it turns graphite. Its box stays square, so keyboard focus is the 2px ink outline 2px out. Disabled,
// the range and thumb turn the off gray. Pass two values for a range; it reports every value as an array.
type SliderProps = Omit<React.ComponentProps<typeof BaseSlider.Root>, "onValueChange" | "onValueCommitted"> & {
  onValueChange?: (value: number[]) => void;
  onValueCommitted?: (value: number[]) => void;
};

const asArray = (value: number | readonly number[]) => (Array.isArray(value) ? [...value] : [value as number]);

function Slider({ className, defaultValue, value, min = 0, max = 100, onValueChange, onValueCommitted, "aria-label": ariaLabel, ...props }: SliderProps) {
  const values = React.useMemo(() => (value !== undefined ? asArray(value) : defaultValue !== undefined ? asArray(defaultValue) : [min]), [value, defaultValue, min]);
  return (
    <BaseSlider.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueChange={onValueChange ? (next) => onValueChange(asArray(next)) : undefined}
      onValueCommitted={onValueCommitted ? (next) => onValueCommitted(asArray(next)) : undefined}
      className={cn("group/slider relative w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto", className)}
      {...props}
    >
      <BaseSlider.Control
        data-slot="slider-control"
        className="relative flex w-full touch-none items-center py-2 select-none data-disabled:cursor-not-allowed data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-2 data-[orientation=vertical]:py-0"
      >
        <BaseSlider.Track
          data-slot="slider-track"
          className="relative before:absolute before:bg-line-strong data-[orientation=horizontal]:h-[2px] data-[orientation=horizontal]:w-full data-[orientation=horizontal]:before:inset-x-0 data-[orientation=horizontal]:before:bottom-0 data-[orientation=horizontal]:before:h-px data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[2px] data-[orientation=vertical]:before:inset-y-0 data-[orientation=vertical]:before:left-0 data-[orientation=vertical]:before:w-px"
        >
          <BaseSlider.Indicator data-slot="slider-range" className="bg-primary data-disabled:bg-off" />
          {values.map((_, index) => (
            <BaseSlider.Thumb
              data-slot="slider-thumb"
              key={index}
              index={index}
              aria-label={ariaLabel ?? (values.length > 1 ? (index === 0 ? "Minimum" : "Maximum") : undefined)}
              className="group/thumb grid size-4 cursor-grab place-items-center select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring data-dragging:cursor-grabbing data-disabled:cursor-not-allowed"
            >
              <span aria-hidden className="ds-hex-mark h-4 w-3.5 bg-primary transition-[background-color] duration-fast ease-out group-hover/thumb:bg-primary-hover group-data-disabled/thumb:bg-off motion-reduce:transition-none" />
            </BaseSlider.Thumb>
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

export { Slider };
