# Menubar
A 40px bar framed by the quiet line holding bare 14px graphite labels; under the pointer or while open, a compact hexagon of the hover wash appears behind a label and it turns ink. Each label opens the dropdown menu's square ground panel aligned to its start, and moving along the bar opens the neighbors. A long menu scrolls inside the panel and fades at the edge it scrolls past (fade-y).

Install: npx hoplite-ds add menubar
Requires: theme, utils, button, dropdown-menu
Packages: @base-ui/react
Exports: Menubar, MenubarCheckboxItem, MenubarContent, MenubarGroup, MenubarItem, MenubarLabel, MenubarMenu, MenubarPortal, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger
Client boundary: yes
Reference: The Hoplite website's header nav items (.hn__list, .hn__top: bare labels with a compact hexagon of the hover fill) and its popups (.hn__sheet, .hn__item); the bar itself is extrapolated.


## Usage
Use for the app menu of a desktop-like tool (Thread, Edit, View, Help) where each menu holds commands with shortcuts. Build each with MenubarMenu, MenubarTrigger and MenubarContent, and the rows with the same parts as Dropdown Menu. For site navigation use Navigation Menu instead.
- Avoid: Pill or square triggers
- Avoid: An ink-filled trigger
- Avoid: Rounded panels
- Avoid: More than five menus
- Avoid: Site navigation links in a menubar


## Examples
Example components: npx hoplite-ds add menubar
[Preview](https://hoplite-ds.vercel.app/preview/menubar/Preview) | [Open](https://hoplite-ds.vercel.app/preview/menubar/Open)

examples/menubar.tsx

```tsx
"use client";

import * as React from "react";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

function Bar({ open }: { open?: boolean }) {
  const [diffs, setDiffs] = React.useState(true);
  const [terminal, setTerminal] = React.useState(false);
  const [layout, setLayout] = React.useState("split");
  return (
    <Menubar>
      <MenubarMenu defaultOpen={open}>
        <MenubarTrigger>Thread</MenubarTrigger>
        <MenubarContent className="w-60">
          <MenubarItem>
            New thread
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New thread in sandbox
            <MenubarShortcut>⇧⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Import setup from</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Claude Code</MenubarItem>
              <MenubarItem>Codex</MenubarItem>
              <MenubarItem>Cursor</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Archive
            <MenubarShortcut>⌘E</MenubarShortcut>
          </MenubarItem>
          <MenubarItem variant="destructive">Delete thread</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Find in thread
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-56">
          <MenubarGroup>
            <MenubarLabel>Panels</MenubarLabel>
            <MenubarCheckboxItem checked={diffs} onCheckedChange={setDiffs}>
              Changes
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={terminal} onCheckedChange={setTerminal}>
              Terminal
            </MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarRadioGroup value={layout} onValueChange={(value) => setLayout(String(value))}>
            <MenubarLabel>Layout</MenubarLabel>
            <MenubarRadioItem value="split">Split</MenubarRadioItem>
            <MenubarRadioItem value="stacked">Stacked</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Docs</MenubarItem>
          <MenubarItem>Changelog</MenubarItem>
          <MenubarItem disabled>Contact support</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function Preview() {
  return <Bar />;
}

export function Open() {
  return (
    <div className="min-h-96">
      <Bar open />
    </div>
  );
}

```

## Source

components/ui/menubar.tsx

```tsx
"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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

// A row of menus drawn like the site's header nav (.hn__list, .hn__top): a 40px bar framed by the quiet line, its menus
// bare 14px labels in graphite; under the pointer or while a menu is open, a compact hexagon of the hover wash appears
// behind the label and it turns ink. Each menu is the dropdown menu's panel (square ground, quiet hairline, long soft
// cast, 36px rows, the hover wash under the pointer), opening under its label, aligned to its start. Once one menu is
// open, moving along the bar opens its neighbors.
function Menubar({ className, ...props }: Omit<React.ComponentProps<typeof BaseMenubar>, "className"> & { className?: string }) {
  return <BaseMenubar data-slot="menubar" className={cn("flex h-10 w-fit items-center gap-1 border border-line bg-surface px-1", className)} {...props} />;
}

function MenubarMenu(props: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="menubar-menu" {...props} />;
}

function MenubarPortal(props: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />;
}

function MenubarTrigger({ className, ...props }: Omit<React.ComponentProps<typeof BaseMenu.Trigger>, "className"> & { className?: string }) {
  return <BaseMenu.Trigger data-slot="menubar-trigger" className={cn(buttonVariants({ variant: "ghost" }), "pointer-coarse:h-8", className)} {...props} />;
}

function MenubarContent({ align = "start", sideOffset = 8, alignOffset = 0, ...props }: React.ComponentProps<typeof DropdownMenuContent>) {
  return <DropdownMenuContent data-slot="menubar-content" align={align} sideOffset={sideOffset} alignOffset={alignOffset} {...props} />;
}

function MenubarGroup(props: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />;
}

function MenubarItem(props: React.ComponentProps<typeof DropdownMenuItem>) {
  return <DropdownMenuItem data-slot="menubar-item" {...props} />;
}

function MenubarCheckboxItem(props: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
  return <DropdownMenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />;
}

function MenubarRadioGroup(props: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarRadioItem(props: React.ComponentProps<typeof DropdownMenuRadioItem>) {
  return <DropdownMenuRadioItem data-slot="menubar-radio-item" {...props} />;
}

function MenubarLabel(props: React.ComponentProps<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel data-slot="menubar-label" {...props} />;
}

function MenubarSeparator(props: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />;
}

function MenubarShortcut(props: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />;
}

function MenubarSub(props: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger(props: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />;
}

function MenubarSubContent(props: React.ComponentProps<typeof DropdownMenuSubContent>) {
  return <DropdownMenuSubContent data-slot="menubar-sub-content" {...props} />;
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};

```
