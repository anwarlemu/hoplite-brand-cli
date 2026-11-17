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
