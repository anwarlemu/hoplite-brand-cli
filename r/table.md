# Table
Ruled, not boxed: Kode Mono column heads over the strong rule and 48px rows of 14px ink with a quiet rule between them; the compare variant is the pricing table (Chakra Petch 20px plan heads, group rows, a filled ink hexagon for yes and a slate dash for no) and the prose variant the blog's 16px table. A table wider than its frame scrolls sideways and fades at the edge it scrolls past (fade-x).

Install: npx hoplite-ds add table
Requires: theme, utils
Packages: none
Exports: Table, TableBody, TableCaption, TableCell, TableFooter, TableGroup, TableHead, TableHeader, TableNo, TableRow, TableYes
Client boundary: not required by this entry file
Reference: The Hoplite website's pricing comparison (.pr-table, .pr-table__group, .pr-yes, .pr-no on /pricing) and the blog table (.bp-table)


## Usage
Use Table for records people read across (threads, seats, runs) and variant="compare" for a plan or feature comparison: TableGroup opens each section, row names are TableHead with scope="row", and TableYes and TableNo mark what is included. Use variant="prose" inside an article. Keep the shadcn parts (TableHeader, TableBody, TableRow, TableHead, TableCell, TableFooter, TableCaption); mark a chosen row with data-state="selected". For sorting, selection and pages use DataTable.
- Avoid: A boxed or rounded frame
- Avoid: Zebra stripes or filled head rows
- Avoid: Bold heads
- Avoid: A check icon or an orange mark for yes
- Avoid: Rows that move under the pointer


