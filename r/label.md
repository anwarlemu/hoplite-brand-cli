# Label
A field's label: 14px Satoshi medium in the ink, above its field or 8px beside a check, radio or switch; a required mark in orange; the slate when its control is disabled.

Install: npx hoplite-ds add label
Requires: theme, utils
Packages: none
Exports: Label
Client boundary: yes
Reference: Extrapolated from the Hoplite website: its 14px medium control type (.button labels, .pr-period__option) and the principles' 14px medium labels above fields


## Usage
Use Label to name a control: above an Input, or wrapping (or htmlFor-paired with) a Checkbox, RadioGroupItem or Switch. Inside a Field use FieldLabel, which wires itself to the control. Mark a required field with a span data-slot="label-required".
- Avoid: Caps or Kode Mono labels on fields
- Avoid: Bold labels
- Avoid: A placeholder in place of a label
- Avoid: An orange label on an invalid field


## Examples
Example components: npx hoplite-ds add label checkbox input
[Preview](https://hoplite-ds.vercel.app/preview/label/Preview) | [WithControl](https://hoplite-ds.vercel.app/preview/label/WithControl) | [States](https://hoplite-ds.vercel.app/preview/label/States)

examples/label.tsx

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Preview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="label-repo">Repository</Label>
      <Input id="label-repo" placeholder="acme/payments-api" />
    </div>
  );
}

export function WithControl() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="label-ci" defaultChecked />
      <Label htmlFor="label-ci">Run checks on every pull request</Label>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <div className="grid gap-2">
        <Label htmlFor="label-name">
          Sandbox name <span aria-hidden data-slot="label-required">*</span>
        </Label>
        <Input id="label-name" required placeholder="payments-staging" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="label-off" disabled />
        <Label htmlFor="label-off">Allow agents to merge (Team plan)</Label>
      </div>
    </div>
  );
}

```

## Source

components/ui/label.tsx

```tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// A field's label as the site's principles set it: 14px Satoshi medium in the ink on a 20px line, above its field or
// 8px beside a check, radio or switch. A required mark inside it (`<span aria-hidden>*</span>` with
// data-slot="label-required") is the orange. When its field or its peer control is disabled the label turns the slate.
// The site has no form labels: this is extrapolated from its 14px medium control type.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 font-sans text-body-sm leading-line-body-sm font-medium text-fg select-none *:data-[slot=label-required]:-ml-1 *:data-[slot=label-required]:text-danger group-data-disabled/field:pointer-events-none group-data-disabled/field:text-fg-subtle peer-disabled:cursor-not-allowed peer-disabled:text-fg-subtle peer-data-disabled:cursor-not-allowed peer-data-disabled:text-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}

export { Label };

```
