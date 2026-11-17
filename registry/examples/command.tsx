"use client";

import * as React from "react";
import { ChatsCircleIcon, CubeIcon, GearSixIcon, GitPullRequestIcon, LightningIcon, PlusIcon, TerminalWindowIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";

function Items({ onRun }: { onRun?: (label: string) => void }) {
  const run = (label: string) => () => onRun?.(label);
  return (
    <>
      <CommandEmpty>No command by that name.</CommandEmpty>
      <CommandGroup heading="Actions">
        <CommandItem onSelect={run("New thread")}>
          <PlusIcon />
          New thread
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={run("Open a sandbox terminal")}>
          <TerminalWindowIcon />
          Open a sandbox terminal
          <CommandShortcut>⌘T</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={run("Run automation")}>
          <LightningIcon />
          Run automation
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Go to">
        <CommandItem onSelect={run("Threads")}>
          <ChatsCircleIcon />
          Threads
          <CommandShortcut>G T</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={run("Pull requests")}>
          <GitPullRequestIcon />
          Pull requests
          <CommandShortcut>G P</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={run("Sandboxes")}>
          <CubeIcon />
          Sandboxes
        </CommandItem>
        <CommandItem disabled>
          <GearSixIcon />
          Workspace settings (admins only)
        </CommandItem>
      </CommandGroup>
    </>
  );
}

export function Preview() {
  return (
    <Command className="max-w-120 shadow-floating">
      <CommandInput placeholder="Type a command or search" />
      <CommandList>
        <Items />
      </CommandList>
    </Command>
  );
}

export function Dialog() {
  const [open, setOpen] = React.useState(false);
  const [ran, setRan] = React.useState<string>();
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open the palette
        <span className="font-code text-caption tracking-code text-fg-muted">⌘K</span>
      </Button>
      <p aria-live="polite" className="text-body-sm text-fg-muted">
        {ran ? `Ran: ${ran}` : "Or press Command K."}
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search" />
        <CommandList>
          <Items
            onRun={(label) => {
              setRan(label);
              setOpen(false);
            }}
          />
        </CommandList>
      </CommandDialog>
    </div>
  );
}
