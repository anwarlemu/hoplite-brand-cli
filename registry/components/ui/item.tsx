"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, slot } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// A row of content. `default` is the nav's menu row (.hn__item): a 20px glyph column 12px from a 14px medium ink label
// over a 14px quiet description, 8px by 12px in, square; a row that is a link or a button takes the paper under the
// pointer (120ms). `outline` is the nav's news card (.hn__news): a quiet 16 percent frame, 16px in, whose edge turns the
// field line under the pointer. `muted` sits on the paper. `ruled` is an integration row on the home page (.iw-item,
// Wired into your stack): no sides, 20px from a quiet rule above and below, a 20px Chakra Petch title beside its 20px
// glyph and 14px light graphite text under it, indented to the title. Focus is the ink outline drawn inside the row.
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="list" data-slot="item-group" className={cn("group/item-group flex flex-col", className)} {...props} />;
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator data-slot="item-separator" orientation="horizontal" className={cn("my-1", className)} {...props} />;
}

const itemVariants = cva(
  "group/item flex flex-wrap items-center border border-transparent font-sans text-body-sm leading-line-body-sm text-fg transition-[background-color,border-color] duration-fast ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "[a&]:hover:bg-subtle [button&]:hover:bg-subtle aria-[current=page]:bg-subtle data-[selected=true]:bg-subtle",
        outline: "border-line duration-base [a&]:hover:border-line-field [button&]:hover:border-line-field",
        muted: "bg-subtle [a&]:hover:bg-subtle-hover [button&]:hover:bg-subtle-hover",
        ruled: "-mt-px border-x-0 border-t-line border-b-line first:mt-0",
      },
      size: {
        default: "gap-3 px-3 py-2",
        sm: "gap-2 px-2 py-1",
        lg: "gap-3 p-4",
      },
    },
    compoundVariants: [
      { variant: "outline", size: "default", className: "p-4" },
      { variant: "ruled", className: "gap-x-3 gap-y-2 px-0 py-5" },
    ],
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ItemProps = useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants> & { asChild?: boolean };

function Item({ className, variant = "default", size = "default", asChild = false, render, children, ...props }: ItemProps) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "div",
    render: parts.render as ItemProps["render"],
    props: mergeProps<"div">({ className: cn(itemVariants({ variant, size }), className), children: parts.children }, props, { "data-slot": "item", "data-variant": variant, "data-size": size } as React.ComponentProps<"div">),
  });
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:self-start group-data-[variant=ruled]/item:mt-1 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-5 text-fg [&_svg:not([class*='size-'])]:size-5",
        image: "ds-hex-mark size-10 overflow-hidden bg-subtle-hover [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function ItemMedia({ className, variant = "default", ...props }: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return <div data-slot="item-media" data-variant={variant} className={cn(itemMediaVariants({ variant }), className)} {...props} />;
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-content" className={cn("flex min-w-0 flex-1 flex-col group-data-[variant=ruled]/item:gap-2 [&+[data-slot=item-content]]:flex-none", className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit min-w-0 items-center gap-2 text-body-sm leading-line-body-sm font-medium text-fg group-data-[variant=ruled]/item:font-display group-data-[variant=ruled]/item:text-h5 group-data-[variant=ruled]/item:leading-7 group-data-[variant=ruled]/item:font-normal",
        className,
      )}
      {...props}
    />
  );
}

/** The line under a title: quiet in a nav row, light graphite in a ruled row; clamped to two lines. */
function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 max-w-90 text-body-sm leading-line-body-sm font-normal text-pretty text-fg-muted group-data-[variant=ruled]/item:font-light group-data-[variant=ruled]/item:text-fg-secondary [&>a]:text-fg [&>a]:underline [&>a]:decoration-line [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-actions" className={cn("flex items-center gap-2", className)} {...props} />;
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-header" className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />;
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-footer" className={cn("flex basis-full items-center justify-between gap-2", className)} {...props} />;
}

export { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle };
