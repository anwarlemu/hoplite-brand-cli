"use client";

import * as React from "react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

import { inputClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// The browser's own select dressed as the field (input.tsx): square, 40px, a 32 percent edge on the ground, 14px ink
// with 12px on the left and room on the right for a 16px Phosphor caret in the quiet gray, 12px from the edge. The edge
// turns strong under the pointer and the ink on focus; invalid takes the orange edge; disabled goes quiet with a slate
// caret. `size="sm"` is the 32px field. The open list is the platform's. Use it where the native picker is better
// (phones, long lists, forms without script); use Select for the brand's popup.
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" };

function NativeSelect({ className, size = "default", ...props }: NativeSelectProps) {
  return (
    <div data-slot="native-select-wrapper" data-size={size} className={cn("group/native-select relative w-fit", className)}>
      <select data-slot="native-select" data-size={size} className={cn(inputClassName, "cursor-pointer appearance-none pr-10 group-data-invalid/field:border-danger data-[size=sm]:h-8 pointer-coarse:data-[size=sm]:h-12")} {...props} />
      <CaretDownIcon aria-hidden data-slot="native-select-icon" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-muted group-has-[select:disabled]/native-select:text-fg-subtle" />
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-surface text-fg", className)} {...props} />;
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" className={cn("bg-surface text-fg", className)} {...props} />;
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
