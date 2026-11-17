"use client";

import * as React from "react";

import { inputClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// The field (input.tsx) for several lines: square, a 32 percent edge on the ground, 14px Satoshi on 20px lines with
// 12px sides and 8px above and below, a slate placeholder. It starts 96px tall and grows with its content; people can
// still drag it taller. The edge turns strong under the pointer and the ink on focus (2px with the inset outline);
// invalid takes the orange edge, disabled goes quiet. The site has no fields: this follows its lines and type.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(inputClassName, "field-sizing-content group-data-invalid/field:border-danger h-auto min-h-24 resize-y py-2 pointer-coarse:h-auto", className)} {...props} />;
}

export { Textarea };
