# Typography
The site's type: Chakra Petch light headings at 56, 44, 32 and 24px, an 18px light graphite lead, 16px body, the Kode Mono eyebrow, the flat orange accent word, dashed-rule quotes, hexagon-bulleted lists, Kode Mono inline code and a whole-article prose style. A table wider than the column scrolls sideways and fades at the edge it scrolls past (fade-x).

Install: npx hoplite-ds add typography
Requires: theme, utils
Packages: none
Exports: TypographyAccent, TypographyBlockquote, TypographyDisplay, TypographyEyebrow, TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyInlineCode, TypographyLarge, TypographyLead, TypographyList, TypographyMuted, TypographyP, TypographyProse, TypographySmall, TypographyTable
Client boundary: not required by this entry file
Reference: The Hoplite website's .display, .heading, .lead, .bp-prose (h2, h3, blockquote, code, a) and .bp-list (.bp-list__mark)


## Usage
Use the Typography parts for page and section headings, leads and articles outside a component. One accent word per headline at most. Use TypographyProse around rendered Markdown (a blog post, docs), TypographyEyebrow for the label above a heading.
- Avoid: Bold or semibold text
- Avoid: A fourth typeface
- Avoid: Sizes off the scale
- Avoid: Gradient or glowing accent words
- Avoid: Round list bullets


