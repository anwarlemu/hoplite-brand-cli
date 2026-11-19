"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenTextIcon, ListIcon, MagnifyingGlassIcon, PaletteIcon, SquaresFourIcon, XIcon } from "@phosphor-icons/react/ssr";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Lockup } from "@www/components/logo";

type Entry = { name: string; title: string; type?: string };

// Components, then the section blocks, then the page templates (blocks whose name ends in -page).
const GROUPS: { label: string; test: (e: Entry) => boolean }[] = [
  { label: "Components", test: (e) => e.type !== "block" },
  { label: "Blocks", test: (e) => e.type === "block" && !e.name.endsWith("-page") },
  { label: "Pages", test: (e) => e.type === "block" && e.name.endsWith("-page") },
];

// A rail row, as the site's nav items (.hn__top): a 32px 14px label in graphite; under the pointer, and on the current
// page, a compact hexagon of the hover wash appears behind it and the label turns ink. Colors only, no motion.
const ROW =
  "ds-hex-frame-s flex h-8 items-center gap-2 px-3 text-body-sm leading-line-body-sm text-fg-secondary transition-colors duration-base ease-out hover:text-fg hover:before:bg-subtle-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-[current=page]:text-fg aria-[current=page]:before:bg-subtle-hover motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0";

const PAGES = [
  { href: "/", label: "Introduction", icon: BookOpenTextIcon },
  { href: "/components", label: "All components", icon: SquaresFourIcon },
  { href: "/theme", label: "Theme", icon: PaletteIcon },
];

function Groups({ entries, query, onNavigate }: { entries: Entry[]; query: string; onNavigate: () => void }) {
  const pathname = usePathname();
  const q = query.trim().toLowerCase();
  const shown = q ? entries.filter((e) => e.title.toLowerCase().includes(q) || e.name.includes(q)) : entries;
  return (
    <>
      {!q && (
        <ul className="grid gap-1">
          {PAGES.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} onNavigate={onNavigate} aria-current={pathname === href ? "page" : undefined} className={ROW}>
                <Icon aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {GROUPS.map((g) => {
        const group = shown.filter(g.test);
        if (!group.length && !(g.label === "Components" && !shown.length)) return null;
        return (
          <div key={g.label}>
            <p className="ds-label mb-3 px-3">{g.label}</p>
            {group.length ? (
              <ul className="grid gap-1">
                {group.map((e) => {
                  const href = `/components/${e.name}`;
                  return (
                    <li key={e.name}>
                      <Link href={href} scroll={false} onNavigate={onNavigate} data-item={e.name} aria-current={pathname === href ? "page" : undefined} className={ROW}>
                        {e.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-3 text-body-sm text-fg-muted">Nothing matches.</p>
            )}
          </div>
        );
      })}
    </>
  );
}

/**
 * The docs' rail: 288px of the ground beside the page with a quiet rule at its edge, the lockup in a 64px head, a
 * filter, the pages and every component. Below 1024px it folds into a bar at the top that opens it over the page.
 */
export function DocsRail({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <Link href="/" aria-label="Hoplite design system" className="py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
          <Lockup />
        </Link>
        <button type="button" aria-expanded={open} aria-controls="docs-rail" onClick={() => setOpen((o) => !o)} className="inline-flex size-12 cursor-pointer items-center justify-center text-fg outline-none focus-visible:outline-2 focus-visible:outline-focus-ring">
          {open ? <XIcon className="size-5" /> : <ListIcon className="size-5" />}
          <span className="sr-only">{open ? "Close the library" : "Open the library"}</span>
        </button>
      </div>
      <nav
        id="docs-rail"
        aria-label="Library"
        className={cn(
          "z-20 flex-col border-r border-line bg-surface max-lg:fixed max-lg:inset-x-0 max-lg:top-16 max-lg:bottom-0 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-(--ds-layout-rail) lg:shrink-0",
          open ? "flex" : "hidden",
        )}
      >
        <div className="hidden h-16 shrink-0 items-center px-6 lg:flex">
          <Link href="/" aria-label="Hoplite design system" className="py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
            <Lockup />
          </Link>
        </div>
        <div className="relative mx-3 mt-4 mb-5 lg:mt-2">
          <MagnifyingGlassIcon aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
          <Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter components" aria-label="Filter components" className="h-9 pl-9" />
        </div>
        <div className="grid min-h-0 flex-1 content-start gap-6 overflow-y-auto overscroll-contain px-3 pb-8 [scrollbar-width:thin]">
          <Groups entries={entries} query={query} onNavigate={close} />
        </div>
      </nav>
    </>
  );
}
