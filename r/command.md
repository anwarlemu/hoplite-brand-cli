# Command
A command palette: the site's square popup panel with a 48px search row over the quiet rule, Kode Mono group labels, 36px rows on the hover wash when highlighted and Kode Mono shortcuts at the end; the dialog opens and closes without motion. A long list fades at the edge it scrolls past (fade-y).

Install: npx hoplite-ds add command
Requires: theme, surface, utils
Packages: cmdk, @base-ui/react, @phosphor-icons/react
Exports: Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut
Client boundary: yes
Reference: Extrapolated from the Hoplite website: the nav popup (.hn__panel, .hn__item), Kode Mono labels (.label) and the 32 percent ink scrim


## Usage
Use CommandDialog for a palette opened with Command K (new thread, open a terminal, go to pull requests), or Command inline for a searchable list of actions. Put CommandInput first, then CommandList with CommandEmpty, CommandGroup (heading), CommandItem (onSelect) and CommandSeparator; CommandShortcut shows the keys. Built on cmdk, with the dialog on Base UI Dialog.
- Avoid: An open or close animation
- Avoid: Rounded panels or rows
- Avoid: A highlight that slides between rows
- Avoid: Shortcuts in the body face
- Avoid: More than one palette per app


## Examples
Example components: npx hoplite-ds add command button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/command/Preview) | [Dialog](https://hoplite-ds.vercel.app/preview/command/Dialog)

examples/command.tsx

```tsx
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

```

## Source

components/ui/command.tsx

```tsx
"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A command palette, extrapolated from the site's popup (it has none): a square panel of the ground with the quiet
// hairline and the long soft cast. The search row is 48px: a 16px magnifier in the quiet gray 16px in, then 16px ink text
// (the placeholder in the slate) over the quiet rule. Groups open with Kode Mono labels; rows are the popup's, 36px with
// 12px sides, 14px ink with a 16px glyph in the quiet gray 8px before the label, and the highlighted row on the hover
// wash. Shortcuts sit at the row's end in 12px Kode Mono, tracked 4 percent, in the quiet gray. CommandDialog lays it
// over the ink at 32 percent, 96px from the top, and neither opens nor closes with motion: it is summoned by keyboard
// many times a day.
function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive data-slot="command" className={cn("flex size-full flex-col overflow-hidden bg-surface font-sans text-fg", className)} {...props} />;
}

function CommandDialog({
  title = "Command palette",
  description = "Search for a command to run",
  children,
  className,
  showCloseButton = false,
  commandProps,
  ...props
}: Omit<React.ComponentProps<typeof BaseDialog.Root>, "children"> & { children?: React.ReactNode; title?: string; description?: string; className?: string; showCloseButton?: boolean; commandProps?: React.ComponentProps<typeof Command> }) {
  const container = usePortalContainer();
  return (
    <BaseDialog.Root data-slot="command-dialog" {...props}>
      <BaseDialog.Portal container={container}>
        <BaseDialog.Backdrop data-slot="command-dialog-backdrop" className="fixed inset-0 z-50 bg-scrim" />
        <BaseDialog.Popup data-slot="command-dialog-content" className={cn("fixed inset-x-4 top-24 z-50 mx-auto max-w-140 overflow-hidden bg-surface text-fg shadow-dialog outline-none", className)}>
          <BaseDialog.Title className="sr-only">{title}</BaseDialog.Title>
          <BaseDialog.Description className="sr-only">{description}</BaseDialog.Description>
          <Command {...commandProps} className={cn("[&_[data-slot=command-list]]:max-h-96", commandProps?.className)}>
            {children}
          </Command>
          {showCloseButton && <BaseDialog.Close className="sr-only">Close</BaseDialog.Close>}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-12 shrink-0 items-center gap-3 border-b border-line px-4">
      <MagnifyingGlassIcon aria-hidden className="size-4 shrink-0 text-fg-muted" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn("h-full w-full min-w-0 bg-transparent font-sans text-body leading-line-body text-fg outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed disabled:text-fg-subtle", className)}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return <CommandPrimitive.List data-slot="command-list" className={cn("max-h-80 scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain p-1 fade-y", className)} {...props} />;
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className={cn("py-8 text-center text-body-sm leading-line-body-sm text-fg-muted", className)} {...props} />;
}

function CommandGroup({ className, heading, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      heading={heading == null ? undefined : <span className="ds-label">{heading}</span>}
      className={cn("text-fg [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:h-8 [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:px-3", className)}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex h-9 cursor-default items-center gap-2 px-3 font-sans text-body-sm leading-line-body-sm font-normal text-fg outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:text-fg-subtle data-[selected=true]:bg-subtle-hover pointer-coarse:h-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-fg-muted",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="command-shortcut" className={cn("ml-auto pl-4 font-code text-caption leading-line-caption tracking-code text-fg-muted", className)} {...props} />;
}

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut };

```
