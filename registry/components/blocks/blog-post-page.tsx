import * as React from "react";

import { Cta } from "@/components/blocks/cta";
import { Footer } from "@/components/blocks/footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { NodeTree } from "@/components/site/brand-marks";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/code-block";
import { TypographyH1, TypographyLead, TypographyList, TypographyProse } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const CODE = `schedule: "0 9 * * 1-5"
task: |
  Pick up new errors from the last day.
  Reproduce each with a failing test, fix it,
  and open one pull request per error.`;

function Article() {
  return (
    <>
      <p>An error that arrives at two in the morning used to wait for a person. With an automation, an agent picks it up on a schedule, reproduces it in a fresh sandbox and leaves a pull request for the morning.</p>
      <h2>Describe the work once</h2>
      <p>An automation is a task and a cadence. The task reads like a note to a teammate; the cadence is when it runs.</p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>automation.yaml</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent code={CODE} language="yaml" />
      </CodeBlock>
      <h2>What every run does</h2>
      <TypographyList>
        <li>Starts in a fresh sandbox on its own branch.</li>
        <li>Writes a failing test before it changes any code.</li>
        <li>Ends in a pull request a person reviews.</li>
      </TypographyList>
      <blockquote>Nothing merges on its own. The agent does the work; a person decides.</blockquote>
      <p>Set it up once and the queue of overnight errors becomes a short list of reviews.</p>
    </>
  );
}

// A blog post (hoplite.sh/blog/...): the breadcrumb, the mono category and date, the Chakra Petch title and lead, the
// post's drawing in a frame of corner ticks, then the article set as prose (18px on a 32px line) at a readable measure,
// and the closing band. Pass the article as children.
function BlogPostPage({
  title = "Fix production errors while you sleep",
  lead = "New errors get picked up on a schedule, reproduced with a failing test, and fixed in a pull request you review over coffee.",
  category = "Tutorials",
  date = "Aug 8, 2026",
  byline = "The Hoplite team",
  children,
  className,
}: {
  title?: string;
  lead?: string;
  category?: string;
  date?: string;
  byline?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="blog-post-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-320 pt-12 sm:pt-20">
        <article className="mx-auto grid max-w-180 gap-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <header className="grid gap-6">
            <p className="ds-label m-0">
              {category} <span className="pl-3">{date}</span>
            </p>
            <TypographyH1>{title}</TypographyH1>
            <TypographyLead>{lead}</TypographyLead>
            <p className="ds-rule-x m-0 pb-4 text-body-sm leading-line-body-sm text-fg-muted">{byline}</p>
          </header>
          <div className="ds-corners grid min-h-64 place-items-center p-4 sm:p-8">
            <NodeTree root="New error" rootNote="02:14" leaves={[{ title: "Failing test", note: "then a fix" }, { title: "PR ready", note: "by morning", active: true }]} />
          </div>
          <TypographyProse>{children ?? <Article />}</TypographyProse>
        </article>
        <Cta title="Try it on your own repository." lead="Automations are available on every plan." />
      </main>
      <Footer />
    </div>
  );
}

export { BlogPostPage };
