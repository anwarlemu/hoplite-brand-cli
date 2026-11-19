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
