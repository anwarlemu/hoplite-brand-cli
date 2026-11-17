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
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
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
