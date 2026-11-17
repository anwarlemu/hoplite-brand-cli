"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react/ssr";

import { cn, slot } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";

// A menu as the site draws its popups (the nav's sheet, .hn__sheet and .hn__item): a square panel of the ground with a
// quiet hairline and a long soft cast, 4px of air above and below. Rows are 36px with 12px sides and 14px Satoshi in the
// ink, a 16px glyph 8px before the label in the quiet gray; the row under the pointer or the keys takes the hover wash.
// Shortcuts sit at the end in 12px Kode Mono, quiet. A checked row shows an ink check at its end; the chosen radio row
// a small filled ink hexagon. Group labels are Kode Mono caps eyebrows, separators quiet rules, a submenu row ends in a
// caret. Destructive rows are orange. The panel opens from its trigger in 240ms (fade and 0.98 scale on the strong
// ease-out) and leaves in 200ms; with reduced motion it only fades.
const POPUP =
  "max-h-(--available-height) min-w-48 overflow-y-auto overscroll-contain bg-surface py-1 text-fg shadow-floating outline-none origin-(--transform-origin) transition-[opacity,scale] duration-slow ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-moderate data-instant:transition-none motion-reduce:transition-opacity";

const ITEM =
  "relative flex h-9 cursor-default items-center gap-2 px-3 font-sans text-body-sm leading-none whitespace-nowrap text-fg select-none transition-colors duration-fast ease-out data-highlighted:bg-subtle-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring data-disabled:pointer-events-none data-disabled:text-fg-subtle pointer-coarse:h-11 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>svg]:text-fg-muted";

/** A trigger renders a native button unless its `render` (or asChild child) is another tag. */
function isNativeButton(render: unknown) {
  return !React.isValidElement(render) || typeof render.type !== "string" || render.type === "button";
}

const InGroup = React.createContext(false);

function DropdownMenu(props: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: React.ComponentProps<typeof BaseMenu.Portal>) {
  const container = usePortalContainer();
  return <BaseMenu.Portal data-slot="dropdown-menu-portal" container={container} {...props} />;
}

function DropdownMenuTrigger({ asChild = false, render, nativeButton, children, ...props }: React.ComponentProps<typeof BaseMenu.Trigger> & { asChild?: boolean }) {
  const parts = slot(asChild, children, render);
  return (
    <BaseMenu.Trigger data-slot="dropdown-menu-trigger" render={parts.render} nativeButton={nativeButton ?? isNativeButton(parts.render)} {...props}>
      {parts.children}
    </BaseMenu.Trigger>
  );
}

type Placement = Pick<React.ComponentProps<typeof BaseMenu.Positioner>, "side" | "align" | "sideOffset" | "alignOffset" | "collisionPadding" | "anchor">;
type ContentProps = React.ComponentProps<typeof BaseMenu.Popup> & Placement & { className?: string };

function DropdownMenuContent({ className, side, align = "start", sideOffset = 4, alignOffset = 0, collisionPadding = 8, anchor, ...props }: ContentProps) {
  return (
    <DropdownMenuPortal>
      <BaseMenu.Positioner className="z-50 outline-none" side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} collisionPadding={collisionPadding} anchor={anchor}>
        <BaseMenu.Popup data-slot="dropdown-menu-content" className={cn(POPUP, className)} {...props} />
      </BaseMenu.Positioner>
    </DropdownMenuPortal>
  );
}

function DropdownMenuGroup(props: React.ComponentProps<typeof BaseMenu.Group>) {
  return (
    <InGroup.Provider value>
      <BaseMenu.Group data-slot="dropdown-menu-group" {...props} />
    </InGroup.Provider>
  );
}

type ItemProps = Omit<React.ComponentProps<typeof BaseMenu.Item>, "className" | "onSelect"> & {
  className?: string;
  inset?: boolean;
  variant?: "default" | "destructive";
  /** shadcn's selection callback: runs with the click that picks the row. */
  onSelect?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

function DropdownMenuItem({ className, inset, variant = "default", onSelect, onClick, ...props }: ItemProps) {
  return (
    <BaseMenu.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      data-inset={inset ? "" : undefined}
      onClick={
        onSelect
          ? (event) => {
              onClick?.(event);
              onSelect(event as React.MouseEvent<HTMLDivElement>);
            }
          : onClick
      }
      className={cn(ITEM, inset && "pl-9", variant === "destructive" && "text-danger [&>svg]:text-danger", className)}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({ className, children, inset, ...props }: Omit<React.ComponentProps<typeof BaseMenu.CheckboxItem>, "className"> & { className?: string; inset?: boolean }) {
  return (
    <BaseMenu.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn(ITEM, "pr-10", inset && "pl-9", className)} {...props}>
      {children}
      <span aria-hidden className="pointer-events-none absolute right-3 flex size-4 items-center justify-center">
        <BaseMenu.CheckboxItemIndicator data-slot="dropdown-menu-checkbox-item-indicator" className="flex">
          <CheckIcon className="size-4 text-fg" />
        </BaseMenu.CheckboxItemIndicator>
      </span>
    </BaseMenu.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof BaseMenu.RadioGroup>) {
  return (
    <InGroup.Provider value>
      <BaseMenu.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
    </InGroup.Provider>
  );
}

function DropdownMenuRadioItem({ className, children, inset, ...props }: Omit<React.ComponentProps<typeof BaseMenu.RadioItem>, "className"> & { className?: string; inset?: boolean }) {
  return (
    <BaseMenu.RadioItem data-slot="dropdown-menu-radio-item" className={cn(ITEM, "pr-10", inset && "pl-9", className)} {...props}>
      {children}
      <span aria-hidden className="pointer-events-none absolute right-3 flex size-4 items-center justify-center">
        <BaseMenu.RadioItemIndicator data-slot="dropdown-menu-radio-item-indicator" className="ds-hex-mark size-2 bg-fg" />
      </span>
    </BaseMenu.RadioItem>
  );
}

function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  const inGroup = React.useContext(InGroup);
  const classes = cn("ds-label px-3 pt-2 pb-1 select-none", inset && "pl-9", className);
  if (inGroup) return <BaseMenu.GroupLabel data-slot="dropdown-menu-label" className={classes} {...props} />;
  return <div data-slot="dropdown-menu-label" role="presentation" className={classes} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: Omit<React.ComponentProps<typeof BaseMenu.Separator>, "className"> & { className?: string }) {
  return <BaseMenu.Separator data-slot="dropdown-menu-separator" className={cn("my-1 h-px bg-line", className)} {...props} />;
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn("ml-auto pl-6 font-code text-caption leading-none tracking-code text-fg-muted", className)} {...props} />;
}

function DropdownMenuSub(props: React.ComponentProps<typeof BaseMenu.SubmenuRoot>) {
  return <BaseMenu.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: Omit<React.ComponentProps<typeof BaseMenu.SubmenuTrigger>, "className"> & { className?: string; inset?: boolean }) {
  return (
    <BaseMenu.SubmenuTrigger data-slot="dropdown-menu-sub-trigger" className={cn(ITEM, "data-popup-open:bg-subtle-hover", inset && "pl-9", className)} {...props}>
      {children}
      <CaretRightIcon aria-hidden className="ml-auto size-4 text-fg-muted" />
    </BaseMenu.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({ side = "inline-end", align = "start", sideOffset = 0, alignOffset = -4, ...props }: ContentProps) {
  return <DropdownMenuContent data-slot="dropdown-menu-sub-content" side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
