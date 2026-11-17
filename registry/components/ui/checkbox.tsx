"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";

// Checks are square, as the site's principles say (the site draws no form checks; this follows its keys' lines): a
// 16px box with a 1px strong edge on the ground. On, it fills with the ink and holds a 12px check in the ground color;
// when some are on (indeterminate) it holds a dash instead. The edge turns the ink under the pointer. The fill and the
// edge change in 120ms on the ease-out and nothing moves or grows; the mark itself appears at once. Keyboard focus is
// the 2px ink outline 2px out; an invalid check takes the orange edge; a disabled one turns the quiet line, and the off
// gray when on. Its label sits 8px away in 14px medium ink. An invisible 8px margin around the box widens the hit area.
function Checkbox({ className, ...props }: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center border border-line-strong bg-surface text-on-primary transition-[background-color,border-color] duration-fast ease-out after:absolute after:-inset-2 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary aria-invalid:border-danger data-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:data-checked:border-off data-disabled:data-checked:bg-off data-disabled:data-indeterminate:border-off data-disabled:data-indeterminate:bg-off motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center">
        <CheckIcon aria-hidden weight="bold" className="size-3 group-data-indeterminate/checkbox:hidden" />
        <MinusIcon aria-hidden weight="bold" className="hidden size-3 group-data-indeterminate/checkbox:block" />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}

export { Checkbox };
