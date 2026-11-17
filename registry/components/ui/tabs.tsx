"use client";

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

// The site's two segmented choices. `default` is the pricing period switch (.pr-period): an outlined hexagon holding
// 32px tabs with 8px cuts and 20px sides; the chosen tab is a filled ink hexagon that slides to it (240ms, in-out) with
// its label in the ground color, the others quiet until the pointer turns them ink. `boxed` is the changelog and blog
// filter (.cl-filter): joined 32px boxes with 12px sides on quiet edges, the chosen one filled ink. Labels are 14px
// medium. Panels change in place, with no entrance.
type Variant = "default" | "boxed";
const VariantContext = React.createContext<Variant>("default");

type TabsProps = Omit<React.ComponentProps<typeof BaseTabs.Root>, "onValueChange"> & { onValueChange?: (value: string) => void };

function Tabs({ className, onValueChange, ...props }: TabsProps) {
  return <BaseTabs.Root data-slot="tabs" onValueChange={onValueChange ? (value) => onValueChange(String(value)) : undefined} className={cn("flex flex-col gap-6 data-[orientation=vertical]:flex-row", className)} {...props} />;
}

function TabsList({ className, variant = "default", full = false, children, ...props }: React.ComponentProps<typeof BaseTabs.List> & { variant?: Variant; full?: boolean }) {
  return (
    <VariantContext.Provider value={variant}>
      <BaseTabs.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          "relative w-fit max-w-full items-center",
          variant === "default" ? "ds-hex-frame inline-flex p-1 before:bg-line-strong after:bg-surface" : "inline-flex",
          full && "flex w-full [&>[data-slot=tabs-trigger]]:flex-1",
          className,
        )}
        {...props}
      >
        {variant === "default" && <BaseTabs.Indicator data-slot="tabs-indicator" className="ds-hex-frame-s absolute top-1 left-0 h-8 w-(--active-tab-width) translate-x-(--active-tab-left) transition-[translate,width] duration-slow ease-in-out before:bg-primary motion-reduce:transition-none" />}
        {children}
      </BaseTabs.List>
    </VariantContext.Provider>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof BaseTabs.Tab>) {
  const variant = React.useContext(VariantContext);
  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-2 font-sans text-body-sm leading-none font-medium whitespace-nowrap text-fg-muted select-none transition-colors duration-base ease-out data-active:cursor-default data-disabled:pointer-events-none data-disabled:text-fg-faint motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variant === "default"
          ? "px-5 hover:text-fg data-active:text-on-primary data-active:hover:text-on-primary"
          : "-ml-px border border-line px-3 first:ml-0 hover:text-fg data-active:border-primary data-active:bg-primary data-active:text-on-primary",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel data-slot="tabs-content" className={cn("min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
