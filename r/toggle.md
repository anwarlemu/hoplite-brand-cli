# Toggle
A two-state key shaped like the site's nav item: a compact 32px hexagon whose hover wash appears under the pointer; pressed, it is a filled ink hexagon with a ground-colored label. outline is the outlined hexagon that fills with the ink.

Install: npx hoplite-ds add toggle
Requires: theme, utils
Packages: @base-ui/react, class-variance-authority
Exports: Toggle, toggleVariants
Client boundary: yes
Reference: The Hoplite website's nav items (.hn__top), its outlined key (.button--line) and the chosen pricing period (.pr-period__option:has(:checked))


## Usage
Use Toggle for one on or off tool in a toolbar (watch a thread, bold). Give icon-only toggles an aria-label. For a set of related toggles use ToggleGroup; for a setting use Switch.
- Avoid: A square or rounded toggle
- Avoid: An orange pressed state
- Avoid: A toggle that scales on press
- Avoid: Bold labels when pressed


## Examples
Example components: npx hoplite-ds add toggle
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/toggle/Preview) | [Variants](https://hoplite-ds.vercel.app/preview/toggle/Variants) | [Sizes](https://hoplite-ds.vercel.app/preview/toggle/Sizes) | [States](https://hoplite-ds.vercel.app/preview/toggle/States)

examples/toggle.tsx

```tsx
import { EyeIcon, ListChecksIcon, PushPinIcon, TextBIcon, TextItalicIcon } from "@phosphor-icons/react/ssr";

import { Toggle } from "@/components/ui/toggle";

export function Preview() {
  return (
    <div className="flex items-center gap-1">
      <Toggle defaultPressed>
        <EyeIcon />
        Watch thread
      </Toggle>
      <Toggle>
        <PushPinIcon />
        Pin
      </Toggle>
    </div>
  );
}

export function Variants() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-1">
        <Toggle aria-label="Bold">
          <TextBIcon />
        </Toggle>
        <Toggle aria-label="Italic" defaultPressed>
          <TextItalicIcon />
        </Toggle>
        <Toggle>
          <ListChecksIcon />
          Checks only
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <Toggle variant="outline">Failing only</Toggle>
        <Toggle variant="outline" defaultPressed>
          Mine
        </Toggle>
      </div>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle size="sm" defaultPressed>
        Small
      </Toggle>
      <Toggle defaultPressed>Default</Toggle>
      <Toggle size="lg" variant="outline" defaultPressed>
        Large
      </Toggle>
    </div>
  );
}

export function States() {
  return (
    <div className="flex items-center gap-3">
      <Toggle disabled>Disabled</Toggle>
      <Toggle disabled defaultPressed>
        Disabled on
      </Toggle>
      <Toggle variant="outline" disabled>
        Disabled
      </Toggle>
    </div>
  );
}

```

## Source

components/ui/toggle.tsx

```tsx
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

```
