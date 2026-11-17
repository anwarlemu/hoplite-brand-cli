"use client";

import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A two-state key shaped like the site's nav item (.hn__top, the ghost key): a compact 32px hexagon with 8px cuts and
// 12px sides, its 14px medium label graphite until the pointer brings up a hexagon of the hover wash and turns it ink.
// Pressed, it is the chosen segment of the pricing switch (.pr-period__option:has(:checked)): a filled ink hexagon with
// the label in the ground color, graphite under the pointer. `outline` is the outlined hexagon (.button--line) that
// fills with the ink when pressed. `lg` is the 40px key with 12px cuts. Fills change in 160ms on the ease-out and the
// key never moves or resizes; it takes its pressed fill the instant it is pressed. Keyboard focus is the 2px ink outline
// around the key's box. Glyphs are 16px.
const toggleVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-sans text-body-sm leading-none font-medium whitespace-nowrap select-none transition-colors duration-base ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-disabled:pointer-events-none data-disabled:text-fg-subtle motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "text-fg-secondary hover:text-fg hover:before:bg-subtle-hover active:before:bg-pressed data-pressed:text-on-primary data-pressed:before:bg-primary data-pressed:hover:text-on-primary data-pressed:hover:before:bg-primary-hover data-disabled:data-pressed:before:bg-off",
        outline: "text-fg before:bg-line-strong after:bg-surface hover:after:bg-subtle-hover active:after:bg-pressed data-pressed:text-on-primary data-pressed:before:bg-primary data-pressed:after:bg-primary data-pressed:hover:before:bg-primary-hover data-pressed:hover:after:bg-primary-hover data-disabled:before:bg-line data-disabled:data-pressed:before:bg-off data-disabled:data-pressed:after:bg-off",
      },
      size: {
        default: "ds-hex-frame-s h-8 min-w-8 px-3",
        sm: "ds-hex-frame-s h-8 min-w-8 px-2",
        lg: "ds-hex-frame h-10 min-w-10 px-4",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Toggle({ className, variant, size, ...props }: React.ComponentProps<typeof BaseToggle> & VariantProps<typeof toggleVariants>) {
  return <BaseToggle data-slot="toggle" data-variant={variant ?? "default"} className={cn(toggleVariants({ variant, size }), className)} {...props} />;
}

export { Toggle, toggleVariants };
