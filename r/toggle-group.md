# Toggle group
Segmented toggles: an outlined hexagon holding compact hexagons with the chosen one filled ink (the pricing period switch), or joined square boxes with the chosen ones filled ink (the changelog filter).

Install: npx hoplite-ds add toggle-group
Requires: theme, utils
Packages: @base-ui/react
Exports: ToggleGroup, ToggleGroupItem
Client boundary: yes
Reference: The Hoplite website's pricing period switch (.pr-period, .pr-period__option) and changelog filter (.cl-filter, .cl-filter__option)


## Usage
Use ToggleGroup for a set of related toggles: type="single" (the default) for one choice that changes a view in place, type="multiple" for filters that combine. Use variant="outline" for filter rows and icon toolbars. To switch between panels of content use Tabs.
- Avoid: A rounded track
- Avoid: Separate floating keys in the default variant
- Avoid: An orange chosen state
- Avoid: A chosen key that grows or bolds


## Examples
Example components: npx hoplite-ds add toggle-group
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/toggle-group/Preview) | [Outline](https://hoplite-ds.vercel.app/preview/toggle-group/Outline) | [Icons](https://hoplite-ds.vercel.app/preview/toggle-group/Icons) | [States](https://hoplite-ds.vercel.app/preview/toggle-group/States)

examples/toggle-group.tsx

```tsx
"use client";

import * as React from "react";
import { DesktopIcon, DeviceMobileIcon, TextBIcon, TextItalicIcon, TextUnderlineIcon } from "@phosphor-icons/react/ssr";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Preview() {
  const [period, setPeriod] = React.useState("monthly");
  return (
    <ToggleGroup value={period} onValueChange={(value) => value && setPeriod(value)} aria-label="Billing period">
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
      <ToggleGroupItem value="yearly">Yearly, save 17%</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function Outline() {
  return (
    <ToggleGroup variant="outline" type="multiple" defaultValue={["features", "fixes"]} aria-label="Show">
      <ToggleGroupItem value="features">Features</ToggleGroupItem>
      <ToggleGroupItem value="fixes">Fixes</ToggleGroupItem>
      <ToggleGroupItem value="agents">Agents</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function Icons() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ToggleGroup defaultValue="desktop" aria-label="Preview">
        <ToggleGroupItem value="desktop" aria-label="Desktop">
          <DesktopIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="phone" aria-label="Phone">
          <DeviceMobileIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline" type="multiple" defaultValue={["bold"]} aria-label="Formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <TextBIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <TextItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <TextUnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function States() {
  return (
    <div className="grid gap-4">
      <ToggleGroup defaultValue="all" disabled aria-label="Disabled">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="open">Open</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline" size="lg" defaultValue="week" aria-label="Range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

```

## Source

components/ui/toggle-group.tsx

```tsx
"use client";

import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";

import { cn } from "@/lib/utils";

// The site's two segmented choices, as toggles. `default` is the pricing period switch (.pr-period): an outlined
// hexagon (the strong line around the ground) 4px around compact hexagons, 32px tall with 8px cuts and 20px sides; the
// chosen one is a filled ink hexagon with its 14px medium label in the ground color, the others quiet until the pointer
// turns them ink. `outline` is the changelog filter (.cl-filter): joined square 32px boxes with 12px sides on the quiet
// rule, the chosen one filled ink. Choosing is instant in place (several may be on, so nothing slides); fills and label
// colors change in 160ms on the ease-out. Keyboard focus is the 2px ink outline 2px out. `type="single"` (the default)
// takes and reports one value as a string, `type="multiple"` an array. `lg` makes the keys 40px.
type Variant = "default" | "outline";
type Size = "default" | "sm" | "lg";
const ToggleGroupContext = React.createContext<{ variant: Variant; size: Size; spacing: number }>({ variant: "default", size: "default", spacing: 0 });

type Single = { type?: "single"; value?: string; defaultValue?: string; onValueChange?: (value: string) => void };
type Multiple = { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void };
type ToggleGroupProps = Omit<React.ComponentProps<typeof BaseToggleGroup>, "value" | "defaultValue" | "onValueChange" | "multiple"> & { variant?: Variant; size?: Size; spacing?: number } & (Single | Multiple);

const toArray = (value: string | string[] | undefined) => (value === undefined ? undefined : Array.isArray(value) ? value : value ? [value] : []);

function ToggleGroup({ className, variant = "default", size = "default", spacing = 0, orientation = "horizontal", children, type, value, defaultValue, onValueChange, style, ...props }: ToggleGroupProps) {
  const multiple = type === "multiple";
  const emit = onValueChange as ((value: string | string[]) => void) | undefined;
  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      orientation={orientation}
      multiple={multiple}
      value={toArray(value)}
      defaultValue={toArray(defaultValue)}
      onValueChange={emit ? (next) => emit(multiple ? (next as string[]) : ((next as string[])[0] ?? "")) : undefined}
      style={{ ...(typeof style === "object" ? style : null), "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit max-w-full items-center gap-[calc(var(--spacing)*var(--gap))] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        variant === "default" && "ds-hex-frame p-1 before:bg-line-strong after:bg-surface data-disabled:before:bg-line",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>{children}</ToggleGroupContext.Provider>
    </BaseToggleGroup>
  );
}

type ToggleGroupItemProps = React.ComponentProps<typeof BaseToggle> & { variant?: Variant; size?: Size };

function ToggleGroupItem({ className, variant, size, ...props }: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  const v = variant ?? context.variant;
  const s = size ?? context.size;
  return (
    <BaseToggle
      data-slot="toggle-group-item"
      data-variant={v}
      data-size={s}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-sans text-body-sm leading-none font-medium whitespace-nowrap text-fg-muted select-none transition-colors duration-base ease-out hover:text-fg focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-pressed:text-on-primary data-pressed:hover:text-on-primary data-disabled:pointer-events-none data-disabled:text-fg-faint motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        v === "default" && "data-pressed:before:bg-primary data-disabled:data-pressed:before:bg-off",
        v === "default" && (s === "lg" ? "ds-hex-frame h-10 min-w-10 px-6" : s === "sm" ? "ds-hex-frame-s h-8 min-w-8 px-3" : "ds-hex-frame-s h-8 min-w-8 px-5"),
        v === "outline" && "border border-line data-pressed:border-primary data-pressed:bg-primary data-disabled:data-pressed:border-off data-disabled:data-pressed:bg-off",
        v === "outline" && context.spacing === 0 && "-ml-px first:ml-0 group-data-[orientation=vertical]/toggle-group:ml-0 group-data-[orientation=vertical]/toggle-group:-mt-px group-data-[orientation=vertical]/toggle-group:first:mt-0",
        v === "outline" && (s === "lg" ? "h-10 min-w-10 px-4" : s === "sm" ? "h-8 min-w-8 px-2" : "h-8 min-w-8 px-3"),
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };

```
