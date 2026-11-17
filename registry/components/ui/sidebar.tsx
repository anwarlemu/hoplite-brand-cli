"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Tooltip } from "@base-ui/react/tooltip";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { SidebarSimpleIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePortalContainer } from "@/lib/surface";
import { cn, slot } from "@/lib/utils";

// The app's rail, drawn from the Hoplite website's quiet ruled rails (the blog post's On this page rail, .bp-rail, and
// the changelog's, .cl-rail) and its nav items (.hn__top). The rail is 288px of the ground with a quiet 16 percent rule
// on its inner edge; a 64px head holds the lockup 12px in. Group labels are Kode Mono 12px capitals in the quiet gray
// (ds-label) lined up with the rows' glyphs. Rows are 36px: a 20px Phosphor glyph 12px in and a 14px graphite label
// 12px after it. The row under the pointer and the current row take a compact hexagon of the hover wash (8px cuts,
// the nav items' shape) and their label and glyph turn ink (120ms); inside the rail's 12px margins the hexagon reads
// as one more Hoplite key in the line, so the rail keeps the site's single hover family. The foot is ruled off above.
// Collapsing to icons narrows the rail to 36px hexagons around the glyphs, each naming itself in a small ink tooltip
// 12px to the right; the rail slides on the drawer curve in 240ms, and the keyboard shortcut (Cmd or Ctrl and B)
// changes it at once. On a phone the rail is a sheet that slides in from its edge over the ink at 32 percent. Counts
// at a row's end are Kode Mono figures in the quiet gray.
const SIDEBAR_WIDTH = "var(--ds-layout-rail)";
const SIDEBAR_WIDTH_ICON = "calc(var(--ds-space-9) + var(--ds-space-6) + var(--ds-space-px))";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const MOBILE_QUERY = "(max-width: 767px)";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  instant: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isMobile;
}

/**
 * Holds whether the rail is open (expanded or collapsed on a desktop, shown in a sheet on a phone). Uncontrolled with
 * `defaultOpen`, or controlled with `open` and `onOpenChange`. Nothing is stored: keep the state yourself if it should
 * survive a reload. Cmd or Ctrl and B toggles it.
 */
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }: React.ComponentProps<"div"> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value;
      if (setOpenProp) setOpenProp(next);
      else setInternalOpen(next);
    },
    [setOpenProp, open],
  );
  const toggleSidebar = React.useCallback(() => {
    setInstant(false);
    return isMobile ? setOpenMobile((o) => !o) : setOpen((o) => !o);
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    // A shortcut is pressed many times a day: it changes the rail at once, with no motion.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== SIDEBAR_KEYBOARD_SHORTCUT || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setInstant(true);
      if (isMobile) setOpenMobile((o) => !o);
      else setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobile, setOpen]);

  const state = open ? "expanded" : "collapsed";
  const value = React.useMemo<SidebarContextProps>(() => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, instant }), [state, open, setOpen, isMobile, openMobile, toggleSidebar, instant]);

  return (
    <SidebarContext.Provider value={value}>
      <Tooltip.Provider delay={0}>
        <div
          data-slot="sidebar-wrapper"
          data-instant={instant || undefined}
          style={{ "--sidebar-width": SIDEBAR_WIDTH, "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, ...style } as React.CSSProperties}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full bg-surface text-fg", className)}
          {...props}
        >
          {children}
        </div>
      </Tooltip.Provider>
    </SidebarContext.Provider>
  );
}

const SLIDE = "transition-[translate,width] duration-slow ease-drawer in-data-instant:transition-none motion-reduce:transition-none";

