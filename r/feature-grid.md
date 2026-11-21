# Feature grid
The feature band: a Chakra Petch heading with its lead and text link, then features two to a row in stone frames, each with a title, a light line, an optional link and a drawing in corner ticks.

Install: npx hoplite-ds add feature-grid
Requires: theme, brand-marks, card, typography, utils
Packages: @phosphor-icons/react
Exports: Feature, FeatureGrid
Client boundary: not required by this entry file
Reference: The Hoplite website's home and product bands (.how, .band: Give the swarm the job, Share, hand off, and approve every run)


## Usage
Use for the product's main capabilities, two or four at a time. Give each a drawing (NodeTree or your own art) in the art slot.
- Avoid: Icons in colored circles
- Avoid: Cards with shadows or rounded corners
- Avoid: Odd counts that leave a gap


## Examples
Example components: npx hoplite-ds add feature-grid
[Preview](https://hoplite-ds.vercel.app/preview/feature-grid/Preview)

examples/feature-grid.tsx

```tsx
import { FeatureGrid } from "@/components/blocks/feature-grid";

export function Preview() {
  return <FeatureGrid />;
}

```

## Source

components/blocks/feature-grid.tsx

```tsx
import * as React from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

import { NodeTree } from "@/components/site/brand-marks";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH2, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type Feature = { title: string; description: string; link?: { label: string; href: string }; art?: React.ReactNode };

const FEATURES: Feature[] = [
  {
    title: "Pick your agent",
    description: "Run the coding agent you already use, on your own subscription or on ours.",
    link: { label: "Pricing", href: "#pricing" },
    art: <NodeTree root="Hoplite" rootNote="your plan" leaves={[{ title: "Agent one", note: "your plan" }, { title: "Agent two", note: "your plan" }, { title: "Agent three", note: "our plan", active: true }]} />,
  },
  {
    title: "Connect once",
    description: "Install the app on your repositories and bring your skills and MCP servers along.",
    link: { label: "Import your setup", href: "#import" },
    art: <NodeTree root="Your setup" leaves={[{ title: "Repositories", note: "acme/web" }, { title: "Skills", note: "review, test" }, { title: "MCP servers", note: "importing", active: true }]} />,
  },
  {
    title: "One thread, everyone in it",
    description: "Start a task and the whole workspace can open it while it runs.",
    art: <NodeTree root="fix-upload-500" rootNote="3 in the thread" leaves={[{ title: "Agent", note: "running", active: true }, { title: "Reviewer", note: "watching" }, { title: "Teammate", note: "steering" }]} />,
  },
  {
    title: "Sensitive actions, approved by anyone",
    description: "The run pauses for approval and any teammate can answer it.",
    art: <NodeTree root="Deploy" rootNote="needs approval" leaves={[{ title: "Tests", note: "passed" }, { title: "Review", note: "approved" }, { title: "Ship", note: "waiting", active: true }]} />,
  },
];

// The site's feature band (.how and .band on the home and product pages): a Chakra Petch heading with its lead beside it
// (or under it, with a text link), then the features two to a row, each a stone-framed card with its title, a light
// line, an optional text link, and its drawing in a frame of corner ticks.
function FeatureGrid({
  title = "Give the swarm the job. Review what comes back.",
  lead = "Four steps from your repo to a green pull request.",
  link = { label: "Read the quickstart", href: "#quickstart" },
  features = FEATURES,
  className,
}: {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  link?: { label: string; href: string } | null;
  features?: Feature[];
  className?: string;
}) {
  return (
    <section data-slot="feature-grid" className={cn("w-full py-20 sm:py-32", className)}>
      <div className="mx-auto grid w-full max-w-320 gap-16">
        <div className="grid max-w-180 gap-6">
          <TypographyH2>{title}</TypographyH2>
          {lead && <TypographyLead>{lead}</TypographyLead>}
          {link && (
            <a href={link.href} className="ds-link w-fit">
              <span>{link.label}</span>
              <ArrowRightIcon className="size-4" aria-hidden />
            </a>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title} className="gap-10 sm:p-10">
              <CardHeader className="gap-3">
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
                {f.link && (
                  <a href={f.link.href} className="ds-link mt-2 w-fit">
                    <span>{f.link.label}</span>
                    <ArrowRightIcon className="size-4" aria-hidden />
                  </a>
                )}
              </CardHeader>
              {f.art && <div className="ds-corners mt-auto grid min-h-64 place-items-center overflow-hidden p-4 sm:p-8">{f.art}</div>}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeatureGrid };

```
