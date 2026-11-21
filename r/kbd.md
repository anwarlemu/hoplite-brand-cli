# Kbd
A square 20px key cap with a quiet edge and a 12px Kode Mono label; caps in a group sit 4px apart, and on an ink tooltip they follow its light ink.

Install: npx hoplite-ds add kbd
Requires: theme, utils
Packages: none
Exports: Kbd, KbdGroup
Client boundary: not required by this entry file
Reference: Extrapolated from the Hoplite website: the nav's shortcut caps (drawn square, as the brand draws every frame) in Kode Mono


## Usage
Use Kbd to show a keyboard shortcut in a menu row, a tooltip or help text (N, Cmd K). Group the keys of one shortcut in KbdGroup. Use the symbol glyph for modifier keys where the platform is known.
- Avoid: Rounded or pill caps
- Avoid: A filled or raised cap
- Avoid: A shortcut written in body type


## Examples
Example components: npx hoplite-ds add kbd
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/kbd/Preview) | [InText](https://hoplite-ds.vercel.app/preview/kbd/InText) | [OnInk](https://hoplite-ds.vercel.app/preview/kbd/OnInk)

examples/kbd.tsx

```tsx
import { CommandIcon } from "@phosphor-icons/react/ssr";

import { Kbd, KbdGroup } from "@/components/ui/kbd";

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <KbdGroup>
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>Enter</Kbd>
      </KbdGroup>
      <Kbd>Esc</Kbd>
    </div>
  );
}

export function InText() {
  return (
    <p className="max-w-md text-body-sm leading-line-body-sm text-fg-secondary">
      Press <Kbd>N</Kbd> to start a thread, or{" "}
      <KbdGroup>
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>{" "}
      to send the message and keep the agent running.
    </p>
  );
}

export function OnInk() {
  return (
    <div data-slot="tooltip-content" className="inline-flex items-center gap-2 bg-primary px-2 py-1 text-caption leading-line-caption text-on-primary">
      Search threads
      <KbdGroup>
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  );
}

```

## Source

components/ui/kbd.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// A key cap, extrapolated from the site's nav shortcuts: a square 20px cap with a quiet 16 percent edge, 12px Kode Mono
// in the quiet gray, 4px in. On an ink tooltip the edge and label follow the tooltip's light ink. Caps in a group sit
// 4px apart.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 shrink-0 items-center justify-center gap-1 border border-line px-1 font-mono text-caption leading-none font-normal tracking-code text-fg-muted select-none [&_svg:not([class*='size-'])]:size-3 in-data-[slot=tooltip-content]:border-current/30 in-data-[slot=tooltip-content]:text-on-primary",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="kbd-group" className={cn("inline-flex items-center gap-1 font-mono text-caption text-fg-muted", className)} {...props} />;
}

export { Kbd, KbdGroup };

```
