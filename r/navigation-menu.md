# Navigation Menu
The site's header nav: bare 14px graphite triggers with a 12px chevron that turns over, a compact hexagon of the hover wash behind the open one, and a full-width square sheet of the ground under the bar, ruled off by the quiet line. Links are rows of a 20px glyph, a 14px medium label and a quiet line, the row under the pointer on the paper; groups sit under Kode Mono eyebrows divided by dashed rules.

Install: npx hoplite-ds add navigation-menu
Requires: theme, utils, surface, button
Packages: @base-ui/react, @phosphor-icons/react
Exports: NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport, navigationMenuTriggerStyle
Client boundary: yes
Reference: The Hoplite website's header nav (.hn__list, .hn__top, .hn__chevron, .hn__sheet, .hn__panel, .hn__group, .hn__heading, .hn__item, .hn__item-label, .hn__item-body)


## Usage
Use for a site's main navigation when a section needs a panel of links (Product, Use cases, Resources). Give each NavigationMenuItem a value, put rows of NavigationMenuLink inside NavigationMenuContent, and divide groups with ds-rule-y under a ds-label heading. A plain link in the bar takes navigationMenuTriggerStyle(). Let the menu span the header so its sheet spans the page.
- Avoid: A floating rounded panel
- Avoid: Pill or ink triggers
- Avoid: An icon that moves on hover
- Avoid: Panels that need scrolling on desktop
- Avoid: More than five triggers


## Examples
Example components: npx hoplite-ds add navigation-menu button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/navigation-menu/Preview) | [Open](https://hoplite-ds.vercel.app/preview/navigation-menu/Open)

examples/navigation-menu.tsx

```tsx
"use client";

import * as React from "react";
import {
  ArrowCircleRightIcon,
  ArrowsClockwiseIcon,
  BugIcon,
  ChatCircleIcon,
  ClockIcon,
  CodeIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  GitBranchIcon,
  ListBulletsIcon,
  PackageIcon,
  PencilSimpleIcon,
  PulseIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  TerminalWindowIcon,
  TestTubeIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

type Link = { title: string; body: string; icon: React.ComponentType<{ className?: string }> };

const PRODUCT: { heading: string; links: Link[] }[] = [
  {
    heading: "Run agents",
    links: [
      { title: "Multiplayer", body: "Every thread is shared with your team.", icon: UsersThreeIcon },
      { title: "Slack agent", body: "Your coding agent, right in Slack.", icon: ChatCircleIcon },
      { title: "Automations", body: "Coding agents that start before you ask.", icon: ClockIcon },
      { title: "PR auto-fix", body: "Review comments and red checks, handled.", icon: ArrowsClockwiseIcon },
    ],
  },
  {
    heading: "Build and ship",
    links: [
      { title: "Repositories", body: "Agents clone it and work on their own branches.", icon: GitBranchIcon },
      { title: "Import your setup", body: "Bring your skills and MCP servers from other tools.", icon: DownloadSimpleIcon },
      { title: "Verify and merge", body: "It tests its work and opens the PR for review.", icon: SealCheckIcon },
      { title: "Platform API", body: "Put coding agents inside your own product.", icon: CodeIcon },
    ],
  },
];

const USE_CASES: Link[] = [
  { title: "Bug triage", body: "New issues reproduced and fixed overnight.", icon: BugIcon },
  { title: "Test coverage", body: "Agents write the tests nobody had time for.", icon: TestTubeIcon },
  { title: "Dependency updates", body: "Upgrades that pass CI before you look.", icon: PackageIcon },
  { title: "Code review", body: "A first pass on every pull request.", icon: SealCheckIcon },
  { title: "Migrations", body: "Large refactors split across many agents.", icon: ArrowsClockwiseIcon },
  { title: "Security fixes", body: "Advisories patched in their own branches.", icon: ShieldCheckIcon },
];

const RESOURCES: { heading: string; links: Link[] }[] = [
  {
    heading: "Learn",
    links: [
      { title: "Docs", body: "Guides for setup, threads and the API.", icon: FileTextIcon },
      { title: "Quickstart", body: "Your first agent thread, step by step.", icon: ArrowCircleRightIcon },
      { title: "CLI", body: "Start and steer threads from your terminal.", icon: TerminalWindowIcon },
    ],
  },
  {
    heading: "Updates",
    links: [
      { title: "Changelog", body: "Everything shipped, newest first.", icon: ListBulletsIcon },
      { title: "Blog", body: "Releases, deep dives and field notes.", icon: PencilSimpleIcon },
      { title: "Status", body: "Uptime and incidents.", icon: PulseIcon },
    ],
  },
];

function Row({ title, body, icon: Icon }: Link) {
  return (
    <li>
      <NavigationMenuLink href={`#${title.toLowerCase().replace(/\W+/g, "-")}`}>
        <Icon />
        <span className="grid">
          <span className="font-medium text-fg">{title}</span>
          <span className="text-fg-muted">{body}</span>
        </span>
      </NavigationMenuLink>
    </li>
  );
}

