# Button
The hexagonal key: the 40px ink hexagon for the main action, the outlined hexagon for the second, a hexagon of the hover wash, a bare nav label whose compact hexagon appears under the pointer, and the underlined link. 32px keys cut their ends 8px; a key takes its pressed fill the instant it is pressed.

Install: npx hoplite-ds add button
Requires: theme, utils
Packages: @base-ui/react, class-variance-authority
Exports: Button, buttonVariants
Client boundary: yes
Reference: The Hoplite website's .button, .button--primary, .button--line and .button--s (hoplite-website-fawn.vercel.app: Start building, Download for macOS, Start team, Start free) and its nav items (.hn__top)


## Usage
Use one default (ink hexagon) button per view for the main action (Start building), outline for the action beside it (Download for macOS), secondary for a quieter action inside content, ghost for nav items and toolbar glyphs, and link for an inline action in text. size sm is the 32px header key. Use type="submit" in forms, or asChild (or render) with a link for navigation. A glyph goes before the label at 16px (Phosphor, regular weight).
- Avoid: Two ink hexagons side by side
- Avoid: A rounded or square key
- Avoid: An orange fill
- Avoid: Bold or caps labels
- Avoid: An icon that moves on hover
- Avoid: A half-opacity disabled key


## Examples
Example components: npx hoplite-ds add button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/button/Preview) | [Variants](https://hoplite-ds.vercel.app/preview/button/Variants) | [Sizes](https://hoplite-ds.vercel.app/preview/button/Sizes) | [States](https://hoplite-ds.vercel.app/preview/button/States)

examples/button.tsx

```tsx
import { AppleLogoIcon, ArrowRightIcon, GearSixIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Start building</Button>
      <Button variant="outline">
        <AppleLogoIcon weight="fill" />
        Download for macOS
      </Button>
    </div>
  );
}

export function Variants() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Start team</Button>
        <Button variant="outline">Start free</Button>
        <Button variant="secondary">
          <PlusIcon />
          New thread
        </Button>
        <Button variant="destructive">
          <TrashIcon />
          Delete sandbox
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Button variant="ghost">Product</Button>
        <Button variant="ghost">Pricing</Button>
        <Button variant="ghost" size="icon-sm" aria-label="Settings">
          <GearSixIcon />
        </Button>
        <Button variant="link">
          Read the quickstart
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Start building</Button>
      <Button>Start building</Button>
      <Button size="lg">Start building</Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Start building</Button>
      <Button variant="outline" disabled>
        Start free
      </Button>
      <Button asChild variant="outline">
        <a href="#pricing">See pricing</a>
      </Button>
    </div>
  );
}

```

## Source

components/ui/button.tsx

```tsx
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
// `sm` is the 32px key with 8px cuts and 16px sides (the header's). A pressed key takes its pressed fill at once; on a coarse
// pointer keys grow to 48px. A disabled key turns the off gray with a quiet label.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-sans text-body-sm leading-none font-medium whitespace-nowrap select-none transition-colors duration-base ease-out data-disabled:pointer-events-none data-disabled:text-fg-subtle motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "ds-hex-frame text-on-primary before:bg-primary hover:before:bg-primary-hover active:before:bg-primary-hover data-disabled:before:bg-off",
        outline: "ds-hex-frame text-fg before:bg-line-strong after:bg-surface hover:after:bg-subtle-hover active:after:bg-pressed data-disabled:before:bg-line",
        secondary: "ds-hex-frame text-fg before:bg-subtle-hover hover:before:bg-pressed active:before:bg-pressed data-disabled:before:bg-subtle",
        destructive: "ds-hex-frame text-white before:bg-danger hover:before:bg-danger-strong active:before:bg-danger-strong data-disabled:before:bg-off",
        ghost: "ds-hex-frame-s font-normal text-fg-secondary hover:text-fg hover:before:bg-subtle-hover active:before:bg-pressed aria-expanded:text-fg aria-expanded:before:bg-subtle-hover data-popup-open:text-fg data-popup-open:before:bg-subtle-hover",
        link: "h-auto px-0 text-fg underline decoration-line decoration-1 underline-offset-4 transition-[text-decoration-color] hover:decoration-current",
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

```
