import * as React from "react";

import { Cta } from "@/components/blocks/cta";
import { Footer } from "@/components/blocks/footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { HexNode } from "@/components/site/brand-marks";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyDisplay, TypographyH2, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type Value = { title: string; description: string };
export type Stat = { value: string; label: string };

const VALUES: Value[] = [
  { title: "Agents do the work", description: "People decide what to build and review what comes back. Everything in between belongs to the swarm." },
  { title: "Software worth sitting in front of", description: "Tools you use for twelve hours a day should be calm, fast and exact." },
  { title: "Every run is reviewable", description: "Each agent gets its own branch and its own sandbox, and ends in a pull request a person reads." },
];

const STATS: Stat[] = [
  { value: "1,000s", label: "Threads every day" },
  { value: "5", label: "Concurrent sessions on Free" },
  { value: "16 vCPU", label: "Largest sandbox on Team" },
];

// The about page: a display headline and lead under a solid rule, the numbers in Chakra Petch over mono labels split by
// dashed rules, the values as ruled cards each marked with a node, then the closing band.
function AboutPage({ values = VALUES, stats = STATS, className }: { values?: Value[]; stats?: Stat[]; className?: string }) {
  return (
    <div data-slot="about-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main>
        <section className="w-full pt-20 pb-16 sm:pt-32">
          <div className="mx-auto grid w-full max-w-320 gap-6 border-b border-line-strong pb-16">
            <p className="ds-label m-0">About</p>
            <TypographyDisplay className="max-w-200">We are building the workstation for coding agents.</TypographyDisplay>
            <TypographyLead>A small team that thinks agents should run in the cloud, in parallel, for days, and come back with work a person can trust.</TypographyLead>
          </div>
        </section>
        <section className="w-full">
          <div className="mx-auto m-0 grid w-full max-w-320 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={s.label} className="relative grid gap-2 py-8 sm:px-8 sm:first:pl-0">
                {i > 0 && <span aria-hidden className="ds-rule-x absolute inset-x-0 top-0 h-px sm:hidden" />}
                {i > 0 && <span aria-hidden className="ds-rule-y absolute inset-y-0 left-0 hidden w-px sm:block" />}
                <p className="ds-label order-2 m-0">{s.label}</p>
                <p className="m-0 font-display text-h2 leading-heading font-light text-fg">{s.value}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="w-full py-20 sm:py-32">
          <div className="mx-auto grid w-full max-w-320 gap-12">
            <TypographyH2>What we believe</TypographyH2>
            <div className="grid gap-8 md:grid-cols-3">
              {values.map((v, i) => (
                <Card key={v.title} variant="ruled">
                  <CardHeader className="gap-3">
                    <HexNode active={i === 0} />
                    <CardTitle>{v.title}</CardTitle>
                    <CardDescription>{v.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <Cta title="Come build with us." lead="We are hiring across engineering and design." primary={{ label: "Open roles", href: "#careers" }} secondary={{ label: "Contact", href: "#contact" }} />
      </main>
      <Footer />
    </div>
  );
}

export { AboutPage };
