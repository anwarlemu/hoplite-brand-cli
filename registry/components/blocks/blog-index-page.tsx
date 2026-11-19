"use client";

import * as React from "react";

import { Footer } from "@/components/blocks/footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { NodeTree, type Leaf } from "@/components/site/brand-marks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TypographyDisplay, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type Post = { title: string; excerpt: string; category: string; date: string; href: string; root?: string; rootNote?: string; leaves?: Leaf[] };

const POSTS: Post[] = [
  { title: "Fix production errors while you sleep", excerpt: "Wire an error tracker into an automation. New errors get picked up on a schedule, reproduced with a failing test, and fixed in a pull request you review over coffee.", category: "Tutorials", date: "Aug 8, 2026", href: "#post", root: "New error", rootNote: "02:14", leaves: [{ title: "Failing test", note: "then a fix" }, { title: "PR ready", note: "by morning", active: true }] },
  { title: "Announcing automations", excerpt: "Agents on a schedule. Describe the work once, pick a cadence, and it runs in a fresh sandbox every time, ending in a pull request a person reviews.", category: "Announcements", date: "Jul 20, 2026", href: "#post", root: "Weekdays", rootNote: "09:00", leaves: [{ title: "Fresh sandbox", note: "every run" }, { title: "Pull request", note: "for review", active: true }] },
  { title: "Measure coding-agent results beyond tokens", excerpt: "Track accepted changes, review effort, cycle time and regressions without confusing activity with impact.", category: "Engineering", date: "Oct 2, 2026", href: "#post", root: "What to track", leaves: [{ title: "Accepted", note: "changes" }, { title: "Review effort", note: "minutes" }, { title: "Regressions", note: "none", active: true }] },
  { title: "Ship a cross-repository change with agents", excerpt: "Coordinate backend and frontend changes with compatible contracts, separate pull requests and explicit integration checks.", category: "Tutorials", date: "Oct 3, 2026", href: "#post", root: "One change", leaves: [{ title: "acme/api", note: "contract first" }, { title: "acme/web", note: "uses it" }, { title: "Check both", active: true }] },
  { title: "Keep documentation in sync with code", excerpt: "Schedule a bounded documentation check that verifies changed commands and opens a reviewable pull request.", category: "Tutorials", date: "Sep 30, 2026", href: "#post", root: "Nightly", rootNote: "after merges", leaves: [{ title: "Check docs", note: "2 commands moved" }, { title: "Docs PR", note: "for review", active: true }] },
  { title: "A weekly agent routine for technical debt", excerpt: "Use a scheduled investigation and small reviewed changes to make repository maintenance manageable.", category: "Engineering", date: "Oct 1, 2026", href: "#post", root: "Every Friday", rootNote: "16:00", leaves: [{ title: "Investigate", note: "3 findings" }, { title: "Small PR", note: "reviewed", active: true }] },
];

const CATEGORIES = ["All", "Announcements", "Engineering", "Tutorials"];

function Art({ post }: { post: Post }) {
  return post.leaves ? <NodeTree root={post.root} rootNote={post.rootNote} leaves={post.leaves} /> : null;
}

// The blog (hoplite.sh/blog, "Field notes and announcements"): the display heading and lead over a solid rule, the
// category toggle with an RSS label at the right, the lead story beside its drawing, then the rest three to a row,
// each a drawing over a dashed rule, a mono category and date, a Chakra Petch title and a quiet excerpt. Columns are
// split by dashed rules.
function BlogIndexPage({ title = "Field notes and announcements", lead = "Releases, engineering deep dives, customer stories and tutorials from the team building cloud coding agents.", posts = POSTS, className }: { title?: string; lead?: string; posts?: Post[]; className?: string }) {
  const [category, setCategory] = React.useState("All");
  const shown = category === "All" ? posts : posts.filter((p) => p.category === category);
  const [first, ...rest] = shown;
  return (
    <div data-slot="blog-index-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-320 pb-20">
        <section className="grid gap-6 border-b border-line-strong pt-20 pb-16 sm:pt-32">
          <TypographyDisplay className="max-w-160">{title}</TypographyDisplay>
          <TypographyLead>{lead}</TypographyLead>
        </section>
        <div className="flex items-center justify-between gap-4 py-8">
          <ToggleGroup variant="outline" value={category} onValueChange={(v) => v && setCategory(v)} aria-label="Category">
            {CATEGORIES.map((c) => (
              <ToggleGroupItem key={c} value={c}>
                {c}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <a href="#rss" className="ds-label hidden transition-colors duration-base ease-out hover:text-fg motion-reduce:transition-none sm:inline">
            RSS
          </a>
        </div>
        {first && (
          <article className="ds-rule-x grid gap-10 py-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
            <div className="grid gap-4">
              <p className="ds-label m-0">
                {first.category} <span className="pl-3">{first.date}</span>
              </p>
              <h2 className="m-0 font-display text-h3 leading-10 font-light text-balance">
                <a href={first.href} className="transition-colors duration-base ease-out hover:text-fg-secondary motion-reduce:transition-none">{first.title}</a>
              </h2>
              <p className="m-0 max-w-150 text-body leading-7 font-light text-fg-secondary">{first.excerpt}</p>
            </div>
            <div className="flex justify-start md:justify-center">
              <Art post={first} />
            </div>
          </article>
        )}
        <div className="grid md:grid-cols-3">
          {rest.map((p, i) => (
            <article key={p.title} className={cn("relative grid content-start gap-4 py-10 md:px-8", i % 3 === 0 && "md:pl-0", i % 3 === 2 && "md:pr-0")}>
              {i % 3 !== 0 && <span aria-hidden className="ds-rule-y absolute inset-y-0 left-0 hidden w-px md:block" />}
              <div className="ds-rule-x flex min-h-40 items-center justify-center pb-6">
                <Art post={p} />
              </div>
              <p className="ds-label m-0">
                {p.category} <span className="pl-3">{p.date}</span>
              </p>
              <h3 className="m-0 font-display text-h5 leading-7 font-normal text-balance">
                <a href={p.href} className="transition-colors duration-base ease-out hover:text-fg-secondary motion-reduce:transition-none">{p.title}</a>
              </h3>
              <p className="m-0 text-body-sm leading-line-body-sm font-light text-fg-secondary">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export { BlogIndexPage };
