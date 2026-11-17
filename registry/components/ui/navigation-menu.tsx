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
