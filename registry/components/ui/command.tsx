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