## Examples
Example components: npx hoplite-ds add typography
[Preview](https://hoplite-ds.vercel.app/preview/typography/Preview) | [Headings](https://hoplite-ds.vercel.app/preview/typography/Headings) | [Text](https://hoplite-ds.vercel.app/preview/typography/Text) | [Prose](https://hoplite-ds.vercel.app/preview/typography/Prose)

examples/typography.tsx

```tsx
import {
  TypographyAccent,
  TypographyBlockquote,
  TypographyEyebrow,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographyProse,
  TypographyTable,
} from "@/components/ui/typography";

export function Preview() {
  return (
    <div className="grid max-w-3xl gap-6">
      <TypographyEyebrow>Agents</TypographyEyebrow>
      <TypographyH1>
        A workstation for an army of <TypographyAccent>agents</TypographyAccent>
      </TypographyH1>
      <TypographyLead>Run coding agents side by side, each in its own sandbox, and merge what passes.</TypographyLead>
    </div>
  );
}

export function Headings() {
  return (
    <div className="grid gap-6">
      <TypographyH1>Heading one, 56px</TypographyH1>
      <TypographyH2>Heading two, 44px</TypographyH2>
      <TypographyH3>Heading three, 32px</TypographyH3>
      <TypographyH4>Heading four, 24px</TypographyH4>
      <TypographyMuted>Updated Oct 28 by the platform team</TypographyMuted>
    </div>
  );
}

export function Text() {
  return (
    <div className="max-w-2xl">
      <TypographyP>
        Each thread runs in a fresh sandbox with your repository checked out. Set the image with <TypographyInlineCode>hoplite.toml</TypographyInlineCode> and every agent starts from the same place.
      </TypographyP>
      <TypographyBlockquote>Take the issue affecting the most users, reproduce it with a failing test, fix it, and open a pull request.</TypographyBlockquote>
      <TypographyList>
        <li>A workspace with your repository connected</li>
        <li>Setup that runs green in the sandbox</li>
        <li>A Sentry project with alerts turned on</li>
      </TypographyList>
      <TypographyList ordered>
        <li>Create the automation</li>
        <li>Pick the trigger and the repository</li>
        <li>Write the instructions the agent follows</li>
      </TypographyList>
      <TypographyTable>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Sessions</th>
            <th>Sandbox</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Free</td>
            <td>5</td>
            <td>2 vCPU, 8 GiB</td>
          </tr>
          <tr>
            <td>Team</td>
            <td>20 per seat</td>
            <td>8 vCPU, 32 GiB</td>
          </tr>
        </tbody>
      </TypographyTable>
    </div>
  );
}

export function Prose() {
  return (
    <TypographyProse className="max-w-2xl">
      <p>Most alerts sit in a queue until someone has time. An automation can start the fix the moment the issue appears.</p>
      <h2>Set up the trigger</h2>
      <p>
        Open Automations, choose <code>Sentry issue created</code>, and pick the repository the agent should work in. <a href="#docs">Read the setup guide</a> for the permissions it needs.
      </p>
      <blockquote>
        <p>Look at unresolved issues that first appeared in the last hour. Skip anything already linked to an open pull request.</p>
      </blockquote>
      <h3>What the agent does</h3>
      <p>It reproduces the issue with a failing test, fixes it, and opens a pull request only when <strong>every check passes</strong>.</p>
    </TypographyProse>
  );
}

```

## Source

components/ui/typography.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// The site's type (.display, .heading, .lead, .bp-prose, .bp-list). Headings are Chakra Petch light in the ink: 56px
// (48px on a phone), 44px, 32px and 24px, balanced, drawn 1 percent tighter at display sizes; TypographyDisplay is the
// hero's 64px. The lead is 18px light graphite on a 28px line, stopping at 600px. Body is 16px graphite; a quote hangs
// 24px in behind a 2px dashed rule of the strong edge, in the ink. Lists mark each item with a 16px hexagon outline
// (points left and right) 12px from the text, or with a quiet Kode Mono number. Inline code is Kode Mono in the ink. The
// eyebrow is the 12px Kode Mono capital label; the accent is the one flat orange word in a headline. TypographyProse
// styles a whole article (a blog post) at 18px on a 32px line.
const DISPLAY = "font-display font-light text-balance text-fg";

function TypographyDisplay({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 data-slot="typography-display" className={cn(DISPLAY, "text-h2 leading-12 tracking-tight sm:text-display sm:leading-display", className)} {...props} />;
}

function TypographyH1({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 data-slot="typography-h1" className={cn(DISPLAY, "text-h2 leading-12 tracking-tight sm:text-h1 sm:leading-15", className)} {...props} />;
}

function TypographyH2({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="typography-h2" className={cn(DISPLAY, "text-h3 leading-10 sm:text-h2 sm:leading-heading", className)} {...props} />;
}

function TypographyH3({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="typography-h3" className={cn(DISPLAY, "text-h3 leading-10", className)} {...props} />;
}

function TypographyH4({ className, ...props }: React.ComponentProps<"h4">) {
  return <h4 data-slot="typography-h4" className={cn(DISPLAY, "text-h4 leading-8", className)} {...props} />;
}

function TypographyP({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-p" className={cn("font-sans text-body leading-line-body text-pretty text-fg-secondary [&:not(:first-child)]:mt-6", className)} {...props} />;
}

function TypographyLead({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-lead" className={cn("max-w-150 font-sans text-body leading-line-body font-light text-pretty text-fg-secondary sm:text-body-lg sm:leading-7", className)} {...props} />;
}

function TypographyLarge({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="typography-large" className={cn("font-sans text-body-lg leading-7 font-medium text-fg", className)} {...props} />;
}

function TypographySmall({ className, ...props }: React.ComponentProps<"small">) {
  return <small data-slot="typography-small" className={cn("font-sans text-body-sm leading-line-body-sm font-medium text-fg", className)} {...props} />;
}

function TypographyMuted({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-muted" className={cn("font-sans text-body-sm leading-line-body-sm text-fg-muted", className)} {...props} />;
}

/** The eyebrow, a column head or a date: 12px Kode Mono capitals, tracked 8 percent, quiet. */
function TypographyEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-eyebrow" className={cn("ds-label", className)} {...props} />;
}

/** The one accent word in a headline: flat orange, nothing else. */
function TypographyAccent({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="typography-accent" className={cn("text-fg-accent", className)} {...props} />;
}

const DASH_Y = "[background:repeating-linear-gradient(180deg,var(--ds-color-border-strong)_0_10px,transparent_0_18px)_left_top/2px_18px_no-repeat_round]";

function TypographyBlockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return <blockquote data-slot="typography-blockquote" className={cn("my-8 pl-6 font-sans text-body leading-7 text-fg", DASH_Y, className)} {...props} />;
}

function HexMark() {
  return (
    <svg data-slot="typography-list-mark" viewBox="0 0 16 16" width="16" height="16" aria-hidden className="mt-[calc((1lh-var(--ds-space-4))/2)] size-4 fill-none stroke-line-strong">
      <path d="M14 8L11 13.2L5 13.2L2 8L5 2.8L11 2.8Z" strokeWidth={1} />
    </svg>
  );
}

/** A list with hexagon bullets (or quiet numbers when ordered). Pass `li` children. */
function TypographyList({ className, ordered = false, children, ...props }: Omit<React.ComponentProps<"ul">, "ref"> & { ordered?: boolean }) {
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement<React.ComponentProps<"li">>(child) || child.type !== "li") return child;
    return React.cloneElement(
      child,
      { className: cn("grid items-start gap-x-3", ordered ? "grid-cols-[24px_minmax(0,1fr)] items-baseline [counter-increment:ds-item] before:font-mono before:text-body-sm before:text-fg-muted before:tabular-nums before:content-[counter(ds-item)]" : "grid-cols-[16px_minmax(0,1fr)]", child.props.className) },
      ordered ? null : <HexMark />,
      <span className="min-w-0">{child.props.children}</span>,
    );
  });
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag data-slot="typography-list" className={cn("my-6 grid list-none gap-3 p-0 font-sans text-body leading-line-body text-fg-secondary", ordered && "[counter-reset:ds-item]", className)} {...props}>
      {items}
    </Tag>
  );
}

function TypographyInlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return <code data-slot="typography-inline-code" className={cn("font-code tracking-code text-fg", className)} {...props} />;
}

function TypographyTable({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="typography-table" className="my-6 w-full overflow-x-auto fade-x">
      <table
        className={cn(
          "w-full border-collapse font-sans text-body-sm leading-line-body-sm [&_td]:border-b [&_td]:border-line [&_td]:py-3 [&_td]:pr-6 [&_td]:text-left [&_td]:text-fg [&_th]:border-b [&_th]:border-line [&_th]:py-3 [&_th]:pr-6 [&_th]:text-left [&_th]:font-mono [&_th]:text-caption [&_th]:font-normal [&_th]:tracking-caps [&_th]:text-fg-label [&_th]:[text-transform:uppercase] [&_td:first-child]:text-fg-secondary",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/** A whole article (the blog's .bp-prose): 18px graphite on a 32px line (16px on a phone), headings, links, quotes. */
function TypographyProse({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typography-prose"
      className={cn(
        "min-w-0 font-sans text-body leading-7 text-fg-secondary [overflow-wrap:break-word] sm:text-body-lg sm:leading-prose",
        "[&>*]:m-0 [&>*+*]:mt-5 sm:[&>*+*]:mt-6",
        "[&_:is(h2,h3)]:font-display [&_:is(h2,h3)]:font-light [&_:is(h2,h3)]:text-balance [&_:is(h2,h3)]:text-fg",
        "[&_h2]:text-h4 [&_h2]:leading-8 sm:[&_h2]:text-h3 sm:[&_h2]:leading-10 [&>h2]:mt-12 sm:[&>h2]:mt-16 [&>h2+*]:mt-4",
        "[&_h3]:text-h5 [&_h3]:leading-7 sm:[&_h3]:text-h4 sm:[&_h3]:leading-8 [&>h3]:mt-10 sm:[&>h3]:mt-12 [&>h3+*]:mt-3",
        "[&_a]:text-fg [&_a]:underline [&_a]:decoration-line-field [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:transition-[text-decoration-color] [&_a]:duration-base [&_a]:ease-out [&_a:hover]:decoration-current motion-reduce:[&_a]:transition-none",
        "[&_:is(p,li)_code]:font-code [&_:is(p,li)_code]:text-body [&_:is(p,li)_code]:leading-none [&_:is(p,li)_code]:text-fg",
        "[&>blockquote]:my-8 [&>blockquote]:pl-6 [&>blockquote]:text-fg",
        "[&>blockquote]:[background:repeating-linear-gradient(180deg,var(--ds-color-border-strong)_0_10px,transparent_0_18px)_left_top/2px_18px_no-repeat_round]",
        "[&_strong]:font-medium [&_strong]:text-fg",
        className,
      )}
      {...props}
    />
  );
}

export {
  TypographyAccent,
  TypographyBlockquote,
  TypographyDisplay,
  TypographyEyebrow,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographyProse,
  TypographySmall,
  TypographyTable,
};

```
