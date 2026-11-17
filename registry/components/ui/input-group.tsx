"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The field (input.tsx) with things inside it: the square 40px frame with its 32 percent edge on the ground around a
// borderless control, and addons 12px from either end: a 16px Phosphor glyph or 14px text in the quiet gray, a Kbd, or
// a compact ghost hexagon key (24px or 32px, 8px cuts) 4px from the edge. Addons can also sit above or below a textarea
// (block-start, block-end) on a quiet rule. Hover, focus, invalid and disabled belong to the whole frame, as on Input:
// the strong edge under the pointer, the 2px ink edge while the control has keyboard focus, the orange edge when
// invalid. The site has no fields: this follows its lines, type and nav keys.
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex h-10 w-full min-w-0 items-center border border-line-field bg-transparent transition-[border-color] duration-fast ease-out hover:border-line-strong pointer-coarse:h-12 motion-reduce:transition-none",
        "has-[[data-slot=input-group-control]:focus-visible]:border-focus-ring has-[[data-slot=input-group-control]:focus-visible]:outline-1 has-[[data-slot=input-group-control]:focus-visible]:-outline-offset-2 has-[[data-slot=input-group-control]:focus-visible]:outline-focus-ring",
        "has-[[data-slot=input-group-control][aria-invalid=true]]:border-danger has-[[data-slot=input-group-control][aria-invalid=true]]:outline-danger has-[[data-slot=input-group-control][data-invalid]]:border-danger",
        "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:border-line",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2 has-[>[data-align=inline-end]]:[&>input]:pr-2",
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto shrink-0 cursor-text items-center justify-center gap-2 font-sans text-body-sm leading-line-body-sm text-fg-muted select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:cursor-not-allowed group-has-[[data-slot=input-group-control]:disabled]/input-group:text-fg-subtle [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:pl-1",
        "inline-end": "order-last pr-3 has-[>button]:pr-1",
        "block-start": "order-first w-full justify-start border-b border-line px-3 py-2 has-[>button]:py-1",
        "block-end": "order-last w-full justify-start border-t border-line px-3 py-2 has-[>button]:py-1",
      },
    },
    defaultVariants: { align: "inline-start" },
  },
);

function InputGroupAddon({ className, align = "inline-start", ...props }: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        // A click on the addon (not on a key in it) focuses the control, as a click inside a field would.
        if ((e.target as HTMLElement).closest("button")) return;
        e.currentTarget.parentElement?.querySelector<HTMLElement>("input, textarea")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva("", {
  variants: {
    size: {
      xs: "h-6 gap-1 px-2",
      sm: "h-8 gap-2 px-3",
      "icon-xs": "size-6 px-0",
      "icon-sm": "size-8 px-0",
    },
  },
  defaultVariants: { size: "xs" },
});

function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ...props }: Omit<React.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>) {
  return <Button type={type} data-size={size} variant={variant} size="sm" className={cn("pointer-coarse:h-auto", inputGroupButtonVariants({ size }), className)} {...props} />;
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="input-group-text" className={cn("flex items-center gap-2 font-sans text-body-sm leading-line-body-sm text-fg-muted [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className)} {...props} />;
}

const CONTROL = "min-w-0 flex-1 border-0 bg-transparent px-3 font-sans text-body-sm leading-line-body-sm text-fg outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed disabled:text-fg-subtle pointer-coarse:text-body";

function InputGroupInput({ className, ...props }: React.ComponentProps<typeof BaseInput>) {
  return <BaseInput data-slot="input-group-control" className={cn(CONTROL, "h-full", className)} {...props} />;
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="input-group-control" className={cn(CONTROL, "field-sizing-content flex min-h-24 w-full resize-none py-2", className)} {...props} />;
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea };
