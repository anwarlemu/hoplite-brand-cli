import * as React from "react";

import { HexNode } from "@/components/site/brand-marks";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// The closing band: a frame of corner ticks holding the Chakra Petch heading, a light lead and the two keys (the ink
// hexagon and the outlined one), with the orange cog node as its single mark.
function Cta({
  title = "Put your agents to work.",
  lead = "Start free. Your first swarm is a few minutes away.",
  primary = { label: "Start building", href: "#start" },
  secondary = { label: "Book a call", href: "#call" },
  className,
}: {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  primary?: { label: string; href: string } | null;
  secondary?: { label: string; href: string } | null;
  className?: string;
}) {
  return (
    <section data-slot="cta" className={cn("w-full py-20 sm:py-32", className)}>
      <div className="ds-corners mx-auto grid w-full max-w-320 gap-6 p-8 sm:p-16">
        <HexNode active className="size-8" />
        <TypographyH2 className="max-w-180">{title}</TypographyH2>
        {lead && <TypographyLead>{lead}</TypographyLead>}
        {(primary || secondary) && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {primary && <Button render={<a href={primary.href} />}>{primary.label}</Button>}
            {secondary && (
              <Button variant="outline" render={<a href={secondary.href} />}>
                {secondary.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export { Cta };
