# Home page
The home page template: header, hero over a drawing, the customer strip, the feature band, a quote, the closing band and the footer.

Install: npx hoplite-ds add home-page
Requires: theme, cta, feature-grid, footer, hero, logos-strip, site-header, testimonial, brand-marks, utils
Packages: none
Exports: HomePage
Client boundary: not required by this entry file
Reference: The Hoplite website's home page (hoplite-website-fawn.vercel.app)


## Usage
Start a marketing home page from this and replace the copy and the media.
- Avoid: Copy from real people or third parties
- Avoid: Sections reordered so two closing bands meet
- Avoid: Values outside the brand tokens
Built only from the section blocks and library items; every part takes its copy through props.

## Examples
Example components: npx hoplite-ds add home-page
[Preview](https://hoplite-ds.vercel.app/preview/home-page/Preview)

examples/home-page.tsx

```tsx
import { HomePage } from "@/components/blocks/home-page";

export function Preview() {
  return <HomePage />;
}

```

## Source

components/blocks/home-page.tsx

```tsx
import * as React from "react";

import { Cta } from "@/components/blocks/cta";
import { FeatureGrid } from "@/components/blocks/feature-grid";
import { Footer } from "@/components/blocks/footer";
import { Hero } from "@/components/blocks/hero";
import { LogosStrip } from "@/components/blocks/logos-strip";
import { SiteHeader } from "@/components/blocks/site-header";
import { Testimonial } from "@/components/blocks/testimonial";
import { NodeTree } from "@/components/site/brand-marks";
import { cn } from "@/lib/utils";

// The home page (hoplite.sh): header, hero over the product drawing, the customer strip, the feature band, a quote,
// the closing band and the footer. Pass `media` for the product window; the default is a drawing in corner ticks.
function HomePage({ media, className }: { media?: React.ReactNode; className?: string }) {
  return (
    <div data-slot="home-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main>
        <Hero
          media={
            media ?? (
              <div className="ds-corners grid min-h-80 place-items-center p-4 sm:p-8">
                <NodeTree root="Fix uploads over 10 MB" rootNote="thread 482" leaves={[{ title: "Sandbox one", note: "reproduced" }, { title: "Sandbox two", note: "tests pass" }, { title: "Pull request", note: "ready for review", active: true }]} />
              </div>
            )
          }
        />
        <LogosStrip />
        <FeatureGrid />
        <Testimonial />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

export { HomePage };

```