function Groups({ groups }: { groups: { heading: string; links: Link[] }[] }) {
  return (
    <div className="flex">
      {groups.map((group, i) => (
        <div key={group.heading} className={i > 0 ? "ds-rule-y ml-8 max-w-96 min-w-0 flex-1 pl-8" : "max-w-96 min-w-0 flex-1"}>
          <p className="ds-label m-0 mb-3">{group.heading}</p>
          <ul className="-mx-3 m-0 list-none p-0">
            {group.links.map((link) => (
              <Row key={link.title} {...link} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Header({ defaultValue }: { defaultValue?: string }) {
  return (
    <NavigationMenu defaultValue={defaultValue} className="h-16 w-full border-b border-line px-4 sm:px-6">
      <NavigationMenuList>
        <NavigationMenuItem value="product">
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Groups groups={PRODUCT} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="use-cases">
          <NavigationMenuTrigger>Use cases</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="-mx-3 m-0 grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-3">
              {USE_CASES.map((link) => (
                <Row key={link.title} {...link} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="resources" className="max-sm:hidden">
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Groups groups={RESOURCES} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="max-sm:hidden">
          <NavigationMenuLink href="#pricing" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <Button size="sm" className="ml-auto max-sm:hidden">
        Start building
      </Button>
    </NavigationMenu>
  );
}

export function Preview() {
  return <Header />;
}

export function Open() {
  return (
    <div className="min-h-120">
      <Header defaultValue="product" />
    </div>
  );
}

```

## Source

components/ui/navigation-menu.tsx

```tsx
"use client";

import * as React from "react";
import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";
import { buttonVariants } from "@/components/ui/button";

// The site's header nav (.hn__list, .hn__top, .hn__sheet, .hn__panel, .hn__item). Triggers are bare 14px labels in
// graphite with a 12px quiet chevron; under the pointer or while their panel is open, a compact hexagon of the hover
// wash appears behind them, the label turns ink and the chevron turns over (200ms, strong ease-out). The panel is a
// square sheet of the ground the full width of the bar, ruled off underneath by the quiet line, with 32px above and
// 40px below its content. Links are rows of a 20px glyph 12px before a 14px medium label over a 14px quiet line, 8px
// above and below and 12px in; the row under the pointer takes the paper. Group heads are Kode Mono eyebrows and
// groups are divided by dashed rules (ds-rule-y). The panel fades in over 4px in 240ms and leaves faster; moving to
// another trigger slides the content 16px toward it while the sheet takes the new height.
function NavigationMenu({ className, children, viewport = true, ...props }: Omit<React.ComponentProps<typeof BaseNavigationMenu.Root>, "className"> & { className?: string; viewport?: boolean }) {
  const [bar, setBar] = React.useState<HTMLElement | null>(null);
  return (
    <BaseNavigationMenu.Root ref={setBar} data-slot="navigation-menu" data-viewport={viewport} className={cn("relative flex items-center", className)} {...props}>
      {children}
      {viewport && <NavigationMenuViewport anchor={bar} />}
    </BaseNavigationMenu.Root>
  );
}

function NavigationMenuList({ className, ...props }: Omit<React.ComponentProps<typeof BaseNavigationMenu.List>, "className"> & { className?: string }) {
  return <BaseNavigationMenu.List data-slot="navigation-menu-list" className={cn("m-0 flex list-none items-center gap-1 p-0", className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }: Omit<React.ComponentProps<typeof BaseNavigationMenu.Item>, "className"> & { className?: string }) {
  return <BaseNavigationMenu.Item data-slot="navigation-menu-item" className={cn("relative flex items-center", className)} {...props} />;
}

/** The trigger's look: the ghost hexagon key of the site's nav (.hn__top), for a top-level link beside the triggers. */
function navigationMenuTriggerStyle() {
  return cn(buttonVariants({ variant: "ghost" }), "py-0 hover:bg-transparent data-active:text-fg");
}

function NavigationMenuTrigger({ className, children, ...props }: Omit<React.ComponentProps<typeof BaseNavigationMenu.Trigger>, "className"> & { className?: string }) {
  return (
    <BaseNavigationMenu.Trigger data-slot="navigation-menu-trigger" className={cn(navigationMenuTriggerStyle(), "gap-2", className)} {...props}>
      {children}
      <BaseNavigationMenu.Icon
        data-slot="navigation-menu-chevron"
        className="flex text-fg-muted transition-transform duration-moderate ease-out data-popup-open:rotate-180 motion-reduce:transition-none"
      >
        <CaretDownIcon aria-hidden className="size-3" />
      </BaseNavigationMenu.Icon>
    </BaseNavigationMenu.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: Omit<React.ComponentProps<typeof BaseNavigationMenu.Content>, "className"> & { className?: string }) {
  return (
    <BaseNavigationMenu.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-full px-6 pt-8 pb-10 transition-[opacity,translate] duration-slow ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-moderate data-starting-style:data-[activation-direction=left]:-translate-x-4 data-starting-style:data-[activation-direction=right]:translate-x-4 data-ending-style:data-[activation-direction=left]:translate-x-4 data-ending-style:data-[activation-direction=right]:-translate-x-4 motion-reduce:transition-opacity",
        className,
      )}
      {...props}
    />
  );
}

type ViewportProps = Omit<React.ComponentProps<typeof BaseNavigationMenu.Popup>, "className"> & {
  className?: string;
  /** The element the sheet spans and hangs from; by default the bar (the menu's root). */
  anchor?: React.ComponentProps<typeof BaseNavigationMenu.Positioner>["anchor"];
  sideOffset?: number;
};

function NavigationMenuViewport({ className, anchor, sideOffset = 0, ...props }: ViewportProps) {
  const container = usePortalContainer();
  return (
    <BaseNavigationMenu.Portal container={container}>
      <BaseNavigationMenu.Positioner
        data-slot="navigation-menu-positioner"
        anchor={anchor}
        side="bottom"
        align="start"
        sideOffset={sideOffset}
        collisionPadding={0}
        collisionAvoidance={{ side: "none", align: "none" }}
        className="z-50 h-(--positioner-height) w-(--anchor-width) max-w-(--available-width)"
      >
        <BaseNavigationMenu.Popup
          data-slot="navigation-menu-viewport"
          className={cn(
            "relative h-(--popup-height) w-full overflow-hidden border-b border-line bg-surface text-fg outline-none transition-[opacity,translate,height] duration-slow ease-out data-starting-style:-translate-y-1 data-starting-style:opacity-0 data-ending-style:-translate-y-1 data-ending-style:opacity-0 data-ending-style:duration-fast motion-reduce:transition-opacity",
            className,
          )}
          {...props}
        >
          <BaseNavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
        </BaseNavigationMenu.Popup>
      </BaseNavigationMenu.Positioner>
    </BaseNavigationMenu.Portal>
  );
}

type LinkProps = Omit<React.ComponentProps<typeof BaseNavigationMenu.Link>, "className"> & { className?: string; asChild?: boolean };

function NavigationMenuLink({ className, asChild = false, render, children, ...props }: LinkProps) {
  const parts = slot(asChild, children, render);
  return (
    <BaseNavigationMenu.Link
      data-slot="navigation-menu-link"
      render={parts.render}
      className={cn(
        "flex items-start gap-3 px-3 py-2 font-sans text-body-sm leading-line-body-sm text-fg no-underline transition-colors duration-fast ease-out hover:bg-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    >
      {parts.children}
    </BaseNavigationMenu.Link>
  );
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navigation-menu-indicator" aria-hidden className={cn("hidden", className)} {...props} />;
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};

```
