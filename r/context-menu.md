# Context Menu
The dropdown menu's panel opened at the pointer by a right click or a long press: a square ground panel with a quiet hairline and a long soft cast, 36px rows in the hover wash under the pointer, Kode Mono shortcuts, checks and hexagon marks on chosen rows, destructive rows in the orange.

Install: npx hoplite-ds add context-menu
Requires: theme, utils, dropdown-menu
Packages: @base-ui/react
Exports: ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger
Client boundary: yes
Reference: Extrapolated from the Hoplite website's popups (the header nav's sheet and rows, .hn__sheet and .hn__item); the site has no context menu.


## Usage
Use as a shortcut to actions on the thing under the pointer (a thread in a list, a file in a tree). Wrap that area in ContextMenuTrigger and build the panel with the same parts as Dropdown Menu. Every action in it must also be reachable another way, usually a dropdown menu on the same row.
- Avoid: The only way to reach an action
- Avoid: Rounded corners
- Avoid: A white panel
- Avoid: An orange highlight
- Avoid: A styled trigger area that looks like a button


## Examples
Example components: npx hoplite-ds add context-menu
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/context-menu/Preview) | [Options](https://hoplite-ds.vercel.app/preview/context-menu/Options)

examples/context-menu.tsx

```tsx
"use client";

import * as React from "react";
import { ArrowClockwiseIcon, CopyIcon, GitPullRequestIcon, PencilSimpleIcon, PushPinIcon, TrashIcon } from "@phosphor-icons/react/ssr";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function Preview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="ds-corners flex h-48 w-full max-w-md flex-col items-center justify-center gap-1 text-center">
        <span className="text-body-sm leading-line-body-sm font-medium text-fg">Fix flaky upload test</span>
        <span className="text-body-sm leading-line-body-sm text-fg-muted">Right-click, or press and hold, for actions</span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <PencilSimpleIcon />
          Rename
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon />
          Copy thread link
          <ContextMenuShortcut>⌘L</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <ArrowClockwiseIcon />
          Rerun checks
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <GitPullRequestIcon />
            Open pull request
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>As draft</ContextMenuItem>
            <ContextMenuItem>Ready for review</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <TrashIcon />
          Delete thread
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function Options() {
  const [pinned, setPinned] = React.useState(true);
  const [notify, setNotify] = React.useState(false);
  const [agent, setAgent] = React.useState("claude");
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-48 w-full max-w-md items-center justify-center border border-line text-body-sm leading-line-body-sm text-fg-muted">
        <PushPinIcon className="mr-2 size-4" />
        Right-click the thread list
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuGroup>
          <ContextMenuLabel>Thread</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
            Pinned
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={notify} onCheckedChange={setNotify}>
            Notify when done
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={agent} onValueChange={(value) => setAgent(String(value))}>
          <ContextMenuLabel>Agent</ContextMenuLabel>
          <ContextMenuRadioItem value="claude">Claude Code</ContextMenuRadioItem>
          <ContextMenuRadioItem value="codex">Codex</ContextMenuRadioItem>
          <ContextMenuRadioItem value="cursor">Cursor</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

```

## Source

components/ui/context-menu.tsx

```tsx
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

```
