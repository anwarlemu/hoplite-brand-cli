"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { DotsThreeIcon } from "@phosphor-icons/react/ssr";

import { cn, slot } from "@/lib/utils";

// A trail of pages, drawn like the blog post's back link (.bp-back, All posts) and the product window's crumb
// (.pa-crumb): 14px Satoshi links in the quiet gray that turn ink under the pointer (160ms), the current page in the
// ink at medium weight, 8px apart with a slate slash between them (or a 16px caret, passed as the separator's child).
// Folded pages are a 16px three-dot glyph in a 24px box. Links take the 2px ink focus outline.
function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" className={className} {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="breadcrumb-list" className={cn("m-0 flex list-none flex-wrap items-center gap-2 p-0 font-sans text-body-sm leading-line-body-sm break-words text-fg-muted", className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex min-w-0 items-center gap-2", className)} {...props} />;
}

type BreadcrumbLinkProps = useRender.ComponentProps<"a"> & { asChild?: boolean };

function BreadcrumbLink({ asChild, render, children, className, ...props }: BreadcrumbLinkProps) {
  const parts = slot(asChild, children, render);
  return useRender({
    defaultTagName: "a",
    render: parts.render,
    props: {
      "data-slot": "breadcrumb-link",
      className: cn(
        "inline-flex cursor-pointer items-center gap-2 text-fg-muted no-underline transition-colors duration-base ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      ),
      ...props,
      children: parts.children,
    },
  });
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn("truncate font-medium text-fg", className)} {...props} />;
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("inline-flex items-center text-fg-subtle select-none [&>svg]:size-4", className)} {...props}>
      {children ?? "/"}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" className={cn("flex size-6 items-center justify-center text-fg-muted", className)} {...props}>
      <DotsThreeIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };
