"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, slot } from "@/lib/utils";

// The site's keys (button, button--primary, button--line, button--s). Every key is a hexagon: a 40px box with its ends
// cut 12px to a point, drawn behind the label so the key itself stays a box that takes the focus outline. The main
// action is the ink hexagon with a 14px medium ground-colored label 24px in from each side (Start building); under the
// pointer it turns graphite. `outline` is the same hexagon drawn as a 1px line of the strong edge around the ground
// (Download for macOS), filling with the hover wash. `secondary` is a hexagon of the hover wash, `ghost` a bare label
// whose compact hexagon of the wash appears under the pointer (the nav's items), `link` the underlined text link.
// `sm` is the 32px key with 8px cuts and 16px sides (the header's). Every key presses in to 0.97 at once; on a coarse
// pointer keys grow to 48px. A disabled key turns the off gray with a quiet label.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-sans text-body-sm leading-none font-medium whitespace-nowrap select-none transition-[color,scale] duration-base ease-out active:scale-97 data-disabled:pointer-events-none data-disabled:text-fg-subtle motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "ds-hex-frame text-on-primary before:bg-primary hover:before:bg-primary-hover active:before:bg-primary-hover data-disabled:before:bg-off",
        outline: "ds-hex-frame text-fg before:bg-line-strong after:bg-surface hover:after:bg-subtle-hover active:after:bg-pressed data-disabled:before:bg-line",
        secondary: "ds-hex-frame text-fg before:bg-subtle-hover hover:before:bg-pressed active:before:bg-pressed data-disabled:before:bg-subtle",
        destructive: "ds-hex-frame text-white before:bg-danger hover:before:bg-danger-strong active:before:bg-danger-strong data-disabled:before:bg-off",
        ghost: "ds-hex-frame-s font-normal text-fg-secondary hover:text-fg hover:before:bg-subtle-hover active:before:bg-pressed aria-expanded:text-fg aria-expanded:before:bg-subtle-hover data-popup-open:text-fg data-popup-open:before:bg-subtle-hover",
        link: "h-auto px-0 text-fg underline decoration-line decoration-1 underline-offset-4 transition-[text-decoration-color,scale] hover:decoration-current",
      },
      size: {
        default: "h-10 px-6 pointer-coarse:h-12",
        sm: "ds-hex-frame-s h-8 px-4",
        lg: "h-12 px-8",
        icon: "size-10 px-0",
        "icon-sm": "ds-hex-frame-s size-8 px-0",
        "icon-lg": "size-12 px-0 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [
      { variant: "ghost", size: "default", className: "h-8 px-3 pointer-coarse:h-11" },
      { variant: "link", className: "h-auto px-0" },
    ],
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = Omit<React.ComponentProps<typeof BaseButton>, "className"> & VariantProps<typeof buttonVariants> & { className?: string; asChild?: boolean };

function Button({ className, variant, size, asChild = false, render, children, type, ...props }: ButtonProps) {
  const parts = slot(asChild, children, render);
  const native = !parts.render;
  return (
    <BaseButton
      data-slot="button"
      data-variant={variant ?? "default"}
      nativeButton={native}
      type={native ? (type ?? "button") : type}
      render={parts.render}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {parts.children}
    </BaseButton>
  );
}

export { Button, buttonVariants };
