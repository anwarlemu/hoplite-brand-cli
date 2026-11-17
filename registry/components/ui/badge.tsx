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
