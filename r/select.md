# Select
The square 40px field with a caret, opening the site's popup: a square panel of the ground with a hairline and a long soft cast, 36px rows, the highlighted row on the hover wash and a check at the end of the chosen one. A long list fades at the edge it scrolls past (fade-y).

Install: npx hoplite-ds add select
Requires: theme, surface, utils
Packages: @base-ui/react, @phosphor-icons/react
Exports: Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue
Client boundary: yes
Reference: Extrapolated from the Hoplite website: the field lines and 14px controls, and the nav popup (.hn__panel, .hn__item: rows on the hover wash, the quiet hairline)


## Usage
Use to choose one value from five to about fifteen (a model, a sandbox size, a base branch). Give it a label or aria-label and a placeholder when nothing is chosen; group long lists with SelectGroup and SelectLabel. Pass items (value and label) to Select, or write SelectItems as children and the trigger shows the chosen label. Give it a name so its value is in the form's FormData; size="sm" is the 32px toolbar field. Built on Base UI Select.
- Avoid: Rounded corners on the trigger or the list
- Avoid: A check at the start of a row
- Avoid: Animating the highlight between rows
- Avoid: An orange chosen row
- Avoid: A white list on the gray ground


## Examples
Example components: npx hoplite-ds add select button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/select/Preview) | [Grouped](https://hoplite-ds.vercel.app/preview/select/Grouped) | [States](https://hoplite-ds.vercel.app/preview/select/States)

examples/select.tsx

```tsx
"use client";

import * as React from "react";
import { CloudIcon, CpuIcon, DesktopTowerIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

const MODELS = [
  { value: "auto", label: "Auto" },
  { value: "opus", label: "Claude Opus" },
  { value: "sonnet", label: "Claude Sonnet" },
  { value: "gpt", label: "GPT-5 Codex" },
];

export function Preview() {
  const [model, setModel] = React.useState("auto");
  const [saved, setSaved] = React.useState<string>();
  return (
    <form
      className="grid w-full max-w-sm gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("model")));
      }}
    >
      <label id="model-label" className="text-body-sm font-medium text-fg">
        Default model
      </label>
      <Select name="model" items={MODELS} value={model} onValueChange={(next) => setModel(String(next))}>
        <SelectTrigger aria-labelledby="model-label">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-body-sm text-fg-muted">New threads start on this model.</p>
      <div className="mt-2 flex items-center gap-4">
        <Button type="submit">Save</Button>
        <p aria-live="polite" className="text-body-sm text-fg-muted">
          {saved ? `Saved: ${saved}` : ""}
        </p>
      </div>
    </form>
  );
}

export function Grouped() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label id="sandbox-label" className="text-body-sm font-medium text-fg">
        Sandbox size
      </label>
      <Select defaultValue={null}>
        <SelectTrigger aria-labelledby="sandbox-label">
          <SelectValue placeholder="Choose a size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cloud</SelectLabel>
            <SelectItem value="s">
              <CloudIcon /> 2 vCPU, 8 GiB
            </SelectItem>
            <SelectItem value="m">
              <CloudIcon /> 8 vCPU, 32 GiB
            </SelectItem>
            <SelectItem value="l" disabled>
              <CpuIcon /> 16 vCPU, 64 GiB (Team)
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Local</SelectLabel>
            <SelectItem value="local">
              <DesktopTowerIcon /> This Mac
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Select defaultValue="main">
        <SelectTrigger size="sm" aria-label="Base branch" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main">main</SelectItem>
          <SelectItem value="develop">develop</SelectItem>
          <SelectItem value="release">release/1.4</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={null}>
        <SelectTrigger aria-label="Reviewer" aria-invalid>
          <SelectValue placeholder="Choose a reviewer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="maya">Maya</SelectItem>
          <SelectItem value="lead">Platform lead</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="weekly" disabled>
        <SelectTrigger aria-label="Report">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Weekly usage report</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

```

## Source

components/ui/select.tsx

```tsx
"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react/ssr";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A choice drawn as the site would draw one (it has no selects): the trigger is the field, square and 40px, a 32
// percent edge on the ground, the value in 14px ink 12px in (the placeholder in the slate) and a 16px caret in the quiet
// gray 12px from the right. The edge turns strong under the pointer and while the list is open, and the ink on focus
// (2px with the inset outline). The list is the site's popup, 4px below: a square panel of the ground with the quiet
// hairline and the long soft cast, at least the trigger's width, 4px inside. Rows are 36px with 12px sides, 14px ink;
// the highlighted row takes the hover wash at once (it follows the keys) and the chosen row ends in a 16px check. Group
// heads are Kode Mono labels. The list grows from the trigger (opacity and 98 percent scale, 240ms on the strong
// ease-out) and leaves in 200ms. `sm` is the 32px toolbar field.

type SelectProps<Value, Multiple extends boolean | undefined = false> = BaseSelect.Root.Props<Value, Multiple>;
type ItemLabel = { value: unknown; label: React.ReactNode };

/** The SelectItems written as children, so the trigger can show a chosen item's label without an `items` prop. */
function collectItems(children: React.ReactNode, out: ItemLabel[] = []) {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ value?: unknown; children?: React.ReactNode }>(child)) return;
    if (child.type === SelectItem) out.push({ value: child.props.value, label: child.props.children });
    else if (child.props.children) collectItems(child.props.children, out);
  });
  return out;
}

function Select<Value, Multiple extends boolean | undefined = false>({ items, children, ...props }: SelectProps<Value, Multiple>) {
  const collected = React.useMemo(() => (items ? undefined : collectItems(children)), [items, children]);
  return (
    <BaseSelect.Root items={items ?? (collected?.length ? (collected as ReadonlyArray<{ value: Value; label: React.ReactNode }>) : undefined)} {...props}>
      {children}
    </BaseSelect.Root>
  );
}

function SelectGroup({ className, ...props }: React.ComponentProps<typeof BaseSelect.Group>) {
  return <BaseSelect.Group data-slot="select-group" className={cn("flex flex-col", className)} {...props} />;
}

function SelectValue({ className, ...props }: React.ComponentProps<typeof BaseSelect.Value>) {
  return <BaseSelect.Value data-slot="select-value" className={cn("flex min-w-0 flex-1 items-center gap-2 truncate text-left", className)} {...props} />;
}

const TRIGGER =
  "group/select-trigger flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 border border-line-field bg-transparent px-3 font-sans text-body-sm leading-line-body-sm font-normal whitespace-nowrap text-fg select-none transition-[border-color] duration-fast ease-out hover:border-line-strong focus-visible:border-focus-ring focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring data-popup-open:border-line-strong aria-invalid:border-danger data-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:text-fg-subtle data-placeholder:text-fg-subtle motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

function SelectTrigger({ className, size = "default", children, ...props }: React.ComponentProps<typeof BaseSelect.Trigger> & { size?: "sm" | "default" }) {
  return (
    <BaseSelect.Trigger data-slot="select-trigger" data-size={size} className={cn(TRIGGER, size === "sm" ? "h-8" : "h-10 pointer-coarse:h-12", className)} {...props}>
      {children}
      <BaseSelect.Icon data-slot="select-icon" className="flex text-fg-muted group-data-disabled/select-trigger:text-fg-subtle">
        <CaretDownIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

const POPUP =
  "flex max-h-(--available-height) max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-hidden bg-surface text-fg shadow-floating outline-none transition-[opacity,scale] duration-slow ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-moderate motion-reduce:transition-[opacity]";

type SelectContentProps = React.ComponentProps<typeof BaseSelect.Popup> &
  Pick<React.ComponentProps<typeof BaseSelect.Positioner>, "side" | "sideOffset" | "align" | "alignOffset" | "alignItemWithTrigger"> & {
    /** Radix's name for the placement; "item-aligned" overlaps the trigger so the chosen row sits on it. */
    position?: "popper" | "item-aligned";
  };

function SelectContent({ className, children, side = "bottom", sideOffset = 4, align = "start", alignOffset = 0, alignItemWithTrigger, position = "popper", ...props }: SelectContentProps) {
  const container = usePortalContainer();
  return (
    <BaseSelect.Portal container={container}>
      <BaseSelect.Positioner side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} alignItemWithTrigger={alignItemWithTrigger ?? position === "item-aligned"} className="z-50 outline-none select-none">
        <BaseSelect.Popup data-slot="select-content" className={cn(POPUP, className)} {...props}>
          <SelectScrollUpButton />
          <BaseSelect.List data-slot="select-list" className="max-h-80 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1 fade-y">
            {children}
          </BaseSelect.List>
          <SelectScrollDownButton />
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return <BaseSelect.GroupLabel data-slot="select-label" className={cn("ds-label flex h-8 items-center px-3 select-none", className)} {...props} />;
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        "relative flex h-9 w-full shrink-0 cursor-default items-center gap-2 px-3 font-sans text-body-sm leading-line-body-sm font-normal text-fg outline-none select-none data-disabled:pointer-events-none data-disabled:text-fg-subtle data-highlighted:bg-subtle-hover pointer-coarse:h-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-fg-muted",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText data-slot="select-item-text" className="flex min-w-0 flex-1 items-center gap-2 truncate">
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator data-slot="select-item-indicator" className="flex shrink-0">
        <CheckIcon className="text-fg" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof BaseSelect.Separator>) {
  return <BaseSelect.Separator data-slot="select-separator" className={cn("pointer-events-none -mx-1 my-1 h-px shrink-0 bg-line", className)} {...props} />;
}

const ARROW = "flex h-6 w-full shrink-0 cursor-default items-center justify-center bg-surface text-fg-muted [&_svg]:size-4";

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof BaseSelect.ScrollUpArrow>) {
  return (
    <BaseSelect.ScrollUpArrow data-slot="select-scroll-up-button" className={cn(ARROW, className)} {...props}>
      <CaretUpIcon />
    </BaseSelect.ScrollUpArrow>
  );
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof BaseSelect.ScrollDownArrow>) {
  return (
    <BaseSelect.ScrollDownArrow data-slot="select-scroll-down-button" className={cn(ARROW, className)} {...props}>
      <CaretDownIcon />
    </BaseSelect.ScrollDownArrow>
  );
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };

```
