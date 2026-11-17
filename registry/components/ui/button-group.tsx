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
