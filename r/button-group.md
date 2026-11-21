# Button Group
Keys joined into one control: one hexagon cut into segments with square joins. The split key is one ink hexagon with a hairline between the action and its caret; outlined keys share their strong edges like a segmented choice; a field can open a group and the key after it squares off to meet it.

Install: npx hoplite-ds add button-group
Requires: theme, utils
Packages: @base-ui/react, class-variance-authority
Exports: ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants
Client boundary: yes
Reference: The Hoplite website's product window split key (.pa-merge, .pa-merge__main, .pa-merge__more: Squash and merge) redrawn on its hexagonal keys (.button, .button--primary, .button--line), and its segmented choice (.pr-period)


## Usage
Use a ButtonGroup for a split action (Squash and merge with a caret for the other merge methods: Button, ButtonGroupSeparator, an icon Button), for two to four related outlined actions, for a stepper (minus, ButtonGroupText with the count, plus), or for a field with its action (Input then an outline Button). Keep every key in a group the same variant and size. orientation="vertical" stacks whole keys 4px apart.
- Avoid: Mixing ink and outlined keys in one group
- Avoid: Two ink groups in a view
- Avoid: Hexagon points between joined keys
- Avoid: Square or rounded segments at the ends


## Examples
Example components: npx hoplite-ds add button-group button input
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/button-group/Preview) | [Outline](https://hoplite-ds.vercel.app/preview/button-group/Outline) | [WithField](https://hoplite-ds.vercel.app/preview/button-group/WithField) | [Sizes](https://hoplite-ds.vercel.app/preview/button-group/Sizes)

examples/button-group.tsx

```tsx
import { CaretDownIcon, CopyIcon, DotsThreeIcon, GitMergeIcon, MinusIcon, PlusIcon, TerminalWindowIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

export function Preview() {
  return (
    <ButtonGroup aria-label="Merge the pull request">
      <Button className="pl-8">
        <GitMergeIcon />
        Squash and merge
      </Button>
      <ButtonGroupSeparator />
      <Button size="icon" className="w-12" aria-label="More merge options">
        <CaretDownIcon />
      </Button>
    </ButtonGroup>
  );
}

export function Outline() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ButtonGroup aria-label="Branch actions">
        <Button variant="outline">
          <CopyIcon />
          Copy branch
        </Button>
        <Button variant="outline">
          <TerminalWindowIcon />
          Terminal
        </Button>
        <Button variant="outline" size="icon" aria-label="More branch actions">
          <DotsThreeIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Seats">
        <Button variant="outline" size="icon" aria-label="Remove a seat">
          <MinusIcon />
        </Button>
        <ButtonGroupText className="min-w-24 justify-center text-fg">4 seats</ButtonGroupText>
        <Button variant="outline" size="icon" aria-label="Add a seat">
          <PlusIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export function WithField() {
  return (
    <ButtonGroup className="w-full max-w-md">
      <Input aria-label="Email to invite" placeholder="maya@acme.dev" />
      <Button variant="outline">Invite</Button>
    </ButtonGroup>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ButtonGroup aria-label="Run the agent">
        <Button size="sm">Run agent</Button>
        <ButtonGroupSeparator />
        <Button size="icon-sm" className="w-10" aria-label="More run options">
          <CaretDownIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Zoom">
        <Button variant="outline" size="icon-sm" aria-label="Zoom out">
          <MinusIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Zoom in">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Sandbox actions">
        <Button variant="outline" size="sm">Restart sandbox</Button>
        <Button variant="outline" size="sm">Open logs</Button>
      </ButtonGroup>
    </div>
  );
}

```

## Source

components/ui/button-group.tsx

```tsx
"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, slot } from "@/lib/utils";

// Keys joined into one control. Hexagons cannot butt, so a group is one hexagon cut into segments: the first segment
// keeps the left point, the last the right point, and the joins between them are square. This is the product window's
// split key (.pa-merge: Squash and merge with its caret) redrawn as a Hoplite key: one ink hexagon, the main label and
// a caret segment parted by a hairline of the ground color at 16 percent (ButtonGroupSeparator). Outlined keys overlap
// their 1px edges, so the joins read as a strong hairline inside one outlined hexagon, like the site's segmented
// choices (.pr-period). A field can open a group (its edge squares off into the key after it), and ButtonGroupText is
// an outlined segment of quiet 14px text (a unit, a count). Each segment keeps its own hover and pressed fill; a
// focused segment rises over its neighbors so the ink outline is never covered. `vertical` stacks whole keys 4px
// apart, because a hexagon's points sit at its ends and cannot be joined top to bottom.
// Each segment redraws the key's hexagon with its left and right cuts scaled by --seg-l and --seg-r (1 keeps the point, 0
// squares the end).
const buttonGroupVariants = cva("group/button-group isolate flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>input]:min-w-0 [&>input]:flex-1", {
  variants: {
    orientation: {
      horizontal: cn(
        "[&>*]:before:[clip-path:polygon(calc(var(--hex-cut)_*_var(--seg-l,1))_0,calc(100%_-_var(--hex-cut)_*_var(--seg-r,1))_0,100%_50%,calc(100%_-_var(--hex-cut)_*_var(--seg-r,1))_100%,calc(var(--hex-cut)_*_var(--seg-l,1))_100%,0_50%)] [&>*]:after:[clip-path:polygon(calc(var(--hex-cut)_*_var(--seg-l,1))_0,calc(100%_-_var(--hex-cut)_*_var(--seg-r,1))_0,100%_50%,calc(100%_-_var(--hex-cut)_*_var(--seg-r,1))_100%,calc(var(--hex-cut)_*_var(--seg-l,1))_100%,0_50%)]",
        "[&>*:not(:first-child)]:[--seg-l:0] [&>*:not(:last-child)]:[--seg-r:0] [&>*:not(:first-child)]:-ml-px",
      ),
      vertical: "flex-col gap-1",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

function ButtonGroup({ className, orientation, ...props }: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return <div role="group" data-slot="button-group" data-orientation={orientation ?? "horizontal"} className={cn(buttonGroupVariants({ orientation }), className)} {...props} />;
}

type ButtonGroupTextProps = useRender.ComponentProps<"div"> & { asChild?: boolean };

function ButtonGroupText({ asChild, render, children, className, ...props }: ButtonGroupTextProps) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "div",
    render: parts.render,
    props: {
      "data-slot": "button-group-text",
      className: cn(
        "ds-hex-frame flex h-10 shrink-0 items-center gap-2 px-4 font-sans text-body-sm leading-none whitespace-nowrap text-fg-muted before:bg-line-strong after:bg-surface [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      ),
      ...props,
      children: parts.children,
    },
  });
}

// The hairline sits on the ink between two filled segments: an ink 1px column carrying the ground color at 16 percent.
function ButtonGroupSeparator({ className, orientation = "vertical", ...props }: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="button-group-separator"
      data-orientation={orientation}
      className={cn(
        "relative z-20 shrink-0 self-stretch bg-primary after:absolute after:inset-0 after:bg-on-primary/16",
        orientation === "vertical" ? "w-px" : "h-px",
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };

```
