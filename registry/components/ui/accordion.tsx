"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";

import { cn } from "@/lib/utils";

// The pricing FAQ (.faq__item, .faq__icon, .faq__hex, .faq__bar): ruled rows, a quiet rule above the first and below
// each, 18px questions (16px on a phone) 24px from each rule, and at the end a 20px outlined hexagon of the strong edge
// holding a 2px ink plus. Open, the hexagon turns 30 degrees and the plus's upright bar folds to nothing, leaving a minus
// (240ms). Under the pointer the question turns graphite. The answer is 16px light graphite, stopping at 600px, and the
// panel opens with its height (240ms, ease-out; it closes in 200ms). `compact` is the changelog entry (.cl-entry): the
// hexagon first, a 14px graphite title that turns ink when open, no rules, and the body indented under the title.
type Variant = "default" | "compact";
const VariantContext = React.createContext<Variant>("default");

type BaseRootProps = React.ComponentProps<typeof BaseAccordion.Root>;
type Single = { type?: "single"; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; /** Whether the open item can be closed again (false keeps one open). */ collapsible?: boolean };
type Multiple = { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void; collapsible?: never };
type AccordionProps = Omit<BaseRootProps, "value" | "defaultValue" | "onValueChange" | "multiple"> & (Single | Multiple) & { variant?: Variant };

const toArray = (value: string | string[] | undefined) => (value === undefined ? undefined : Array.isArray(value) ? value : value === "" ? [] : [value]);

function Accordion({ type = "single", collapsible = true, value, defaultValue, onValueChange, variant = "default", className, ...props }: AccordionProps) {
  const multiple = type === "multiple";
  const notify = onValueChange as ((value: string | string[]) => void) | undefined;
  const [inner, setInner] = React.useState<string[]>(() => toArray(defaultValue) ?? []);
  const current = toArray(value) ?? inner;
  const handleChange = (next: unknown[]) => {
    const list = next.map(String);
    if (!multiple && !collapsible && list.length === 0) return;
    if (value === undefined) setInner(list);
    notify?.(multiple ? list : (list[0] ?? ""));
  };
  return (
    <VariantContext.Provider value={variant}>
      <BaseAccordion.Root
        data-slot="accordion"
        data-variant={variant}
        multiple={multiple}
        value={current}
        onValueChange={handleChange}
        className={cn("flex w-full flex-col", variant === "compact" && "gap-1", className)}
        {...props}
      />
    </VariantContext.Provider>
  );
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof BaseAccordion.Item>) {
  const variant = React.useContext(VariantContext);
  return <BaseAccordion.Item data-slot="accordion-item" className={cn(variant === "default" && "border-b border-line first:border-t", className)} {...props} />;
}

/** The FAQ's mark: a 20px hexagon outline holding a 2px plus; open, it turns 30 degrees and the plus becomes a minus. */
function AccordionIcon({ className, variant }: { className?: string; variant: Variant }) {
  return (
    <svg data-slot="accordion-icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden className={cn("size-5 shrink-0", className)}>
      <path
        d="M19 10L14.5 17.79L5.5 17.79L1 10L5.5 2.21L14.5 2.21Z"
        className="fill-none stroke-line-strong [transform-box:fill-box] origin-center transition-[rotate] duration-slow ease-out group-data-panel-open/accordion-trigger:rotate-30 motion-reduce:transition-none"
        strokeWidth={1}
      />
      <g className={cn("transition-[stroke] duration-base ease-out motion-reduce:transition-none", variant === "compact" ? "stroke-fg-muted group-hover/accordion-trigger:stroke-fg group-data-panel-open/accordion-trigger:stroke-fg" : "stroke-fg")} strokeWidth={2}>
        <path d="M6.5 10h7" />
        <path d="M10 6.5v7" className="[transform-box:fill-box] origin-center transition-[scale] duration-slow ease-out group-data-panel-open/accordion-trigger:scale-y-0 motion-reduce:transition-none" />
      </g>
    </svg>
  );
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  const variant = React.useContext(VariantContext);
  return (
    <BaseAccordion.Header data-slot="accordion-header" className="m-0 font-sans font-normal">
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex w-full cursor-pointer text-left font-sans transition-colors duration-base ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring data-disabled:cursor-default data-disabled:text-fg-subtle motion-reduce:transition-none",
          variant === "default"
            ? "items-center justify-between gap-4 py-6 text-body leading-line-body text-fg hover:text-fg-secondary md:text-body-lg"
            : "items-start gap-3 py-1 text-body-sm leading-line-body-sm text-fg-secondary hover:text-fg data-panel-open:text-fg",
          className,
        )}
        {...props}
      >
        {variant === "compact" && <AccordionIcon variant={variant} />}
        <span className="min-w-0 flex-1 text-pretty">{children}</span>
        {variant === "default" && <AccordionIcon variant={variant} />}
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof BaseAccordion.Panel>) {
  const variant = React.useContext(VariantContext);
  return (
    <BaseAccordion.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-slow ease-out data-starting-style:h-0 data-ending-style:h-0 data-ending-style:duration-moderate motion-reduce:transition-none"
      {...props}
    >
      <div
        className={cn(
          "font-sans text-body leading-line-body font-light text-pretty text-fg-secondary",
          variant === "default" ? "max-w-150 pb-6" : "flex max-w-168 flex-col gap-3 pt-1 pb-5 pl-8",
          className,
        )}
      >
        {children}
      </div>
    </BaseAccordion.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
