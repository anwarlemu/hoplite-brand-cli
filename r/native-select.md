# Native select
The browser's select dressed as the square field: a 32 percent edge on the ground, 14px ink and a 16px Phosphor caret in the quiet gray at the end; the open list is the platform's.

Install: npx hoplite-ds add native-select
Requires: theme, input, utils
Packages: @phosphor-icons/react
Exports: NativeSelect, NativeSelectOptGroup, NativeSelectOption
Client boundary: yes
Reference: Derived from the Hoplite website's lines and type, as Input is (the site has no fields)


## Usage
Use NativeSelect where the platform picker serves best: phones, long plain lists, forms that must work without script. Use Select for the brand's popup list. size="sm" is the 32px field.
- Avoid: A rounded or filled select
- Avoid: A bold caret
- Avoid: Options styled to imitate the brand's popup
- Avoid: A caret that turns or moves


## Examples
Example components: npx hoplite-ds add native-select
[Preview](https://hoplite-ds.vercel.app/preview/native-select/Preview) | [Groups](https://hoplite-ds.vercel.app/preview/native-select/Groups) | [States](https://hoplite-ds.vercel.app/preview/native-select/States)

examples/native-select.tsx

```tsx
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";

export function Preview() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="native-size" className="font-sans text-body-sm font-medium text-fg">
        Sandbox size
      </label>
      <NativeSelect id="native-size" defaultValue="standard" className="w-full">
        <NativeSelectOption value="small">Small, 1 vCPU, 4 GiB</NativeSelectOption>
        <NativeSelectOption value="standard">Standard, 2 vCPU, 8 GiB</NativeSelectOption>
        <NativeSelectOption value="large">Large, 8 vCPU, 32 GiB</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

export function Groups() {
  return (
    <NativeSelect defaultValue="sonnet" aria-label="Model">
      <NativeSelectOptGroup label="Fast">
        <NativeSelectOption value="haiku">Haiku</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Balanced">
        <NativeSelectOption value="sonnet">Sonnet</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Deep">
        <NativeSelectOption value="opus">Opus</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <NativeSelect size="sm" defaultValue="main" aria-label="Base branch">
        <NativeSelectOption value="main">main</NativeSelectOption>
        <NativeSelectOption value="develop">develop</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-invalid defaultValue="" aria-label="Region">
        <NativeSelectOption value="">Choose a region</NativeSelectOption>
        <NativeSelectOption value="us">US East</NativeSelectOption>
      </NativeSelect>
      <NativeSelect disabled defaultValue="team" aria-label="Plan">
        <NativeSelectOption value="team">Team plan</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

```

## Source

components/ui/native-select.tsx

```tsx
"use client";

import * as React from "react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

import { inputClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// The browser's own select dressed as the field (input.tsx): square, 40px, a 32 percent edge on the ground, 14px ink
// with 12px on the left and room on the right for a 16px Phosphor caret in the quiet gray, 12px from the edge. The edge
// turns strong under the pointer and the ink on focus; invalid takes the orange edge; disabled goes quiet with a slate
// caret. `size="sm"` is the 32px field. The open list is the platform's. Use it where the native picker is better
// (phones, long lists, forms without script); use Select for the brand's popup.
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" };

function NativeSelect({ className, size = "default", ...props }: NativeSelectProps) {
  return (
    <div data-slot="native-select-wrapper" data-size={size} className={cn("group/native-select relative w-fit", className)}>
      <select data-slot="native-select" data-size={size} className={cn(inputClassName, "cursor-pointer appearance-none pr-10 group-data-invalid/field:border-danger data-[size=sm]:h-8 pointer-coarse:data-[size=sm]:h-12")} {...props} />
      <CaretDownIcon aria-hidden data-slot="native-select-icon" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-muted group-has-[select:disabled]/native-select:text-fg-subtle" />
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-surface text-fg", className)} {...props} />;
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" className={cn("bg-surface text-fg", className)} {...props} />;
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };

```
