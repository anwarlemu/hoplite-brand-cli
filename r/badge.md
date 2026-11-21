# Badge
The site's tag: a 20px hexagon with 8px cuts and a 12px Kode Mono capital label. Default is the outlined tag (strong edge, ink label); solid is ink, accent the orange edge and label, plus status, outline, secondary, destructive and ghost.

Install: npx hoplite-ds add badge
Requires: theme, utils
Packages: @base-ui/react, class-variance-authority
Exports: Badge, badgeVariants
Client boundary: yes
Reference: The Hoplite website's .tag (pricing, the hero's pill) and the nav's news card (.hn__news, New)


## Usage
Use Badge for a short status or category beside a name (New, Team, Passed, PR #482). Use default for most tags, solid for a plan or a state that should stand out, accent once per view for the thing that matters (Most popular), success, warning and destructive for check states. asChild turns a link into a tag.
- Avoid: A pill or square tag
- Avoid: Lowercase or sentence-case labels (the label is set in capitals by the font style)
- Avoid: Two accent tags in one view
- Avoid: Long labels
- Avoid: Bold type


## Examples
Example components: npx hoplite-ds add badge
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/badge/Preview) | [Variants](https://hoplite-ds.vercel.app/preview/badge/Variants) | [WithIcon](https://hoplite-ds.vercel.app/preview/badge/WithIcon) | [NavNews](https://hoplite-ds.vercel.app/preview/badge/NavNews)

examples/badge.tsx

```tsx
import { CheckIcon, GitPullRequestIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>New</Badge>
      <Badge variant="solid">Team</Badge>
      <Badge variant="accent">Most popular</Badge>
    </div>
  );
}

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="solid">Solid</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Passed</Badge>
      <Badge variant="warning">Queued</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  );
}

export function WithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="success">
        <CheckIcon />
        Checks passed
      </Badge>
      <Badge>
        <GitPullRequestIcon />
        PR #482
      </Badge>
      <Badge asChild variant="outline">
        <a href="#changelog">Changelog</a>
      </Badge>
    </div>
  );
}

export function NavNews() {
  return (
    <a href="#subagents" className="grid w-full max-w-xs justify-items-start gap-3 border border-line p-4 transition-[border-color] duration-base ease-out hover:border-line-field focus-visible:-outline-offset-2 motion-reduce:transition-none">
      <Badge>New</Badge>
      <span className="text-body-sm leading-line-body-sm font-medium text-fg">Steer running subagents from your phone</span>
    </a>
  );
}

```

## Source

components/ui/badge.tsx

```tsx
"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, slot } from "@/lib/utils";

// The site's tag (.tag, and the New tag in the nav's news card, .hn__news): a 20px hexagon with its ends cut 8px, drawn
// behind the label, holding a 12px Kode Mono capital label tracked 8 percent, 12px in from each side. `default` is the
// site's tag: a 1px strong edge around the ground with the label in the ink. `solid` is the ink hexagon with a ground
// label, `secondary` a hexagon of the hover wash, `outline` the quiet 16 percent edge with a quiet label, `accent` the
// orange edge and label (the one mark on a view), `success` and `warning` their status edges and labels, `destructive`
// the orange hexagon with a white label, and `ghost` the bare label. A 12px glyph sits 4px from the label.
const badgeVariants = cva(
  "ds-label ds-hex-frame-s inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 px-3 whitespace-nowrap select-none [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0 [a&]:transition-colors [a&]:duration-base [a&]:ease-out [a&]:motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "text-fg before:bg-line-strong after:bg-surface [a&]:hover:after:bg-subtle-hover",
        solid: "text-on-primary before:bg-primary [a&]:hover:before:bg-primary-hover",
        secondary: "text-fg before:bg-subtle-hover [a&]:hover:before:bg-pressed",
        outline: "text-fg-muted before:bg-line after:bg-surface [a&]:hover:text-fg",
        accent: "text-fg-accent before:bg-brand after:bg-surface",
        success: "text-success before:bg-success after:bg-surface",
        warning: "text-warning before:bg-warning after:bg-surface",
        destructive: "text-white before:bg-danger [a&]:hover:before:bg-danger-strong",
        ghost: "px-0 text-fg-muted [a&]:hover:text-fg",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type BadgeProps = useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({ className, variant, asChild = false, render, children, ...props }: BadgeProps) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "span",
    render: parts.render as BadgeProps["render"],
    props: mergeProps<"span">({ className: cn(badgeVariants({ variant }), className), children: parts.children }, props, { "data-slot": "badge", "data-variant": variant ?? "default" } as React.ComponentProps<"span">),
  });
}

export { Badge, badgeVariants };

```