## Examples
Example components: npx hoplite-ds add table
[Preview](https://hoplite-ds.vercel.app/preview/table/Preview) | [Compare](https://hoplite-ds.vercel.app/preview/table/Compare) | [Prose](https://hoplite-ds.vercel.app/preview/table/Prose) | [WithFooter](https://hoplite-ds.vercel.app/preview/table/WithFooter)

examples/table.tsx

```tsx
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableGroup, TableHead, TableHeader, TableNo, TableRow, TableYes } from "@/components/ui/table";

const THREADS = [
  { name: "Fix flaky checkout test", repo: "acme/storefront", agent: "Claude Code", status: "Ready for review", updated: "2 min ago" },
  { name: "Migrate auth to sessions", repo: "acme/api", agent: "Codex", status: "Running", updated: "14 min ago" },
  { name: "Bump Next to 16.1", repo: "acme/web", agent: "Claude Code", status: "Merged", updated: "1 h ago" },
  { name: "Add rate limits to webhooks", repo: "acme/api", agent: "Amp", status: "Needs input", updated: "3 h ago" },
];

export function Preview() {
  return (
    <Table className="min-w-160">
      <TableHeader>
        <TableRow>
          <TableHead>Thread</TableHead>
          <TableHead>Repository</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {THREADS.map((t) => (
          <TableRow key={t.name}>
            <TableCell className="font-medium">{t.name}</TableCell>
            <TableCell className="font-code text-fg-secondary">{t.repo}</TableCell>
            <TableCell>{t.agent}</TableCell>
            <TableCell className="text-fg-secondary">{t.status}</TableCell>
            <TableCell className="text-right text-fg-muted">{t.updated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const PLANS = ["Free", "Plus", "Team", "Enterprise"];
const GROUPS: { name: string; rows: [string, ...(string | boolean)[]][] }[] = [
  {
    name: "Usage",
    rows: [
      ["Included usage", "Monthly, with a daily limit", "Generous, per seat", "Most, per seat", "Custom"],
      ["All platform models", true, true, true, true],
      ["Prepaid credits beyond that", false, true, true, true],
    ],
  },
  {
    name: "Sandboxes",
    rows: [
      ["Largest sandbox", "2 vCPU, 8 GiB", "8 vCPU, 32 GiB", "16 vCPU, 64 GiB", "Custom"],
      ["Subagents per task at once", "4", "8", "8", "8"],
      ["Snapshots and forks", false, false, true, true],
    ],
  },
];

export function Compare() {
  return (
    <Table variant="compare" className="min-w-160">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">
            <span className="sr-only">Feature</span>
          </TableHead>
          {PLANS.map((p) => (
            <TableHead key={p}>{p}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {GROUPS.map((g) => (
        <TableBody key={g.name}>
          <TableGroup colSpan={PLANS.length + 1}>{g.name}</TableGroup>
          {g.rows.map(([name, ...values]) => (
            <TableRow key={name}>
              <TableHead scope="row">{name}</TableHead>
              {values.map((v, i) => (
                <TableCell key={PLANS[i]}>{v === true ? <TableYes /> : v === false ? <TableNo /> : v}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      ))}
    </Table>
  );
}

export function Prose() {
  return (
    <div className="w-full max-w-160">
      <Table variant="prose">
        <TableHeader>
          <TableRow>
            <TableHead>Sandbox</TableHead>
            <TableHead>Cold start</TableHead>
            <TableHead>Warm start</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>2 vCPU, 8 GiB</TableCell>
            <TableCell>1.8 s</TableCell>
            <TableCell>240 ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>8 vCPU, 32 GiB</TableCell>
            <TableCell>2.4 s</TableCell>
            <TableCell>260 ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>16 vCPU, 64 GiB</TableCell>
            <TableCell>3.1 s</TableCell>
            <TableCell>310 ms</TableCell>
          </TableRow>
        </TableBody>
        <TableCaption>Median of 500 starts per size, measured in October.</TableCaption>
      </Table>
    </div>
  );
}

export function WithFooter() {
  return (
    <Table className="max-w-120">
      <TableHeader>
        <TableRow>
          <TableHead>Seat</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead className="text-right">Monthly</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Maya</TableCell>
          <TableCell className="text-fg-secondary">Team</TableCell>
          <TableCell className="text-right tabular-nums">$40.00</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>Platform lead</TableCell>
          <TableCell className="text-fg-secondary">Team</TableCell>
          <TableCell className="text-right tabular-nums">$40.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Release bot</TableCell>
          <TableCell className="text-fg-secondary">Plus</TableCell>
          <TableCell className="text-right tabular-nums">$20.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right tabular-nums">$100.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

```

## Source

components/ui/table.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// The site's ruled tables: no box, no fills, a quiet 16 percent rule between rows. `default` is the list table: Kode
// Mono column heads (12px capitals, tracked 8 percent, quiet gray) in a 40px row over the strong rule, then 48px rows of
// 14px ink with 16px sides, the first column flush with the rules. `compare` is the pricing comparison (.pr-table):
// 64px heads in Chakra Petch 20px over the quiet rule, 48px rows ruled at the top, row names (a TableHead with
// scope="row") in 14px graphite and values in the ink; a TableGroup row opens each section with a Chakra Petch 20px head
// 48px below the last row and 16px above the first. TableYes is the filled ink hexagon and TableNo the slate dash.
// `prose` is the blog's table (.bp-table): 16px tabular text in rows 12px tall above and below, top aligned, the Kode
// Mono heads over the strong rule. A selected row (data-state="selected") takes the hover wash at once. Nothing moves.
type TableVariant = "default" | "compare" | "prose";

function Table({ className, variant = "default", ...props }: React.ComponentProps<"table"> & { variant?: TableVariant }) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto fade-x">
      <table
        data-slot="table"
        data-variant={variant}
        className={cn(
          "group/table w-full caption-bottom border-separate border-spacing-0 font-sans text-body-sm leading-line-body-sm text-fg",
          variant === "compare" && "table-fixed",
          variant === "prose" && "text-body leading-line-body tabular-nums",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={className} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  // The head draws the rule above the first row, so the first row does not draw its own.
  return <tbody data-slot="table-body" className={cn("[&>tr:first-child>*]:border-t-0", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("font-medium [&>tr>*]:border-t [&>tr>*]:border-line-strong", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("data-[state=selected]:[&>*]:bg-subtle-hover", className)} {...props} />;
}

// A column head by default; with scope="row" it is a row's name, drawn as the site's pricing rows draw theirs.
function TableHead({ className, scope, ...props }: React.ComponentProps<"th">) {
  if (scope === "row") {
    return (
      <th
        data-slot="table-head"
        scope="row"
        className={cn(
          "h-12 border-t border-line px-4 py-3 text-left align-middle font-sans font-normal text-fg-secondary first:pl-0 last:pr-0",
          "group-data-[variant=prose]/table:h-auto group-data-[variant=prose]/table:py-3 group-data-[variant=prose]/table:pl-0 group-data-[variant=prose]/table:align-top",
          className,
        )}
        {...props}
      />
    );
  }
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn(
        "ds-label h-10 border-b border-line-strong px-4 text-left align-middle font-normal whitespace-nowrap first:pl-0 last:pr-0 [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0",
        "group-data-[variant=compare]/table:h-16 group-data-[variant=compare]/table:border-line group-data-[variant=compare]/table:font-display group-data-[variant=compare]/table:text-h5 group-data-[variant=compare]/table:leading-7 group-data-[variant=compare]/table:tracking-normal group-data-[variant=compare]/table:text-fg group-data-[variant=compare]/table:normal-case",
        "group-data-[variant=prose]/table:h-auto group-data-[variant=prose]/table:py-3 group-data-[variant=prose]/table:pl-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-12 border-t border-line px-4 py-3 text-left align-middle first:pl-0 last:pr-0 [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0",
        "group-data-[variant=prose]/table:h-auto group-data-[variant=prose]/table:pl-0 group-data-[variant=prose]/table:align-top",
        className,
      )}
      {...props}
    />
  );
}

/** A section head inside the body: Chakra Petch 20px across every column (the pricing table's Usage, Automations). */
function TableGroup({ className, colSpan, children, ...props }: React.ComponentProps<"tr"> & { colSpan?: number }) {
  return (
    <tr data-slot="table-group" className={className} {...props}>
      <th scope="colgroup" colSpan={colSpan} className="pt-12 pb-4 text-left font-display text-h5 leading-7 font-normal text-fg [tbody:first-of-type>tr:first-child>&]:pt-8">
        {children}
      </th>
    </tr>
  );
}

/** Included: the pricing table's 12px mark, a filled ink hexagon with its points at the sides. */
function TableYes({ className, label = "Included", ...props }: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <svg data-slot="table-yes" viewBox="0 0 12 12" width="12" height="12" role="img" aria-label={label} className={cn("block fill-fg", className)} {...props}>
      <path d="M11 6L8.5 10.33L3.5 10.33L1 6L3.5 1.67L8.5 1.67Z" />
    </svg>
  );
}

/** Not included: a 6px dash in the slate. */
function TableNo({ className, label = "Not included", ...props }: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <svg data-slot="table-no" viewBox="0 0 12 12" width="12" height="12" role="img" aria-label={label} className={cn("block fill-none stroke-fg-subtle", className)} strokeWidth={1} {...props}>
      <path d="M3 6h6" />
    </svg>
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-4 text-left font-sans text-body-sm leading-line-body-sm text-fg-muted", className)} {...props} />;
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableGroup, TableHead, TableHeader, TableNo, TableRow, TableYes };

```
