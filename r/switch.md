# Switch
The product's switch from the site's app demo: a 28 by 16 rounded track in the off gray that turns orange when on, with a 12px knob of the ground that slides 12px. sm is the 20 by 12 switch.

Install: npx hoplite-ds add switch
Requires: theme, utils
Packages: @base-ui/react
Exports: Switch
Client boundary: yes
Reference: The Hoplite website's app demo switches (.pa-sw: 28 by 16, radius 8px, a 12px --day knob 2px in, --orange when on; .tt-sw: 20 by 12 with an 8px knob)


## Usage
Use Switch for a setting that applies at once (auto-merge, notifications). Put it at the end of a setting row with the setting's name, or wrap it with its label in a Label. For a choice saved with a form use Checkbox.
- Avoid: A square or hexagonal track
- Avoid: A track in any on color but the orange
- Avoid: A knob with a drop shadow
- Avoid: A switch that applies only on submit


## Examples
Example components: npx hoplite-ds add switch label surface
[Preview](https://hoplite-ds.vercel.app/preview/switch/Preview) | [States](https://hoplite-ds.vercel.app/preview/switch/States) | [Sizes](https://hoplite-ds.vercel.app/preview/switch/Sizes) | [Settings](https://hoplite-ds.vercel.app/preview/switch/Settings)

examples/switch.tsx

```tsx
import { Label } from "@/components/ui/label";
import { Surface } from "@/lib/surface";
import { Switch } from "@/components/ui/switch";

export function Preview() {
  return (
    <Label>
      <Switch defaultChecked />
      Auto-merge green pull requests
    </Label>
  );
}

export function States() {
  return (
    <div className="grid gap-4">
      <Label>
        <Switch />
        Off
      </Label>
      <Label>
        <Switch defaultChecked />
        On
      </Label>
      <Label>
        <Switch disabled />
        Disabled
      </Label>
      <Label>
        <Switch disabled defaultChecked />
        Disabled on
      </Label>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="grid gap-4">
      <Label>
        <Switch size="sm" defaultChecked />
        Small
      </Label>
      <Label>
        <Switch defaultChecked />
        Default
      </Label>
    </div>
  );
}

export function Settings() {
  const rows = [
    { name: "Run checks on agent branches", on: true },
    { name: "Post summaries in the thread", on: true },
    { name: "Share sandboxes with the team", on: false },
  ];
  return (
    <Surface ground="night" className="w-full max-w-md p-6">
      <ul className="divide-y divide-line">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-4 py-3">
            <span className="text-body-sm text-fg-secondary">{row.name}</span>
            <Switch defaultChecked={row.on} aria-label={row.name} />
          </li>
        ))}
      </ul>
    </Surface>
  );
}

```

## Source

components/ui/switch.tsx

```tsx
"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

// The product's switch from the site's app demo (.pa-sw): a 28 by 16 rounded track (one of the few round things) in the
// off gray, the orange when on, holding a 12px light knob (the site.s --day, the same in both themes) 2px in that travels 12px. `size="sm"` is the
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
        className="pointer-events-none block rounded-pill bg-white transition-[translate] duration-base ease-in-out group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2 data-checked:translate-x-3 group-data-[size=sm]/switch:data-checked:translate-x-2 motion-reduce:transition-none"
      />
    </BaseSwitch.Root>
  );
}

export { Switch };

```
