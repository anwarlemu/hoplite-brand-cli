import * as React from "react";

import { Cta } from "@/components/blocks/cta";
import { Faq } from "@/components/blocks/faq";
import { Footer } from "@/components/blocks/footer";
import { PricingTable } from "@/components/blocks/pricing-table";
import { SiteHeader } from "@/components/blocks/site-header";
import { Table, TableBody, TableCell, TableGroup, TableHead, TableHeader, TableNo, TableRow, TableYes } from "@/components/ui/table";
import { TypographyH2, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type CompareGroup = { title: string; rows: [label: string, ...values: (string | boolean)[]][] };

const PLANS = ["Free", "Plus", "Team", "Enterprise"];
const GROUPS: CompareGroup[] = [
  { title: "Usage", rows: [["Included usage", "Monthly, with a daily limit", "Generous, per seat", "Most, per seat", "Custom"], ["All platform models", true, true, true, true], ["Your own model subscription", true, true, true, true], ["Prepaid credits beyond that", false, true, true, true], ["Usage charts and analytics", false, true, true, true]] },
  { title: "Agents and sandboxes", rows: [["Concurrent sandboxes", "5 sessions", "50 per seat", "150 per seat", "Custom"], ["Largest sandbox", "2 vCPU, 8 GiB", "8 vCPU, 32 GiB", "16 vCPU, 64 GiB", "Custom"], ["New threads per hour", "50", "250", "500", "Custom"], ["Projects", "5", "Unlimited", "Unlimited", "Unlimited"]] },
];

// The pricing page: the plans with their billing toggle, the comparison under a dashed section rule (the heading at
// the left, its note at the right, the compare table with filled hexagons for included and dashes for not), the
// questions and the closing band.
function PricingPage({ plans = PLANS, groups = GROUPS, className }: { plans?: string[]; groups?: CompareGroup[]; className?: string }) {
  return (
    <div data-slot="pricing-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main>
        <PricingTable />
        <section className="w-full py-20 sm:py-32 [background:repeating-linear-gradient(90deg,var(--ds-color-border-default)_0_10px,transparent_0_18px)_left_top/100%_1px_no-repeat]">
          <div className="mx-auto grid w-full max-w-320 gap-12">
            <div className="grid gap-6 md:grid-cols-2 md:items-end">
              <TypographyH2>Compare every plan</TypographyH2>
              <TypographyLead>The plan names stay pinned while you read down.</TypographyLead>
            </div>
            <div className="overflow-x-auto fade-x">
              <Table variant="compare" className="min-w-180">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="sr-only">Feature</span>
                    </TableHead>
                    {plans.map((p) => (
                      <TableHead key={p}>{p}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                {groups.map((g) => (
                  <TableBody key={g.title}>
                    <TableGroup colSpan={plans.length + 1}>{g.title}</TableGroup>
                    {g.rows.map(([label, ...values]) => (
                      <TableRow key={label}>
                        <TableHead scope="row">{label}</TableHead>
                        {values.map((v, i) => (
                          <TableCell key={i}>{v === true ? <TableYes /> : v === false ? <TableNo /> : v}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
              </Table>
            </div>
          </div>
        </section>
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

export { PricingPage };
