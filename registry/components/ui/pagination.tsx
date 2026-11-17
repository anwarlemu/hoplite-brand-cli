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