/**
 * The rail. `variant`: sidebar (the ground with a quiet rule on its inner edge), floating (a square frame of the quiet
 * rule, 8px from the edges) or inset (the rail with no rule, the page beside it framed by the quiet rule).
 * `collapsible`: offcanvas (slides away), icon (narrows to its glyphs) or none.
 */
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { side?: "left" | "right"; variant?: "sidebar" | "floating" | "inset"; collapsible?: "offcanvas" | "icon" | "none" }) {
  const { isMobile, state, openMobile, setOpenMobile, instant } = useSidebar();
  const container = usePortalContainer();

  if (collapsible === "none") {
    return (
      <div data-slot="sidebar" data-variant={variant} className={cn("group/sidebar flex h-full w-(--sidebar-width) flex-col bg-surface text-fg", variant === "sidebar" && (side === "left" ? "border-r border-line" : "border-l border-line"), className)} {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Dialog.Root open={openMobile} onOpenChange={setOpenMobile}>
        <Dialog.Portal container={container}>
          <Dialog.Backdrop data-slot="sidebar-backdrop" className={cn("fixed inset-0 z-50 bg-scrim transition-opacity duration-slow ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-moderate motion-reduce:transition-none", instant && "transition-none")} />
          <Dialog.Popup
            data-slot="sidebar"
            data-sidebar="sidebar"
            data-mobile="true"
            data-variant={variant}
            className={cn(
              "group/sidebar fixed inset-y-0 z-50 flex w-(--sidebar-width) max-w-[calc(100vw-var(--ds-space-12))] flex-col bg-surface text-fg outline-none transition-transform duration-slow ease-drawer data-ending-style:duration-moderate motion-reduce:transition-none",
              side === "left" ? "left-0 border-r border-line data-starting-style:-translate-x-full data-ending-style:-translate-x-full" : "right-0 border-l border-line data-starting-style:translate-x-full data-ending-style:translate-x-full",
              instant && "transition-none",
            )}
            style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties}
          >
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">The app&apos;s sections and settings.</Dialog.Description>
            {children}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <div data-slot="sidebar" data-state={state} data-collapsible={state === "collapsed" ? collapsible : ""} data-variant={variant} data-side={side} className="group/sidebar peer hidden shrink-0 text-fg md:block">
      {/* Holds the rail's room in the row, so the page beside it moves as it opens and closes. */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative h-full w-(--sidebar-width) bg-transparent group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon) group-data-[collapsible=offcanvas]/sidebar:w-0",
          SLIDE,
          variant !== "sidebar" && "group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+var(--ds-space-4))]",
        )}
      >
        <div
          data-slot="sidebar-container"
          className={cn(
            "sticky top-0 z-10 flex h-svh max-h-full w-(--sidebar-width) overflow-hidden",
            SLIDE,
            side === "left" ? "left-0 group-data-[collapsible=offcanvas]/sidebar:-translate-x-full" : "ml-auto group-data-[collapsible=offcanvas]/sidebar:translate-x-full",
            variant === "sidebar" ? "group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon)" : "p-2 group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+var(--ds-space-4))]",
            variant === "sidebar" && (side === "left" ? "border-r border-line" : "border-l border-line"),
            className,
          )}
          {...props}
        >
          <div data-sidebar="sidebar" data-slot="sidebar-inner" className={cn("flex h-full w-full flex-col bg-surface", variant === "floating" && "border border-line")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The ghost glyph key that opens and closes the rail (a 32px key whose compact hexagon of the wash shows under the pointer). */
function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open, isMobile, openMobile } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      aria-expanded={isMobile ? openMobile : open}
      className={cn("text-fg", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <SidebarSimpleIcon />
      <span className="sr-only">Toggle the sidebar</span>
    </Button>
  );
}

/** A thin strip along the rail's edge that toggles it; under the pointer the rail's rule turns to the strong line. */
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle the sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle the sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-transparent after:transition-colors after:duration-fast after:ease-out hover:after:bg-line-strong motion-reduce:after:transition-none sm:flex",
        "in-data-[side=left]:-right-4 in-data-[side=left]:cursor-w-resize in-data-[side=right]:left-0 in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        className,
      )}
      {...props}
    />
  );
}

/** The page beside the rail. With the inset rail it is framed by the quiet rule, 8px from the edges. */
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="sidebar-inset" className={cn("relative flex w-full min-w-0 flex-1 flex-col bg-surface", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-line", className)} {...props} />;
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input data-slot="sidebar-input" data-sidebar="input" className={cn("h-9 pointer-coarse:h-9", className)} {...props} />;
}

/** The rail's 64px head: the lockup or a workspace switcher, 12px in. */
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" data-sidebar="header" className={cn("flex min-h-16 shrink-0 flex-col justify-center gap-2 p-3", className)} {...props} />;
}

/** The rail's foot (settings, the account), ruled off above. */
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" data-sidebar="footer" className={cn("flex shrink-0 flex-col gap-1 border-t border-line p-3", className)} {...props} />;
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr data-slot="sidebar-separator" data-sidebar="separator" className={cn("mx-3 my-0 h-px shrink-0 border-0 bg-line", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" data-sidebar="content" className={cn("flex min-h-0 flex-1 flex-col overflow-auto overscroll-contain [scrollbar-width:none] group-data-[collapsible=icon]/sidebar:overflow-hidden", className)} {...props} />;
}

/** A group of rows, 12px in from the rail's sides; a labeled group keeps 12px above and below it. */
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" data-sidebar="group" className={cn("relative flex w-full min-w-0 flex-col p-3 [&:not(:has(>[data-slot=sidebar-group-label]))]:py-1", className)} {...props} />;
}

