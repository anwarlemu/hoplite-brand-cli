"use client";

import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

// The site's rules: a quiet 16 percent 1px line between rows and under the header, or (`dashed`) the section guide's
// dashes, 10px on an 18px period (ds-rule-x across, ds-rule-y down). Horizontal by default; vertical rules stretch to
// the row. Decorative rules are hidden from assistive tech, as shadcn's are.
type SeparatorProps = Omit<React.ComponentProps<typeof BaseSeparator>, "orientation"> & { orientation?: "horizontal" | "vertical"; decorative?: boolean; variant?: "solid" | "dashed" };

function Separator({ className, orientation = "horizontal", decorative = true, variant = "solid", ...props }: SeparatorProps) {
  return (
    <BaseSeparator
      data-slot="separator"
      data-variant={variant}
      orientation={orientation}
      role={decorative ? "none" : undefined}
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        variant === "solid" ? "bg-line" : orientation === "horizontal" ? "ds-rule-x" : "ds-rule-y",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
