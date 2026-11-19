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
