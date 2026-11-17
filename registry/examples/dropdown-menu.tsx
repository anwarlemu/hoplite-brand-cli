"use client";

import * as React from "react";
import { ArchiveIcon, CaretDownIcon, CopyIcon, DotsThreeIcon, GitBranchIcon, LinkSimpleIcon, PencilSimpleIcon, ShareNetworkIcon, SlackLogoIcon, TerminalWindowIcon, TrashIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ThreadMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Thread actions
        <CaretDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Fix flaky upload test</DropdownMenuLabel>
          <DropdownMenuItem>
            <TerminalWindowIcon />
            Open in terminal
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PencilSimpleIcon />
            Rename
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GitBranchIcon />
            Branch from here
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ShareNetworkIcon />
            Share
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <LinkSimpleIcon />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SlackLogoIcon />
              Send to Slack
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <ArchiveIcon />
          Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <TrashIcon />
          Delete thread
          <DropdownMenuShortcut className="text-danger">⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Preview() {
  return <ThreadMenu />;
}

export function Open() {
  return (
    <div className="min-h-96">
      <ThreadMenu defaultOpen />
    </div>
  );
}

const SANDBOXES = [
  { name: "acme-web", branch: "fix/upload-retry", state: "Running" },
  { name: "acme-api", branch: "main", state: "Idle" },
  { name: "billing-worker", branch: "feat/seat-proration", state: "Running" },
];

export function RowActions() {
  return (
    <ul className="m-0 w-full max-w-lg list-none p-0">
      {SANDBOXES.map((box) => (
        <li key={box.name} className="flex items-center gap-4 border-b border-line py-3 first:border-t">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-body-sm leading-line-body-sm font-medium text-fg">{box.name}</span>
            <span className="font-code text-caption leading-line-caption tracking-code text-fg-muted">{box.branch}</span>
          </div>
          <span className="text-body-sm text-fg-muted">{box.state}</span>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${box.name}`} />}>
              <DotsThreeIcon weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <TerminalWindowIcon />
                Open shell
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CopyIcon />
                Copy sandbox ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <TrashIcon />
                Stop sandbox
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  );
}

export function Options() {
  const [sandboxes, setSandboxes] = React.useState(true);
  const [archived, setArchived] = React.useState(false);
  const [sort, setSort] = React.useState("recent");
  return (
    <div className="min-h-96">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          View
          <CaretDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Show</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={sandboxes} onCheckedChange={setSandboxes}>
              Sandboxes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={archived} onCheckedChange={setArchived}>
              Archived threads
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem disabled>Deleted threads</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(String(value))}>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioItem value="recent">Most recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">Most active</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
