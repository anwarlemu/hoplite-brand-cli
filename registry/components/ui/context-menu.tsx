"use client";

import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";

import { cn } from "@/lib/utils";
import {
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
} from "@/components/ui/dropdown-menu";

// The dropdown menu's panel, opened at the pointer on a right click or a long press: a square panel of the ground with
// a quiet hairline and a long soft cast, 36px rows of 14px Satoshi, the row under the pointer in the hover wash, Kode
// Mono shortcuts at the end, an ink check or a small ink hexagon on chosen rows, destructive rows in the orange. The
// trigger is the area that answers the click; it has no look of its own. The panel opens in 240ms (fade and 0.98 scale
// from the pointer, strong ease-out) and leaves in 200ms.
function ContextMenu(props: React.ComponentProps<typeof BaseContextMenu.Root>) {
  return <BaseContextMenu.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ className, ...props }: Omit<React.ComponentProps<typeof BaseContextMenu.Trigger>, "className"> & { className?: string }) {
  return <BaseContextMenu.Trigger data-slot="context-menu-trigger" className={cn("select-none", className)} {...props} />;
}

function ContextMenuPortal(props: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuContent({ sideOffset = 0, align = "start", ...props }: React.ComponentProps<typeof DropdownMenuContent>) {
  return <DropdownMenuContent data-slot="context-menu-content" sideOffset={sideOffset} align={align} {...props} />;
}

function ContextMenuGroup(props: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="context-menu-group" {...props} />;
}

function ContextMenuItem(props: React.ComponentProps<typeof DropdownMenuItem>) {
  return <DropdownMenuItem data-slot="context-menu-item" {...props} />;
}

function ContextMenuCheckboxItem(props: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
  return <DropdownMenuCheckboxItem data-slot="context-menu-checkbox-item" {...props} />;
}

function ContextMenuRadioGroup(props: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuRadioItem(props: React.ComponentProps<typeof DropdownMenuRadioItem>) {
  return <DropdownMenuRadioItem data-slot="context-menu-radio-item" {...props} />;
}

function ContextMenuLabel(props: React.ComponentProps<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel data-slot="context-menu-label" {...props} />;
}

function ContextMenuSeparator(props: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator data-slot="context-menu-separator" {...props} />;
}

function ContextMenuShortcut(props: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="context-menu-shortcut" {...props} />;
}

function ContextMenuSub(props: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger(props: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger data-slot="context-menu-sub-trigger" {...props} />;
}

function ContextMenuSubContent(props: React.ComponentProps<typeof DropdownMenuSubContent>) {
  return <DropdownMenuSubContent data-slot="context-menu-sub-content" {...props} />;
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
