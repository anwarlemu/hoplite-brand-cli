# Hero
The page opener: the 64px Chakra Petch light headline, the light lead, the ink hexagon and the outlined hexagon side by side, an optional mono eyebrow and a media slot below at full width.

Install: npx hoplite-ds add hero
Requires: theme, button, typography, utils
Packages: none
Exports: HeroAction, Hero
Client boundary: not required by this entry file
Reference: The Hoplite website's home and product heroes (.hero: A workstation for your army of coding agents, The multiplayer coding agent for your whole team)


## Usage
Use once per page, first after the header. Keep the headline to two lines; put the product window or a drawing in media.
- Avoid: A headline in bold or capitals
- Avoid: An orange key
- Avoid: More than two keys
- Avoid: Centered hero copy


## Examples
Example components: npx hoplite-ds add hero brand-marks
[Preview](https://hoplite-ds.vercel.app/preview/hero/Preview) | [WithMedia](https://hoplite-ds.vercel.app/preview/hero/WithMedia)

examples/hero.tsx

```tsx
import { NodeTree } from "@/components/site/brand-marks";
import { Hero } from "@/components/blocks/hero";

export function Preview() {
  return <Hero />;
}

export function WithMedia() {
  return (
    <Hero
      eyebrow="Multiplayer"
      title="The multiplayer coding agent for your whole team"
      lead="One agent, one thread, and the whole team in it."
      media={
        <div className="ds-corners grid min-h-64 place-items-center p-8">
          <NodeTree root="fix-upload-500" rootNote="running" leaves={[{ title: "Agent", note: "running", active: true }, { title: "Teammate", note: "steering" }]} />
        </div>
      }
    />
  );
}

```

## Source

components/blocks/hero.tsx

```tsx
import * as React from "react";

import { Button } from "@/components/ui/button";
import { TypographyDisplay, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type HeroAction = { label: string; href: string; icon?: React.ReactNode };

// The site's hero (.hero on the home and product pages): the 64px Chakra Petch light headline at the left, stopping
// near 640px so it breaks in two, the 18px light lead under it, then the ink hexagon and the outlined hexagon side by
// side. `media` sits below at the full width (the product window on the site); `eyebrow` is an optional mono label.
function Hero({
  eyebrow,
  title = "A workstation for your army of coding agents.",
  lead = "Run swarms of agents for days at a time, together with your team, from software you would happily sit in front of for twelve hours.",
  primary = { label: "Start building", href: "#start" },
  secondary = { label: "Read the docs", href: "#docs" },
  media,
  className,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  lead?: React.ReactNode;
  primary?: HeroAction | null;
  secondary?: HeroAction | null;
  media?: React.ReactNode;
  className?: string;
}) {
  return (
    <section data-slot="hero" className={cn("w-full pt-20 pb-16 sm:pt-32", className)}>
      <div className="mx-auto grid w-full max-w-320 gap-12">
        <div className="grid max-w-180 gap-6">
          {eyebrow && <p className="ds-label">{eyebrow}</p>}
          <TypographyDisplay>{title}</TypographyDisplay>
          {lead && <TypographyLead>{lead}</TypographyLead>}
          {(primary || secondary) && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {primary && (
                <Button render={<a href={primary.href} />}>
                  {primary.icon}
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button variant="outline" render={<a href={secondary.href} />}>
                  {secondary.icon}
                  {secondary.label}
                </Button>
              )}
            </div>
          )}
        </div>
        {media}
      </div>
    </section>
  );
}

export { Hero };

```
