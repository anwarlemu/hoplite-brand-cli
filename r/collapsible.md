# Collapsible
A section that opens in place: a 14px medium graphite trigger with a caret that turns a quarter when open, and a panel that opens with its height.

Install: npx hoplite-ds add collapsible
Requires: theme, utils
Packages: @base-ui/react, @phosphor-icons/react
Exports: Collapsible, CollapsibleContent, CollapsibleTrigger
Client boundary: yes
Reference: Extrapolated from the Hoplite website: the changelog's quiet disclosures (.cl-entry__summary) and the FAQ's height animation (.faq__item)


## Usage
Use Collapsible for one optional section (advanced settings, the full list of checks). Use the built-in trigger for a quiet text toggle, or asChild with a Button (ghost icon-sm) beside a heading. For several sections in a column, use Accordion.
- Avoid: A caret that moves on hover
- Avoid: A filled or boxed trigger
- Avoid: Content that fades or slides in sideways


## Examples
Example components: npx hoplite-ds add collapsible button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/collapsible/Preview) | [WithButton](https://hoplite-ds.vercel.app/preview/collapsible/WithButton) | [Disabled](https://hoplite-ds.vercel.app/preview/collapsible/Disabled)

examples/collapsible.tsx

```tsx
"use client";

import * as React from "react";
import { CaretUpDownIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function Preview() {
  return (
    <Collapsible defaultOpen className="w-full max-w-md">
      <CollapsibleTrigger>Advanced sandbox settings</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid gap-2 pt-4 pl-6 text-body-sm leading-line-body-sm text-fg-secondary">
          <p>Image: ubuntu-24.04 with Node 22</p>
          <p>Size: 4 vCPU, 16 GiB</p>
          <p>Idle timeout: 30 minutes</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const CHECKS = ["lint", "typecheck", "unit tests", "e2e: checkout"];

export function WithButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
        <span className="text-body-sm leading-line-body-sm font-medium text-fg">4 checks passed on #482</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={open ? "Hide checks" : "Show checks"}>
            <CaretUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ul className="grid">
          {CHECKS.map((check) => (
            <li key={check} className="flex h-9 items-center justify-between border-b border-line text-body-sm leading-line-body-sm text-fg-secondary">
              {check}
              <span className="font-mono text-caption tracking-code text-fg-muted">passed</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Disabled() {
  return (
    <Collapsible disabled>
      <CollapsibleTrigger>Billing history (owners only)</CollapsibleTrigger>
      <CollapsibleContent>Hidden</CollapsibleContent>
    </Collapsible>
  );
}

```

## Source

components/ui/collapsible.tsx

```tsx
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

```
