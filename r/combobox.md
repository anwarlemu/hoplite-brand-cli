# Combobox
A searchable choice: the square 40px field you type into (or a field button whose list holds its own search row), opening the site's square popup with 36px rows, the highlighted row on the hover wash and a check at the end of each chosen row; several values sit in the field as outlined hexagon chips. A long list fades at the edge it scrolls past (fade-y).

Install: npx hoplite-ds add combobox
Requires: theme, surface, utils
Packages: @base-ui/react, @phosphor-icons/react
Exports: Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxClear, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue, useComboboxAnchor
Client boundary: yes
Reference: Extrapolated from the Hoplite website: the field lines and 14px controls, the nav popup (.hn__panel, .hn__item) and the outlined tag hexagon (.tag)


## Usage
Use instead of Select when there are more than about fifteen choices or people know what they want (a repository, an agent, a branch or pull request). Pass items to Combobox and render rows with a function in ComboboxList; put ComboboxEmpty beside it. Type in ComboboxInput (showClear adds a clear key), or use ComboboxTrigger with ComboboxValue and put ComboboxInput inside ComboboxContent for a search row. For several values use multiple with ComboboxChips, ComboboxChip and ComboboxChipsInput, and pass useComboboxAnchor's ref to ComboboxContent. Group with ComboboxGroup, ComboboxLabel and ComboboxCollection. Built on Base UI Combobox.
- Avoid: A combobox for five or fewer choices (use Select or a radio group)
- Avoid: Rounded fields or chips
- Avoid: Animating the highlight between rows
- Avoid: A list without an empty state
- Avoid: Orange chips


