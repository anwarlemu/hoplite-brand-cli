# Empty
A view with nothing in it yet: centered, a 48px hexagon outline holding a glyph, a 20px Chakra Petch title, 14px quiet text and hexagonal keys below; bare, in a stone frame, or inside crop marks.

Install: npx hoplite-ds add empty
Requires: theme, utils
Packages: class-variance-authority
Exports: Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle
Client boundary: not required by this entry file
Reference: Extrapolated from the Hoplite website: its hexagonal marks (.faq__hex), square frames (.pr-plan, .how__frame corners), display type and keys


## Usage
Use Empty for a list, table or page with no content yet (no threads, no automations) or a search with no results. Say what goes here and give the one action that fills it (an ink key), with a second outlined key or a link at most.
- Avoid: Illustrations or mascots
- Avoid: A filled hexagon or an orange glyph
- Avoid: More than two keys
- Avoid: Bold titles


## Examples
Example components: npx hoplite-ds add empty button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/empty/Preview) | [Corners](https://hoplite-ds.vercel.app/preview/empty/Corners) | [Bare](https://hoplite-ds.vercel.app/preview/empty/Bare)

examples/empty.tsx

```tsx
import { ArrowRightIcon, GitBranchIcon, RobotIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function Preview() {
  return (
    <Empty variant="outline">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RobotIcon />
        </EmptyMedia>
        <EmptyTitle>No threads yet</EmptyTitle>
        <EmptyDescription>Start a thread and an agent picks up the task in its own sandbox.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Start a thread</Button>
        <Button variant="outline">Import an issue</Button>
      </EmptyContent>
    </Empty>
  );
}

export function Corners() {
  return (
    <Empty variant="corners">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GitBranchIcon />
        </EmptyMedia>
        <EmptyTitle>Connect a repository</EmptyTitle>
        <EmptyDescription>
          Agents need a repository to work in. <a href="#docs">Read the setup guide</a>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="link">
          Connect GitHub
          <ArrowRightIcon />
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function Bare() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No automations match “nightly”</EmptyTitle>
        <EmptyDescription>Try another name, or clear the filter.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="secondary" size="sm">
          Clear filter
        </Button>
      </EmptyContent>
    </Empty>
  );
}

```

## Source

components/ui/empty.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A view with nothing in it yet, extrapolated from the site's frames and hexagonal marks: centered in the space, 32px
// in, a 48px glyph frame (a hexagon outline of the strong edge, points left and right like the FAQ's mark, holding a
// 20px Phosphor glyph in the ink), a 20px Chakra Petch light title, 14px quiet text that stops at 384px, and the keys
// below (hexagons, 12px apart). `outline` draws the stone frame around the whole state; `corners` its crop marks.
function Empty({ className, variant = "default", ...props }: React.ComponentProps<"div"> & { variant?: "default" | "outline" | "corners" }) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-8 text-center font-sans text-balance",
        variant === "outline" && "border border-line-frame",
        variant === "corners" && "ds-corners",
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn("flex max-w-96 flex-col items-center gap-2", className)} {...props} />;
}

const emptyMediaVariants = cva("mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "relative size-12 text-fg [&>svg:not([data-slot=empty-hex])]:size-5",
    },
  },
  defaultVariants: { variant: "default" },
});

function EmptyMedia({ className, variant = "default", children, ...props }: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div data-slot="empty-media" data-variant={variant} className={cn(emptyMediaVariants({ variant }), className)} {...props}>
      {variant === "icon" && (
        <svg data-slot="empty-hex" viewBox="0 0 48 48" aria-hidden className="absolute inset-0 size-full fill-none stroke-line-strong">
          <path d="M46.5 24L35.25 43.49L12.75 43.49L1.5 24L12.75 4.51L35.25 4.51Z" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {children}
    </div>
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn("font-display text-h5 leading-7 font-light text-fg", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="empty-description" className={cn("text-body-sm leading-line-body-sm text-pretty text-fg-muted [&>a]:text-fg [&>a]:underline [&>a]:decoration-line [&>a]:underline-offset-4 [&>a:hover]:decoration-current", className)} {...props} />;
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-content" className={cn("flex w-full max-w-96 min-w-0 flex-wrap items-center justify-center gap-3 text-body-sm leading-line-body-sm text-balance text-fg-muted", className)} {...props} />;
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };

```
