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