type SlotProps<T extends keyof React.JSX.IntrinsicElements> = useRender.ComponentProps<T> & { asChild?: boolean };

/** A group's Kode Mono label, lined up with the rows' glyphs; it fades away when the rail narrows to its glyphs. */
function SidebarGroupLabel({ asChild, render, children, className, ...props }: SlotProps<"div">) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "div",
    render: parts.render,
    props: {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "ds-label flex h-8 shrink-0 items-center px-3 whitespace-nowrap transition-[margin,opacity] duration-slow ease-drawer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring group-data-[collapsible=icon]/sidebar:-mt-8 group-data-[collapsible=icon]/sidebar:opacity-0 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      ),
      ...props,
      children: parts.children,
    },
  });
}

/** A group's action beside its label (a plus to add a repository): a 16px glyph in a 24px target at the right. */
function SidebarGroupAction({ asChild, render, children, className, ...props }: SlotProps<"button">) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "button",
    render: parts.render,
    props: {
      "data-slot": "sidebar-group-action",
      "data-sidebar": "group-action",
      className: cn(
        "absolute top-4 right-4 flex size-6 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-fast ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring group-data-[collapsible=icon]/sidebar:hidden motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      ),
      ...(parts.render ? {} : { type: "button" as const }),
      ...props,
      children: parts.children,
    },
  });
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-content" data-sidebar="group-content" className={cn("w-full", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" data-sidebar="menu" className={cn("m-0 flex w-full min-w-0 list-none flex-col gap-1 p-0", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />;
}

// A row: 36px, the 20px glyph 12px in and the 14px label 12px after it, both graphite. The row under the pointer and the
// current row take a compact hexagon of the hover wash and turn ink; a pressed row the pressed wash. Narrowed to icons,
// it is a 36px hexagon around its glyph.
const sidebarMenuButtonVariants = cva(
  "peer/menu-button ds-hex-frame-s flex w-full cursor-pointer items-center gap-3 overflow-hidden px-3 text-left font-sans font-normal text-fg-secondary no-underline transition-colors duration-fast ease-out hover:text-fg hover:before:bg-subtle-hover active:before:bg-pressed focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring disabled:pointer-events-none disabled:text-fg-subtle aria-disabled:pointer-events-none aria-disabled:text-fg-subtle data-active:text-fg data-active:before:bg-subtle-hover data-popup-open:text-fg data-popup-open:before:bg-subtle-hover group-has-data-[sidebar=menu-action]/menu-item:pr-10 group-has-data-[sidebar=menu-badge]/menu-item:pr-12 group-data-[collapsible=icon]/sidebar:size-9! group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:p-0! group-data-[collapsible=icon]/sidebar:[&>span]:sr-only motion-reduce:transition-none [&>span:last-child]:truncate [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "",
        outline: "before:bg-line-field after:bg-surface hover:before:bg-line-strong hover:after:bg-subtle-hover",
      },
      size: {
        default: "h-9 text-body-sm leading-line-body-sm",
        sm: "h-8 text-body-sm leading-line-body-sm [&>svg:not([class*='size-'])]:size-4",
        lg: "h-12 text-body-sm leading-line-body-sm group-data-[collapsible=icon]/sidebar:p-0!",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type SidebarMenuButtonProps = SlotProps<"button"> & { isActive?: boolean; tooltip?: string | React.ComponentProps<typeof Tooltip.Popup> } & VariantProps<typeof sidebarMenuButtonVariants>;

function SidebarMenuButton({ asChild, render, children, isActive = false, variant = "default", size = "default", tooltip, className, ...props }: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar();
  const container = usePortalContainer();
  const parts = slot(asChild, children, render);
  const button = useRender({
    defaultTagName: "button",
    render: parts.render,
    props: {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive || undefined,
      "aria-current": isActive ? ("page" as const) : undefined,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...(parts.render ? {} : { type: "button" as const }),
      ...props,
      children: parts.children,
    },
  });
  if (!tooltip) return button;
  const content = typeof tooltip === "string" ? { children: tooltip } : tooltip;
  // The tooltip names a row only while the rail shows glyphs alone.
  return (
    <Tooltip.Root disabled={state !== "collapsed" || isMobile}>
      <Tooltip.Trigger render={button} />
      <Tooltip.Portal container={container}>
        <Tooltip.Positioner side="right" align="center" sideOffset={12} className="z-50">
          <Tooltip.Popup
            data-slot="sidebar-tooltip"
            {...content}
            className={cn("bg-primary px-2 py-1 font-sans text-caption leading-line-caption text-on-primary transition-opacity duration-base ease-out data-ending-style:opacity-0 data-instant:transition-none data-starting-style:opacity-0 motion-reduce:transition-none", content.className as string | undefined)}
          />
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** An action at a row's right end (a row's more glyph). `showOnHover` keeps it out of sight until the row is hovered, focused or open. */
function SidebarMenuAction({ asChild, render, children, showOnHover = false, className, ...props }: SlotProps<"button"> & { showOnHover?: boolean }) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "button",
    render: parts.render,
    props: {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      className: cn(
        "absolute top-1.5 right-2 flex size-6 cursor-pointer items-center justify-center text-fg-muted transition-[color,opacity] duration-fast ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring group-data-[collapsible=icon]/sidebar:hidden motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0",
        "peer-data-[size=sm]/menu-button:top-1 peer-data-[size=lg]/menu-button:top-3",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-popup-open:opacity-100 peer-data-active/menu-button:text-fg pointer-fine:opacity-0",
        className,
      ),
      ...(parts.render ? {} : { type: "button" as const }),
      ...props,
      children: parts.children,
    },
  });
}

