# Site header
The site's header: the lockup, the nav items as ghost keys, Sign in and the compact ink hexagon at the right; below 768px the nav folds into a sheet behind a menu key.

Install: npx hoplite-ds add site-header
Requires: theme, brand-marks, button, sheet, utils
Packages: @phosphor-icons/react
Exports: NavLink, SiteHeader
Client boundary: yes
Reference: The Hoplite website's header (.site-header, every page of hoplite-website-fawn.vercel.app)


## Usage
Use at the top of every marketing page. Pass links, the sign-in link and the one action (Start building); pass null to drop either.
- Avoid: Two ink hexagons in the header
- Avoid: A filled or shadowed header bar
- Avoid: Nav items in capitals


## Examples
Example components: npx hoplite-ds add site-header
[Preview](https://hoplite-ds.vercel.app/preview/site-header/Preview)

examples/site-header.tsx

```tsx
import { SiteHeader } from "@/components/blocks/site-header";

export function Preview() {
  return <SiteHeader />;
}

```

## Source

components/blocks/site-header.tsx

```tsx
"use client";

import * as React from "react";
import { ListIcon } from "@phosphor-icons/react/ssr";

import { Lockup } from "@/components/site/brand-marks";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = { label: string; href: string };

const LINKS: NavLink[] = [
  { label: "Product", href: "#product" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
];

// The site's header (.site-header): the lockup at the left, the nav items as ghost keys beside it, Sign in and the
// compact ink hexagon (Start building) at the right, 64px tall on the ground. Below 768px the nav folds into a sheet
// opened from a menu key.
function SiteHeader({
  links = LINKS,
  homeHref = "/",
  signIn = { label: "Sign in", href: "#sign-in" },
  action = { label: "Start building", href: "#start" },
  className,
}: {
  links?: NavLink[];
  homeHref?: string;
  signIn?: NavLink | null;
  action?: NavLink | null;
  className?: string;
}) {
  return (
    <header data-slot="site-header" className={cn("w-full", className)}>
      <div className="mx-auto flex h-16 w-full max-w-320 items-center gap-8">
        <a href={homeHref} aria-label="Home" className="py-2 text-fg outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
          <Lockup />
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {links.map((l) => (
              <li key={l.href}>
                <Button variant="ghost" render={<a href={l.href} />}>
                  {l.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {signIn && (
            <Button variant="ghost" className="hidden sm:inline-flex" render={<a href={signIn.href} />}>
              {signIn.label}
            </Button>
          )}
          {action && (
            <Button size="sm" render={<a href={action.href} />}>
              {action.label}
            </Button>
          )}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu" />}>
              <ListIcon />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ul className="m-0 grid list-none gap-1 px-4 py-0">
                {[...links, ...(signIn ? [signIn] : [])].map((l) => (
                  <li key={l.href}>
                    <Button variant="ghost" className="w-full justify-start" render={<a href={l.href} />}>
                      {l.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };

```