## Examples
Example components: npx hoplite-ds add combobox
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/combobox/Preview) | [WithTrigger](https://hoplite-ds.vercel.app/preview/combobox/WithTrigger) | [Multiple](https://hoplite-ds.vercel.app/preview/combobox/Multiple) | [Grouped](https://hoplite-ds.vercel.app/preview/combobox/Grouped)

examples/combobox.tsx

```tsx
"use client";

import * as React from "react";
import { GitBranchIcon, RobotIcon } from "@phosphor-icons/react/ssr";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

const REPOS = ["acme/api", "acme/web", "acme/storefront", "acme/mobile", "acme/infra", "acme/docs", "acme/billing", "acme/search", "acme/design-system", "acme/data-pipeline"];

export function Preview() {
  const id = React.useId();
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-fg">
        Repository
      </label>
      <Combobox items={REPOS} defaultValue="acme/api">
        <ComboboxInput id={id} placeholder="Search repositories" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No repository by that name.</ComboboxEmpty>
          <ComboboxList>
            {(repo: string) => (
              <ComboboxItem key={repo} value={repo}>
                <GitBranchIcon />
                {repo}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

type Agent = { value: string; label: string };
const AGENTS: Agent[] = [
  { value: "claude", label: "Claude Code" },
  { value: "codex", label: "Codex" },
  { value: "amp", label: "Amp" },
  { value: "gemini", label: "Gemini CLI" },
  { value: "cursor", label: "Cursor agent" },
  { value: "opencode", label: "OpenCode" },
];

export function WithTrigger() {
  const [agent, setAgent] = React.useState<Agent | null>(AGENTS[0]);
  return (
    <div className="grid w-full max-w-sm gap-2">
      <span id="agent-label" className="text-body-sm font-medium text-fg">
        Agent for new threads
      </span>
      <Combobox items={AGENTS} value={agent} onValueChange={setAgent}>
        <ComboboxTrigger aria-labelledby="agent-label">
          <ComboboxValue placeholder="Choose an agent" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search agents" />
          <ComboboxEmpty>No agent with that name.</ComboboxEmpty>
          <ComboboxList>
            {(a: Agent) => (
              <ComboboxItem key={a.value} value={a}>
                <RobotIcon />
                {a.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

const CHECKS = ["typecheck", "lint", "unit tests", "e2e tests", "build", "preview deploy", "bundle size", "license scan"];

export function Multiple() {
  const id = React.useId();
  const anchor = useComboboxAnchor();
  return (
    <div className="grid w-full max-w-md gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-fg">
        Required checks
      </label>
      <Combobox items={CHECKS} multiple defaultValue={["typecheck", "unit tests"]}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((v) => (
                  <ComboboxChip key={v} aria-label={v}>
                    {v}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput id={id} placeholder={values.length ? "" : "Add checks"} />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No check by that name.</ComboboxEmpty>
          <ComboboxList>
            {(check: string) => (
              <ComboboxItem key={check} value={check}>
                {check}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p className="text-body-sm text-fg-muted">A pull request merges once these pass.</p>
    </div>
  );
}

const GROUPS = [
  { value: "Branches", items: ["main", "develop", "release/1.4"] },
  { value: "Pull requests", items: ["PR 4820: Fix flaky checkout test", "PR 4791: Migrate auth to sessions", "PR 4710: Bump Next to 16.1"] },
];

export function Grouped() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Combobox items={GROUPS}>
        <ComboboxInput aria-label="Base for the sandbox" placeholder="Branch or pull request" />
        <ComboboxContent>
          <ComboboxEmpty>Nothing matches.</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof GROUPS)[number]) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

```

## Source

components/ui/combobox.tsx

```tsx
"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/ssr";

import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A searchable choice, extrapolated from the site's field and popup (the site has none). The field is the input: square,
// 40px, a 32 percent edge on the ground that turns strong under the pointer and while the list is open, the ink on focus;
// 14px ink text 12px in, a 16px caret in the quiet gray at the right and, once something is chosen, a 16px clear key
// beside it. ComboboxTrigger is the same field as a button (the value or a slate placeholder), for a list that holds its
// own search row: a 40px row with a 16px magnifier over the quiet rule. The list is the site's popup 4px below: a square
// panel of the ground with the hairline and long soft cast, 4px inside, 36px rows with 12px sides, the highlighted row
// on the hover wash at once (it follows the keys) and a 16px check at the end of each chosen row. Group heads are Kode
// Mono labels. For several values, ComboboxChips is the field holding 24px outlined hexagon chips with an x, then the
// typing. The list grows from the field (opacity and 98 percent scale, 240ms on the strong ease-out) and leaves in
// 200ms; filtering and moving through rows have no motion.

const Combobox = BaseCombobox.Root;

/** True inside ComboboxContent, so ComboboxInput draws the search row there and the field outside. */
const InPopup = React.createContext(false);

const FIELD =
  "flex w-full min-w-0 border border-line-field bg-transparent font-sans text-body-sm leading-line-body-sm text-fg transition-[border-color] duration-fast ease-out hover:border-line-strong has-[[data-popup-open]]:border-line-strong has-[input:focus-visible]:border-focus-ring has-[input:focus-visible]:outline-1 has-[input:focus-visible]:-outline-offset-2 has-[input:focus-visible]:outline-focus-ring has-[[aria-invalid=true]]:border-danger data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:text-fg-subtle motion-reduce:transition-none";

const ICON_KEY =
  "flex size-6 shrink-0 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-fast ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring data-disabled:pointer-events-none data-disabled:text-fg-subtle motion-reduce:transition-none [&_svg]:size-4";

type ComboboxInputProps = React.ComponentProps<typeof BaseCombobox.Input> & {
  /** The caret key at the field's end (default true). */
  showTrigger?: boolean;
  /** A key that clears the value, shown once there is one (default false). */
  showClear?: boolean;
  children?: React.ReactNode;
};

function ComboboxInput({ className, showTrigger = true, showClear = false, children, placeholder, disabled, ...props }: ComboboxInputProps) {
  const inPopup = React.useContext(InPopup);
  if (inPopup) {
    return (
      <div data-slot="combobox-input-wrapper" className="flex h-10 shrink-0 items-center gap-2 border-b border-line px-3">
        <MagnifyingGlassIcon aria-hidden className="size-4 shrink-0 text-fg-muted" />
        <BaseCombobox.Input
          data-slot="combobox-input"
          placeholder={placeholder ?? "Search"}
          disabled={disabled}
          className={cn("h-full w-full min-w-0 bg-transparent font-sans text-body-sm leading-line-body-sm text-fg outline-none placeholder:text-fg-subtle pointer-coarse:text-body", className)}
          {...props}
        />
      </div>
    );
  }
  return (
    <BaseCombobox.InputGroup data-slot="combobox-input-group" className={cn(FIELD, "h-10 items-center gap-1 pr-2 pointer-coarse:h-12")}>
      <BaseCombobox.Input
        data-slot="combobox-input"
        placeholder={placeholder}
        disabled={disabled}
        className={cn("h-full min-w-0 flex-1 bg-transparent pl-3 outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed pointer-coarse:text-body", className)}
        {...props}
      />
      {children}
      {showClear && (
        <BaseCombobox.Clear data-slot="combobox-clear" aria-label="Clear" disabled={disabled} className={ICON_KEY}>
          <XIcon />
        </BaseCombobox.Clear>
      )}
      {showTrigger && (
        <BaseCombobox.Trigger data-slot="combobox-trigger" aria-label="Open list" disabled={disabled} className={ICON_KEY}>
          <CaretDownIcon />
        </BaseCombobox.Trigger>
      )}
    </BaseCombobox.InputGroup>
  );
}

const TRIGGER =
  "group/combobox-trigger flex h-10 w-full min-w-0 cursor-pointer items-center justify-between gap-2 border border-line-field bg-transparent px-3 font-sans text-body-sm leading-line-body-sm font-normal whitespace-nowrap text-fg select-none transition-[border-color] duration-fast ease-out hover:border-line-strong focus-visible:border-focus-ring focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring data-popup-open:border-line-strong aria-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:text-fg-subtle data-placeholder:text-fg-subtle pointer-coarse:h-12 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0";

/** The closed field as a button: the value (ComboboxValue) and the caret. Without children it is the caret key alone. */
function ComboboxTrigger({ className, children, ...props }: React.ComponentProps<typeof BaseCombobox.Trigger>) {
  if (children == null) {
    return (
      <BaseCombobox.Trigger data-slot="combobox-trigger" aria-label="Open list" className={cn(ICON_KEY, className)} {...props}>
        <CaretDownIcon />
      </BaseCombobox.Trigger>
    );
  }
  return (
    <BaseCombobox.Trigger data-slot="combobox-trigger" className={cn(TRIGGER, className)} {...props}>
      <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">{children}</span>
      <CaretDownIcon aria-hidden className="size-4 text-fg-muted group-data-disabled/combobox-trigger:text-fg-subtle" />
    </BaseCombobox.Trigger>
  );
}

/** The chosen value's label (or the placeholder); a function child renders the value its own way. */
function ComboboxValue(props: React.ComponentProps<typeof BaseCombobox.Value>) {
  return <BaseCombobox.Value {...props} />;
}

/** Clears the value. ComboboxInput draws one with showClear; use this beside a trigger or in the chips field. */
function ComboboxClear({ className, ...props }: React.ComponentProps<typeof BaseCombobox.Clear>) {
  return (
    <BaseCombobox.Clear data-slot="combobox-clear" aria-label="Clear" className={cn(ICON_KEY, className)} {...props}>
      <XIcon />
    </BaseCombobox.Clear>
  );
}

const POPUP =
  "flex max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-60 origin-(--transform-origin) flex-col overflow-hidden bg-surface text-fg shadow-floating outline-none transition-[opacity,scale] duration-slow ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-moderate motion-reduce:transition-[opacity]";

type ComboboxContentProps = React.ComponentProps<typeof BaseCombobox.Popup> &
  Pick<React.ComponentProps<typeof BaseCombobox.Positioner>, "side" | "sideOffset" | "align" | "alignOffset" | "anchor">;

function ComboboxContent({ className, children, side = "bottom", sideOffset = 4, align = "start", alignOffset = 0, anchor, ...props }: ComboboxContentProps) {
  const container = usePortalContainer();
  return (
    <BaseCombobox.Portal container={container}>
      <BaseCombobox.Positioner side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} anchor={anchor} className="z-50 outline-none">
        <BaseCombobox.Popup data-slot="combobox-content" className={cn(POPUP, className)} {...props}>
          <InPopup.Provider value>{children}</InPopup.Provider>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

function ComboboxList({ className, ...props }: React.ComponentProps<typeof BaseCombobox.List>) {
  return <BaseCombobox.List data-slot="combobox-list" className={cn("max-h-72 min-h-0 scroll-py-1 overflow-y-auto overscroll-contain p-1 fade-y data-empty:p-0", className)} {...props} />;
}

function ComboboxItem({ className, children, ...props }: React.ComponentProps<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex h-9 shrink-0 cursor-default items-center gap-2 px-3 font-sans text-body-sm leading-line-body-sm font-normal text-fg outline-none select-none data-disabled:pointer-events-none data-disabled:text-fg-subtle data-highlighted:bg-subtle-hover pointer-coarse:h-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-fg-muted",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2 truncate">{children}</span>
      <BaseCombobox.ItemIndicator data-slot="combobox-item-indicator" className="flex shrink-0">
        <CheckIcon className="text-fg" />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof BaseCombobox.Empty>) {
  return <BaseCombobox.Empty data-slot="combobox-empty" className={cn("px-3 py-6 text-center font-sans text-body-sm leading-line-body-sm text-fg-muted empty:hidden", className)} {...props} />;
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<typeof BaseCombobox.Group>) {
  return <BaseCombobox.Group data-slot="combobox-group" className={cn("flex flex-col", className)} {...props} />;
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<typeof BaseCombobox.GroupLabel>) {
  return <BaseCombobox.GroupLabel data-slot="combobox-label" className={cn("ds-label flex h-8 items-center px-3 select-none", className)} {...props} />;
}

function ComboboxCollection(props: React.ComponentProps<typeof BaseCombobox.Collection>) {
  return <BaseCombobox.Collection {...props} />;
}

function ComboboxSeparator({ className, ...props }: React.ComponentProps<typeof BaseCombobox.Separator>) {
  return <BaseCombobox.Separator data-slot="combobox-separator" className={cn("pointer-events-none -mx-1 my-1 h-px shrink-0 bg-line", className)} {...props} />;
}

/** The field for several values: the chips, then ComboboxChipsInput. The list opens from it. */
function ComboboxChips({ className, children, ...props }: React.ComponentProps<typeof BaseCombobox.InputGroup>) {
  return (
    <BaseCombobox.InputGroup data-slot="combobox-chips" className={cn(FIELD, "min-h-10 cursor-text items-center p-1 pointer-coarse:min-h-12", className)} {...props}>
      <BaseCombobox.Chips className="flex min-w-0 flex-1 flex-wrap items-center gap-1">{children}</BaseCombobox.Chips>
    </BaseCombobox.InputGroup>
  );
}

/** A chosen value in the chips field: a 24px outlined hexagon with an x. */
function ComboboxChip({ className, children, showRemove = true, ...props }: React.ComponentProps<typeof BaseCombobox.Chip> & { showRemove?: boolean }) {
  return (
    <BaseCombobox.Chip
      data-slot="combobox-chip"
      className={cn(
        "ds-hex-frame-s inline-flex h-6 max-w-full cursor-default items-center gap-1 pr-2 pl-3 font-sans text-body-sm leading-none text-fg outline-none select-none before:bg-line-strong after:bg-surface data-highlighted:after:bg-subtle-hover focus-within:after:bg-subtle-hover",
        !showRemove && "pr-3",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {showRemove && (
        <BaseCombobox.ChipRemove data-slot="combobox-chip-remove" aria-label="Remove" className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-fast ease-out hover:text-fg motion-reduce:transition-none [&_svg]:size-3">
          <XIcon />
        </BaseCombobox.ChipRemove>
      )}
    </BaseCombobox.Chip>
  );
}

/** The typing part of the chips field: it filters the list; Backspace on an empty input removes the last chip. */
function ComboboxChipsInput({ className, ...props }: React.ComponentProps<typeof BaseCombobox.Input>) {
  return <BaseCombobox.Input data-slot="combobox-chips-input" className={cn("h-6 min-w-24 flex-1 bg-transparent px-2 font-sans text-body-sm text-fg outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed pointer-coarse:text-body", className)} {...props} />;
}

/** A ref for an element the list should open from, when it is not the field (pass it to ComboboxContent's anchor). */
function useComboboxAnchor<T extends HTMLElement = HTMLDivElement>() {
  return React.useRef<T>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};

```
