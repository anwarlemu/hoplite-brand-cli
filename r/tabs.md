# Tabs
Segmented choices: an outlined hexagon holding 32px tabs, the chosen one a filled ink hexagon that slides to it (the pricing period switch), or joined square boxes with the chosen one filled ink (the changelog filter).

Install: npx hoplite-ds add tabs
Requires: theme, utils
Packages: @base-ui/react
Exports: Tabs, TabsList, TabsTrigger, TabsContent
Client boundary: yes
Reference: The Hoplite website's pricing period switch (.pr-period: Monthly, Yearly, save 17%) and changelog filter (.cl-filter)


## Usage
Use Tabs to switch between views of the same content (Monthly and Yearly prices, Desktop and Phone previews). Use the default variant for two to four short choices and variant="boxed" for a filter row (All, Features, Fixes). Put each view in TabsContent; controlled tabs take value and onValueChange.
- Avoid: Underlined tabs
- Avoid: A rounded track
- Avoid: More than one chosen tab
- Avoid: Panels that slide or fade in


## Examples
Example components: npx hoplite-ds add tabs
[Preview](https://hoplite-ds.vercel.app/preview/tabs/Preview) | [Boxed](https://hoplite-ds.vercel.app/preview/tabs/Boxed) | [FullWidth](https://hoplite-ds.vercel.app/preview/tabs/FullWidth)

examples/tabs.tsx

```tsx
"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Preview() {
  const [period, setPeriod] = React.useState("monthly");
  return (
    <Tabs value={period} onValueChange={setPeriod}>
      <TabsList aria-label="Billing period">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly, save 17%</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly" className="text-body-sm text-fg-secondary">
        $20 per seat, billed every month.
      </TabsContent>
      <TabsContent value="yearly" className="text-body-sm text-fg-secondary">
        $16.67 per seat a month, billed once a year.
      </TabsContent>
    </Tabs>
  );
}

export function Boxed() {
  return (
    <Tabs defaultValue="all">
      <TabsList variant="boxed" aria-label="Show">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="fixes">Fixes</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="text-body-sm text-fg-secondary">Everything shipped this month, newest first.</TabsContent>
      <TabsContent value="features" className="text-body-sm text-fg-secondary">New things you can do.</TabsContent>
      <TabsContent value="fixes" className="text-body-sm text-fg-secondary">Things that work better now.</TabsContent>
    </Tabs>
  );
}

export function FullWidth() {
  return (
    <Tabs defaultValue="claude" className="max-w-md">
      <TabsList full aria-label="Import from">
        <TabsTrigger value="claude">Claude Code</TabsTrigger>
        <TabsTrigger value="codex">Codex</TabsTrigger>
        <TabsTrigger value="cursor">Cursor</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

```

## Source

components/ui/tabs.tsx

```tsx
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

```
