import * as React from "react";

import { Cta } from "@/components/blocks/cta";
import { FeatureGrid } from "@/components/blocks/feature-grid";
import { Footer } from "@/components/blocks/footer";
import { Hero } from "@/components/blocks/hero";
import { SiteHeader } from "@/components/blocks/site-header";
import { NodeTree } from "@/components/site/brand-marks";
import { cn } from "@/lib/utils";

// A product page (hoplite.sh/product/multiplayer): the hero with its two keys over the product drawing, the feature
// band with its heading and lead beside each other, the closing band and the footer.
function FeaturesPage({ className }: { className?: string }) {
  return (
    <div data-slot="features-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main>
        <Hero
          eyebrow="Multiplayer"
          title="The multiplayer coding agent for your whole team"
          lead="One agent, one thread, and the whole team in it."
          media={
            <div className="ds-corners grid min-h-80 place-items-center p-4 sm:p-8">
              <NodeTree root="fix-upload-500" rootNote="running" leaves={[{ title: "Agent", note: "opening a pull request", active: true }, { title: "Teammate", note: "steered the agent" }, { title: "Reviewer", note: "watching" }]} />
            </div>
          }
        />
        <FeatureGrid title="Share, hand off, and approve every run" lead="The whole team works in the same run, and it keeps going when the laptop closes." link={null} />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

export { FeaturesPage };
