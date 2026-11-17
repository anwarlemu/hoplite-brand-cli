import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A notice in the site's ruled language (extrapolated from its frames and notes): a square block on the ground inside a
// quiet 16 percent edge, 16px in, a 16px Phosphor glyph in the ink 2px down beside a 14px medium ink title and a 14px
// graphite description. Nothing is filled: `destructive` takes the orange edge and an orange glyph, `success` and
// `warning` keep the quiet edge with a glyph in their status color. An action sits at the end, centered on the block.
const alertVariants = cva(
  "group/alert relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 border px-4 py-4 font-sans text-body-sm leading-line-body-sm has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:gap-x-3 has-data-[slot=alert-action]:grid-cols-[0_1fr_auto] has-[>svg]:has-data-[slot=alert-action]:grid-cols-[16px_1fr_auto] [&>svg]:row-span-2 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-line text-fg [&>svg]:text-fg",
        destructive: "border-danger text-fg [&>svg]:text-danger",
        success: "border-line text-fg [&>svg]:text-success",
        warning: "border-line text-fg [&>svg]:text-warning",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" data-variant={variant ?? "default"} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("col-start-2 min-h-5 font-medium text-pretty text-fg", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("col-start-2 grid justify-items-start gap-1 text-pretty text-fg-secondary [&_a]:text-fg [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 [&_a:hover]:decoration-current [&_p]:leading-line-body-sm", className)} {...props} />;
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-action" className={cn("col-start-3 row-span-2 row-start-1 ml-4 flex items-center gap-2 self-center", className)} {...props} />;
}

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants };
