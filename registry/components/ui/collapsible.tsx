"use client";

import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";

import { cn, slot } from "@/lib/utils";

// A section that opens in place, drawn from the site's quiet disclosures (the changelog's entries, .cl-entry): a 14px
// medium graphite trigger with a 16px caret before it that turns a quarter to point down when open (240ms, ease-out);
// under the pointer the label turns ink, and the caret only changes color. The panel opens with its height (240ms,
// ease-out; it closes in 200ms). With asChild the trigger takes the look of its child (a Button) and no caret.
type CollapsibleProps = React.ComponentProps<typeof BaseCollapsible.Root>;

function Collapsible(props: CollapsibleProps) {
  return <BaseCollapsible.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ className, children, asChild = false, render, ...props }: React.ComponentProps<typeof BaseCollapsible.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  if (parts.render) {
    // A component child (the library's Button) renders a native button; a plain element other than a button does not.
    const type = React.isValidElement(parts.render) ? parts.render.type : undefined;
    const native = !(typeof type === "string" && type !== "button");
    return (
      <BaseCollapsible.Trigger data-slot="collapsible-trigger" nativeButton={native} render={parts.render} className={className} {...props}>
        {parts.children}
      </BaseCollapsible.Trigger>
    );
  }
  return (
    <BaseCollapsible.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "group/collapsible-trigger inline-flex cursor-pointer items-center gap-2 font-sans text-body-sm leading-line-body-sm font-medium text-fg-secondary transition-colors duration-base ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-panel-open:text-fg data-disabled:cursor-default data-disabled:text-fg-subtle motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <CaretRightIcon aria-hidden data-slot="collapsible-caret" className="size-4 shrink-0 text-fg-muted transition-[rotate,color] duration-slow ease-out group-hover/collapsible-trigger:text-fg group-data-panel-open/collapsible-trigger:rotate-90 group-data-panel-open/collapsible-trigger:text-fg motion-reduce:transition-none" />
      {children}
    </BaseCollapsible.Trigger>
  );
}

function CollapsibleContent({ className, ...props }: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-slow ease-out data-starting-style:h-0 data-ending-style:h-0 data-ending-style:duration-moderate motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
