"use client";

import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";

import { cn } from "@/lib/utils";

// A region that scrolls inside the page (a long thread list, a run log), extrapolated from the Hoplite website's quiet
// rules: the native scroll with a thin square bar instead of the system one. The thumb is a 4px square bar of the field
// line (32 percent) in a 12px lane along the edge, turning to the strong line (70 percent) under the pointer or while
// it is dragged (120ms). The bar only shows when the content overflows. Focus on the viewport is the inset ink outline.
function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root data-slot="scroll-area" className={cn("relative min-h-0 overflow-hidden", className)} {...props}>
      <BaseScrollArea.Viewport data-slot="scroll-area-viewport" className="size-full overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring">
        {children}
      </BaseScrollArea.Viewport>
      <ScrollBar />
      <BaseScrollArea.Corner data-slot="scroll-area-corner" />
    </BaseScrollArea.Root>
  );
}

function ScrollBar({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof BaseScrollArea.Scrollbar>) {
  return (
    <BaseScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn("group/scrollbar flex touch-none justify-center select-none", orientation === "vertical" ? "w-3" : "h-3 flex-col", className)}
      {...props}
    >
      <BaseScrollArea.Thumb
        data-slot="scroll-area-thumb"
        className={cn("bg-line-field transition-colors duration-fast ease-out group-hover/scrollbar:bg-line-strong active:bg-line-strong motion-reduce:transition-none", orientation === "vertical" ? "w-1" : "h-1")}
      />
    </BaseScrollArea.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
