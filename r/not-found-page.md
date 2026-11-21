# Not found page
The 404 template: mono code, display line and lead, two keys back, and a branch drawing ending at the missing page, inside corner ticks.

Install: npx hoplite-ds add not-found-page
Requires: theme, footer, site-header, brand-marks, button, typography, utils
Packages: none
Exports: NotFoundPage
Client boundary: not required by this entry file
Reference: The Hoplite website's type, frames and blog diagrams; the site's 404 was not captured


## Usage
Use as the app's not-found route.
- Avoid: Copy from real people or third parties
- Avoid: Sections reordered so two closing bands meet
- Avoid: Values outside the brand tokens
Built only from the section blocks and library items; every part takes its copy through props.

## Examples
Example components: npx hoplite-ds add not-found-page
[Preview](https://hoplite-ds.vercel.app/preview/not-found-page/Preview)

examples/not-found-page.tsx

```tsx
import { NotFoundPage } from "@/components/blocks/not-found-page";

export function Preview() {
  return <NotFoundPage />;
}

```

## Source

components/blocks/not-found-page.tsx

```tsx
import * as React from "react";

import { Footer } from "@/components/blocks/footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { NodeTree } from "@/components/site/brand-marks";
import { Button } from "@/components/ui/button";
import { TypographyDisplay, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// The 404 page: the mono code, a display line and a lead, the two keys back (home and the docs), and a branch drawing
// whose last leaf is the missing page, all inside a frame of corner ticks.
function NotFoundPage({ title = "This page is not here.", lead = "It may have moved, or the link may be wrong. Head back home or search the docs.", className }: { title?: string; lead?: string; className?: string }) {
  return (
    <div data-slot="not-found-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-320 py-20 sm:py-32">
        <div className="ds-corners grid gap-12 p-8 sm:p-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div className="grid gap-6">
            <p className="ds-label m-0">Error 404</p>
            <TypographyDisplay>{title}</TypographyDisplay>
            <TypographyLead>{lead}</TypographyLead>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button render={<a href="/" />}>Back home</Button>
              <Button variant="outline" render={<a href="#docs" />}>
                Read the docs
              </Button>
            </div>
          </div>
          <NodeTree root="Request" rootNote="GET /page" leaves={[{ title: "Router", note: "no match" }, { title: "Redirects", note: "none" }, { title: "Not found", note: "404", active: true }]} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export { NotFoundPage };

```
