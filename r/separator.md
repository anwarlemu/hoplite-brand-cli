# Separator
The site's rules: a quiet 16 percent 1px line, or the section guide's dashes (10px on an 18px period), across or down.

Install: npx hoplite-ds add separator
Requires: theme, utils
Packages: @base-ui/react
Exports: Separator
Client boundary: yes
Reference: The Hoplite website's quiet rules (--line-quiet under the header and between FAQ rows) and dashed guides (--rule-dash-y, .pr-plan__mark)


## Usage
Use Separator between groups in a list, a menu or a toolbar, and the dashed variant for a guide inside a band or between plans. Rules are decorative unless decorative={false}.
- Avoid: A heavy or dark rule
- Avoid: A colored rule
- Avoid: Rules around every row where a list already rules them


## Examples
Example components: npx hoplite-ds add separator
[Preview](https://hoplite-ds.vercel.app/preview/separator/Preview) | [Dashed](https://hoplite-ds.vercel.app/preview/separator/Dashed)

examples/separator.tsx

```tsx
import { Separator } from "@/components/ui/separator";

export function Preview() {
  return (
    <div className="max-w-sm">
      <p className="text-body-sm leading-line-body-sm font-medium text-fg">acme/storefront</p>
      <p className="text-body-sm leading-line-body-sm text-fg-muted">3 threads running, 12 merged this week</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-body-sm leading-line-body-sm text-fg-secondary">
        <span>Threads</span>
        <Separator orientation="vertical" />
        <span>Sandboxes</span>
        <Separator orientation="vertical" />
        <span>Automations</span>
      </div>
    </div>
  );
}

export function Dashed() {
  return (
    <div className="grid max-w-md gap-6">
      <Separator variant="dashed" />
      <div className="flex h-16 items-stretch gap-6 text-body-sm leading-line-body-sm text-fg-secondary">
        <span className="self-center">Free</span>
        <Separator variant="dashed" orientation="vertical" />
        <span className="self-center">Team</span>
        <Separator variant="dashed" orientation="vertical" />
        <span className="self-center">Enterprise</span>
      </div>
    </div>
  );
}

```

## Source

components/ui/separator.tsx

```tsx
"use client";

import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

// The site's rules: a quiet 16 percent 1px line between rows and under the header, or (`dashed`) the section guide's
// dashes, 10px on an 18px period (ds-rule-x across, ds-rule-y down). Horizontal by default; vertical rules stretch to
// the row. Decorative rules are hidden from assistive tech, as shadcn's are.
type SeparatorProps = Omit<React.ComponentProps<typeof BaseSeparator>, "orientation"> & { orientation?: "horizontal" | "vertical"; decorative?: boolean; variant?: "solid" | "dashed" };

function Separator({ className, orientation = "horizontal", decorative = true, variant = "solid", ...props }: SeparatorProps) {
  return (
    <BaseSeparator
      data-slot="separator"
      data-variant={variant}
      orientation={orientation}
      role={decorative ? "none" : undefined}
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        variant === "solid" ? "bg-line" : orientation === "horizontal" ? "ds-rule-x" : "ds-rule-y",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };

```
