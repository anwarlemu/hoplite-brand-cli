import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// The site's frames. `default` is a plan card or a band (.pr-plan, .band__frame): a square frame of the stone line on
// the same ground, 32px in (24px at size sm), never a fill or a shadow. `corners` is the feature frame (.how__frame,
// .band__frame on the home page): four 16px slate crop marks at the corners over a transparent edge. `ruled` drops the
// frame for a quiet rule above, for cards that sit in a row of their own. Titles are Chakra Petch 24px (20px at size sm)
// in the ink (.band__title, .pr-plan__name); the description and body are 16px light graphite (.pr-plan__body); an
// action sits at the top right and the footer holds the keys.
const cardVariants = cva("group/card flex min-w-0 flex-col gap-6 font-sans text-fg data-[size=sm]:gap-4", {
  variants: {
    variant: {
      default: "border border-line-frame p-8 data-[size=sm]:p-6",
      corners: "ds-corners p-8 data-[size=sm]:p-6",
      ruled: "border-t border-line pt-8 data-[size=sm]:pt-6",
    },
  },
  defaultVariants: { variant: "default" },
});

function Card({ className, variant, size = "default", ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
  return <div data-slot="card" data-variant={variant ?? "default"} data-size={size} className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid auto-rows-min items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:gap-x-4 has-data-[slot=card-action]:*:data-[slot=card-description]:col-span-2", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("font-display text-h4 leading-8 font-normal text-balance text-fg group-data-[size=sm]/card:text-h5 group-data-[size=sm]/card:leading-7", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-body leading-line-body font-light text-pretty text-fg-secondary", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("text-body leading-line-body font-light text-fg-secondary", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex flex-wrap items-center gap-3", className)} {...props} />;
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
