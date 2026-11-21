# Scroll Area
A region that scrolls inside the page with a thin square bar: a 4px thumb of the field line in a 12px lane along the edge, turning to the strong line under the pointer or while it is dragged. Content past an edge fades over 24px there (fade-y; pass orientation="horizontal" for fade-x on a row).

Install: npx hoplite-ds add scroll-area
Requires: theme, utils
Packages: @base-ui/react
Exports: ScrollArea, ScrollBar
Client boundary: yes
Reference: Extrapolated from the Hoplite website: its quiet and strong rules (16, 32 and 70 percent lines) applied to Base UI's scroll area


## Usage
Use ScrollArea for a fixed-height list or log inside a frame (agent runs, a thread's messages, a branch row). Give it a height or max height; add ScrollBar orientation="horizontal" for a row that scrolls sideways.
- Avoid: A rounded or pill thumb
- Avoid: A thumb that grows on hover
- Avoid: A dark or colored track
- Avoid: Scroll areas nested in scroll areas


## Examples
Example components: npx hoplite-ds add scroll-area
[Preview](https://hoplite-ds.vercel.app/preview/scroll-area/Preview) | [Horizontal](https://hoplite-ds.vercel.app/preview/scroll-area/Horizontal) | [Prose](https://hoplite-ds.vercel.app/preview/scroll-area/Prose)

examples/scroll-area.tsx

```tsx
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const RUNS = Array.from({ length: 24 }, (_, i) => ({
  name: ["Fix flaky checkout test", "Bump the Node image", "Triage Sentry issue", "Refactor the billing hook"][i % 4],
  when: `${(i * 7) % 59 + 1} min ago`,
}));

export function Preview() {
  return (
    <ScrollArea className="h-72 w-full max-w-80 border border-line">
      <div className="px-4 pt-4 pb-2">
        <p className="ds-label m-0 pb-3">Agent runs</p>
        <ul className="m-0 list-none border-t border-line p-0">
          {RUNS.map((run, i) => (
            <li key={i} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-body-sm leading-line-body-sm">
              <span className="truncate text-fg-secondary">{run.name}</span>
              <span className="shrink-0 text-fg-muted">{run.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
}

export function Horizontal() {
  return (
    <ScrollArea orientation="horizontal" className="w-full max-w-96 border border-line">
      <div className="flex w-max gap-2 p-4">
        {["main", "fix/null-check", "feat/automations", "chore/node-22", "feat/seats", "fix/flaky-test", "docs/quickstart"].map((branch) => (
          <span key={branch} className="flex h-8 items-center border border-line-field px-3 font-code text-body-sm text-fg">
            {branch}
          </span>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function Prose() {
  return (
    <ScrollArea className="h-48 w-full max-w-md border border-line">
      <div className="grid gap-4 p-5 text-body-sm leading-line-body-sm text-fg-secondary">
        <p className="m-0">Every agent runs in its own sandbox: a fresh container with the repository checked out, its dependencies installed, and nothing shared with the agent beside it.</p>
        <p className="m-0">When a run finishes, the sandbox keeps its logs and its diff for seven days, so a reviewer can open the exact state the agent left behind.</p>
        <p className="m-0">Automations start runs on a schedule or on an event, such as a new Sentry issue or a failing check on main, and open a pull request when the fix passes.</p>
        <p className="m-0">Seats are billed per person, not per agent. Run as many agents as the plan's concurrency allows.</p>
      </div>
    </ScrollArea>
  );
}

```

## Source

components/ui/scroll-area.tsx

```tsx
"use client";

import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";

import { cn } from "@/lib/utils";

// A region that scrolls inside the page (a long thread list, a run log), extrapolated from the Hoplite website's quiet
// rules: the native scroll with a thin square bar instead of the system one. The thumb is a 4px square bar of the field
// line (32 percent) in a 12px lane along the edge, turning to the strong line (70 percent) under the pointer or while
// it is dragged (120ms). The bar only shows when the content overflows. Focus on the viewport is the inset ink outline.
// Content that runs past an edge fades over 24px there (fade-y down the list, fade-x along a row that scrolls sideways).
function ScrollArea({ className, children, orientation = "vertical", ...props }: React.ComponentProps<typeof BaseScrollArea.Root> & { orientation?: "vertical" | "horizontal" }) {
  return (
    <BaseScrollArea.Root data-slot="scroll-area" className={cn("relative min-h-0 overflow-hidden", className)} {...props}>
      <BaseScrollArea.Viewport data-slot="scroll-area-viewport" className={cn("size-full overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring", orientation === "horizontal" ? "fade-x" : "fade-y")}>
        {children}
      </BaseScrollArea.Viewport>
      <ScrollBar />
      <BaseScrollArea.Corner data-slot="scroll-area-corner" />
    </BaseScrollArea.Root>
  );
}

function ScrollBar({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof BaseScrollArea.Scrollbar>) {
  return (
    <BaseScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn("group/scrollbar flex touch-none justify-center select-none", orientation === "vertical" ? "w-3" : "h-3 flex-col", className)}
      {...props}
    >
      <BaseScrollArea.Thumb
        data-slot="scroll-area-thumb"
        className={cn("bg-line-field transition-colors duration-fast ease-out group-hover/scrollbar:bg-line-strong active:bg-line-strong motion-reduce:transition-none", orientation === "vertical" ? "w-1" : "h-1")}
      />
    </BaseScrollArea.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };

```
