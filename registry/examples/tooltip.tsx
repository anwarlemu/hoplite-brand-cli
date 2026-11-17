"use client";

import { ArchiveIcon, GitBranchIcon, PlusIcon, ShareNetworkIcon, TerminalWindowIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Preview() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="New thread" />}>
        <PlusIcon />
      </TooltipTrigger>
      <TooltipContent>New thread</TooltipContent>
    </Tooltip>
  );
}

export function Open() {
  return (
    <div className="flex min-h-32 items-end justify-center">
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Open in terminal" />}>
          <TerminalWindowIcon />
        </TooltipTrigger>
        <TooltipContent>Open in terminal</TooltipContent>
      </Tooltip>
    </div>
  );
}

const TOOLS = [
  { label: "Open in terminal", icon: TerminalWindowIcon },
  { label: "Branch from here", icon: GitBranchIcon },
  { label: "Share thread", icon: ShareNetworkIcon },
  { label: "Archive", icon: ArchiveIcon },
];

export function Toolbar() {
  return (
    <TooltipProvider>
      <div className="flex w-fit items-center gap-1 border border-line p-1">
        {TOOLS.map(({ label, icon: Icon }) => (
          <Tooltip key={label}>
            <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} />}>
              <Icon />
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

export function Long() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="link" />}>Why is this check queued?</TooltipTrigger>
      <TooltipContent>Your plan runs two sandboxes at once. This check starts when the end-to-end run on acme-web finishes.</TooltipContent>
    </Tooltip>
  );
}
