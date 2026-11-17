"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// A field's label as the site's principles set it: 14px Satoshi medium in the ink on a 20px line, above its field or
// 8px beside a check, radio or switch. A required mark inside it (`<span aria-hidden>*</span>` with
// data-slot="label-required") is the orange. When its field or its peer control is disabled the label turns the slate.
// The site has no form labels: this is extrapolated from its 14px medium control type.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 font-sans text-body-sm leading-line-body-sm font-medium text-fg select-none *:data-[slot=label-required]:-ml-1 *:data-[slot=label-required]:text-danger group-data-disabled/field:pointer-events-none group-data-disabled/field:text-fg-subtle peer-disabled:cursor-not-allowed peer-disabled:text-fg-subtle peer-data-disabled:cursor-not-allowed peer-data-disabled:text-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
