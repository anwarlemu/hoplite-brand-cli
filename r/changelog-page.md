# Changelog page
The changelog template: heading and lead over a solid rule with the orange node, the Show toggle and Jump to list, and each day's headline update with its features and fixes.

Install: npx hoplite-ds add changelog-page
Requires: theme, footer, site-header, brand-marks, toggle-group, typography, utils
Packages: @phosphor-icons/react
Exports: Update, Month, ChangelogPage
Client boundary: yes
Reference: The Hoplite website's changelog (/changelog, What's new in Hoplite)


## Usage
Use for release notes; pass months of updates.
- Avoid: Copy from real people or third parties
- Avoid: Sections reordered so two closing bands meet
- Avoid: Values outside the brand tokens
Built only from the section blocks and library items; every part takes its copy through props.

## Examples
Example components: npx hoplite-ds add changelog-page
[Preview](https://hoplite-ds.vercel.app/preview/changelog-page/Preview)

examples/changelog-page.tsx

```tsx
import { ChangelogPage } from "@/components/blocks/changelog-page";

export function Preview() {
  return <ChangelogPage />;
}

```

## Source

components/blocks/changelog-page.tsx

```tsx
"use client";

import * as React from "react";
import { PlusCircleIcon } from "@phosphor-icons/react/ssr";

import { Footer } from "@/components/blocks/footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { HexNode } from "@/components/site/brand-marks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type Update = { date: string; title: string; features: string[]; fixes: string[] };
export type Month = { month: string; updates: Update[] };

const MONTHS: Month[] = [
  {
    month: "November 2026",
    updates: [
      { date: "Nov 12", title: "Integration account emails stay blurred until you click to reveal them", features: ["Name your model subscriptions in Settings"], fixes: ["Local agents start after switching back to an account or organization", "Local agents no longer wait on a stuck shell profile", "Remove repositories from projects that already have threads"] },
      { date: "Nov 11", title: "Review local changes in the desktop app and send inline feedback to your agent", features: ["Desktop notifications for local agent runs", "Local runs continue after a desktop app restart", "Rewind local conversations in the desktop app"], fixes: ["Swarms open in the desktop app instead of returning to Home", "Agent runs keep using the selected account after model fallback"] },
      { date: "Nov 10", title: "Pick from five new themes, including High contrast, in Appearance", features: ["The Mac app picks up most updates without restarting", "Private threads are available in every organization"], fixes: ["The desktop app no longer shows an error screen after you open a local thread"] },
    ],
  },
  {
    month: "October 2026",
    updates: [{ date: "Oct 30", title: "Agents can answer with charts, diagrams and tables, right in the thread", features: ["Typing and switching tabs in the desktop app respond faster"], fixes: ["Home tabs keep separate drafts and composer settings"] }],
  },
];

function Entry({ text, title = false }: { text: string; title?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <PlusCircleIcon aria-hidden className={cn("shrink-0 text-fg-muted", title ? "mt-1.5 size-5" : "mt-0.5 size-4")} />
      <span className={title ? "font-display text-h5 leading-8 font-normal text-fg" : "text-body-sm leading-line-body-sm text-fg-secondary"}>{text}</span>
    </li>
  );
}

// The changelog (hoplite.sh/changelog, "What's new"): the heading and lead over a solid rule with the orange node at
// its end, a left column with the Show toggle and the Jump to list (month and count on hairline rows), and the months:
// a Chakra Petch month over a hairline, then each day with its mono date and counts beside its headline update and its
// features and fixes under mono labels.
function ChangelogPage({ title = "What's new in Hoplite", lead = "Meaningful features and fixes, in plain English. Open an update for the details.", months = MONTHS, className }: { title?: string; lead?: string; months?: Month[]; className?: string }) {
  const [show, setShow] = React.useState("all");
  return (
    <div data-slot="changelog-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-320 pb-20">
        <section className="relative grid gap-6 border-b border-line-strong pt-20 pb-12 sm:pt-32">
          <TypographyH1>{title}</TypographyH1>
          <TypographyLead>{lead}</TypographyLead>
          <HexNode active className="absolute right-0 -bottom-4 size-8" />
        </section>
        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,4fr)] lg:gap-16">
          <aside className="grid content-start gap-8">
            <div className="grid gap-3">
              <p className="ds-label m-0">Show</p>
              <ToggleGroup variant="outline" value={show} onValueChange={(v) => v && setShow(v)} aria-label="Show">
                <ToggleGroupItem value="all">All</ToggleGroupItem>
                <ToggleGroupItem value="features">Features</ToggleGroupItem>
                <ToggleGroupItem value="fixes">Fixes</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <nav aria-label="Jump to" className="hidden gap-3 lg:grid">
              <p className="ds-label m-0">Jump to</p>
              <ul className="m-0 grid list-none border-t border-line p-0">
                {months.map((m) => (
                  <li key={m.month} className="border-b border-line">
                    <a href={`#${m.month.replace(/\s+/g, "-").toLowerCase()}`} className="flex items-center justify-between py-2 text-body-sm leading-line-body-sm text-fg-secondary transition-colors duration-base ease-out hover:text-fg motion-reduce:transition-none">
                      {m.month}
                      <span className="font-code text-caption tracking-code text-fg-muted">{m.updates.reduce((n, u) => n + u.features.length + u.fixes.length, 0)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="grid gap-16">
            {months.map((m) => (
              <section key={m.month} id={m.month.replace(/\s+/g, "-").toLowerCase()} className="grid">
                <h2 className="m-0 border-b border-line-strong pb-4 font-display text-h4 leading-8 font-light text-fg">{m.month}</h2>
                {m.updates.map((u) => (
                  <article key={u.date} className="grid gap-4 border-b border-line py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,4fr)] md:gap-8">
                    <div className="grid content-start gap-1">
                      <p className="m-0 font-code text-body-sm leading-line-body-sm tracking-code text-fg uppercase">{u.date}</p>
                      <p className="m-0 text-caption leading-line-caption text-fg-muted">
                        {u.features.length} {u.features.length === 1 ? "feature" : "features"}, {u.fixes.length} {u.fixes.length === 1 ? "fix" : "fixes"}
                      </p>
                    </div>
                    <div className="grid gap-6">
                      <ul className="m-0 list-none p-0">
                        <Entry text={u.title} title />
                      </ul>
                      {show !== "fixes" && u.features.length > 0 && (
                        <div className="grid gap-3">
                          <p className="ds-label m-0">Features</p>
                          <ul className="m-0 grid list-none gap-3 p-0">
                            {u.features.map((f) => (
                              <Entry key={f} text={f} />
                            ))}
                          </ul>
                        </div>
                      )}
                      {show !== "features" && u.fixes.length > 0 && (
                        <div className="grid gap-3">
                          <p className="ds-label m-0">Fixes</p>
                          <ul className="m-0 grid list-none gap-3 p-0">
                            {u.fixes.map((f) => (
                              <Entry key={f} text={f} />
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export { ChangelogPage };

```
