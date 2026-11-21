# Pagination
32px ghost hexagon page keys whose wash hexagon appears under the pointer, the current page as the outlined hexagon, and Previous and Next with still arrows.

Install: npx hoplite-ds add pagination
Requires: theme, button, utils
Packages: @phosphor-icons/react
Exports: Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
Client boundary: yes
Reference: Extrapolated from the Hoplite website's compact keys (.button--s, .button--line) and nav items (.hn__top); the site pages its changelog and blog without numbered keys


## Usage
Use under a list or table that is split into pages (the changelog, the blog, a table of runs). Show the first and last pages, one or two either side of the current one and PaginationEllipsis for the gaps. Mark the current page with isActive and a page that leads nowhere with aria-disabled. Use bar to center it in a 48px row under a table.
- Avoid: A filled ink key for the current page
- Avoid: Round or square page keys
- Avoid: Arrows that nudge on hover
- Avoid: More than about seven page keys at once


## Examples
Example components: npx hoplite-ds add pagination
[Preview](https://hoplite-ds.vercel.app/preview/pagination/Preview) | [Controlled](https://hoplite-ds.vercel.app/preview/pagination/Controlled) | [Compact](https://hoplite-ds.vercel.app/preview/pagination/Compact)

examples/pagination.tsx

```tsx
"use client";

import * as React from "react";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function Preview() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/** The pages to show around the current one: the first, the last, two either side, and gaps between. */
function pages(current: number, count: number) {
  const out: (number | "gap")[] = [];
  for (let p = 1; p <= count; p++) {
    if (p === 1 || p === count || Math.abs(p - current) <= 1) out.push(p);
    else if (out[out.length - 1] !== "gap") out.push("gap");
  }
  return out;
}

export function Controlled() {
  const [page, setPage] = React.useState(6);
  const count = 12;
  const go = (p: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (p >= 1 && p <= count) setPage(p);
  };
  return (
    <div className="grid gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={go(page - 1)} aria-disabled={page === 1 || undefined} />
          </PaginationItem>
          {pages(page, count).map((p, i) => (
            <PaginationItem key={p === "gap" ? `gap-${i}` : p}>
              {p === "gap" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink href="#" isActive={p === page} onClick={go(p)}>
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={go(page + 1)} aria-disabled={page === count || undefined} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-body-sm text-fg-muted">Changelog, page {page} of {count}</p>
    </div>
  );
}

export function Compact() {
  return (
    <Pagination bar className="max-w-120 border-t border-line">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" aria-disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

```

## Source

components/ui/pagination.tsx

```tsx
"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon, DotsThreeIcon } from "@phosphor-icons/react/ssr";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Page keys drawn as the site's compact keys (button--s): every page number is a 32px ghost hexagon with 8px cuts, a
// 14px graphite label that turns ink while a hexagon of the hover wash appears behind it. The current page is the
// outlined hexagon (a 1px strong edge around the ground) with its label in the ink. Previous and Next are the same ghost
// keys with a 16px arrow 8px from the label; the arrows hold still under the pointer. A key that leads nowhere goes the
// slate and ignores the pointer. `bar` sets it under a table: centered in a 48px row.
function Pagination({ className, bar = false, ...props }: React.ComponentProps<"nav"> & { bar?: boolean }) {
  return <nav role="navigation" aria-label="pagination" data-slot="pagination" data-bar={bar || undefined} className={cn("mx-auto flex w-full justify-center", bar && "min-h-12 items-center", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row flex-wrap items-center gap-1", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = { isActive?: boolean; size?: "icon" | "default" } & React.ComponentProps<"a">;

const OFF = "aria-disabled:pointer-events-none aria-disabled:text-fg-subtle";

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      className={cn(
        isActive ? buttonVariants({ variant: "outline", size: "sm" }) : buttonVariants({ variant: "ghost" }),
        "h-8 tabular-nums pointer-coarse:h-11",
        size === "icon" ? "min-w-8 px-2" : "px-3",
        isActive && "pointer-events-none font-normal",
        OFF,
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, children = "Previous", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-2 pl-2", className)} {...props}>
      <ArrowLeftIcon aria-hidden />
      <span className="max-sm:sr-only">{children}</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, children = "Next", ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-2 pr-2", className)} {...props}>
      <span className="max-sm:sr-only">{children}</span>
      <ArrowRightIcon aria-hidden />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("flex h-8 min-w-8 items-center justify-center text-fg-muted", className)} {...props}>
      <DotsThreeIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };

```