/** A count at a row's right end, 12px in: Kode Mono 12px figures in the quiet gray (ink on the current row). */
function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute top-1/2 right-3 flex h-5 -translate-y-1/2 items-center font-mono text-caption leading-none tracking-code text-fg-muted tabular-nums select-none peer-data-active/menu-button:text-fg group-data-[collapsible=icon]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

/** A row's placeholder while the rail loads: a glyph square and a label of varying width in the hover wash. */
function SidebarMenuSkeleton({ className, showIcon = false, ...props }: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  // A width between 50 and 90 percent that differs from row to row but is the same on the server and in the browser.
  const id = React.useId();
  const width = `${50 + ([...id].reduce((sum, c) => (sum * 31 + c.charCodeAt(0)) % 997, 7) % 41)}%`;
  return (
    <div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" className={cn("flex h-9 items-center gap-3 px-3", className)} {...props}>
      {showIcon && <div className="size-5 shrink-0 animate-pulse bg-subtle-hover motion-reduce:animate-none" data-sidebar="menu-skeleton-icon" />}
      <div className="h-3 max-w-(--skeleton-width) flex-1 animate-pulse bg-subtle-hover motion-reduce:animate-none" data-sidebar="menu-skeleton-text" style={{ "--skeleton-width": width } as React.CSSProperties} />
    </div>
  );
}

/** Rows nested under a row, hung from a quiet rule under the parent's glyph. */
function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn("my-0 mr-0 ml-[calc(var(--ds-space-5)+var(--ds-space-px))] flex min-w-0 list-none flex-col gap-1 border-l border-line py-1 pr-0 pl-3 group-data-[collapsible=icon]/sidebar:hidden", className)}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-sub-item" data-sidebar="menu-sub-item" className={cn("group/menu-sub-item relative", className)} {...props} />;
}

function SidebarMenuSubButton({ asChild, render, children, size = "md", isActive = false, className, ...props }: SlotProps<"a"> & { size?: "sm" | "md"; isActive?: boolean }) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "a",
    render: parts.render,
    props: {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive || undefined,
      "aria-current": isActive ? ("page" as const) : undefined,
      className: cn(
        "ds-hex-frame-s flex h-8 min-w-0 cursor-pointer items-center gap-2 overflow-hidden px-3 font-sans text-fg-secondary no-underline transition-colors duration-fast ease-out hover:text-fg hover:before:bg-subtle-hover active:before:bg-pressed focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-disabled:pointer-events-none aria-disabled:text-fg-subtle data-active:text-fg data-active:before:bg-subtle-hover motion-reduce:transition-none [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        size === "sm" ? "text-caption leading-line-caption" : "text-body-sm leading-line-body-sm",
        className,
      ),
      ...props,
      children: parts.children,
    },
  });
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
