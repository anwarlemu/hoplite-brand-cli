# Pricing table
The pricing page's plans: heading, lead and the billing toggle, then every plan in one stone frame split by hairlines, each with its node row, name, price, note, key and features or terms.

Install: npx hoplite-ds add pricing-table
Requires: theme, brand-marks, button, toggle-group, typography, utils
Packages: none
Exports: Plan, PricingTable
Client boundary: yes
Reference: The Hoplite website's pricing page (.pr-hero, .pr-plans: Free, Plus, Team, Enterprise)


## Usage
Use on the pricing page. Mark one plan's key as primary (the ink hexagon); the rest are outlined. Prices take a monthly and yearly value, or one value.
- Avoid: Two primary keys
- Avoid: A highlighted plan with a colored fill
- Avoid: Check marks instead of hexagons


## Examples
Example components: npx hoplite-ds add pricing-table
[Preview](https://hoplite-ds.vercel.app/preview/pricing-table/Preview)

examples/pricing-table.tsx

```tsx
import { PricingTable } from "@/components/blocks/pricing-table";

export function Preview() {
  return <PricingTable />;
}

```

## Source

components/blocks/pricing-table.tsx

```tsx
"use client";

import * as React from "react";

import { NodeCluster } from "@/components/site/brand-marks";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TypographyH1, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type Plan = {
  name: string;
  /** The price per period, or one value for both (such as Custom). */
  price: { monthly: string; yearly: string } | string;
  unit?: string;
  note?: { monthly: string; yearly: string } | string;
  description: string;
  action: { label: string; href: string; primary?: boolean };
  intro?: string;
  features?: string[];
  details?: [label: string, value: string][];
  nodes?: { count: number; active: number; ghost?: number };
};

const PLANS: Plan[] = [
  { name: "Free", price: "$0", note: "Free forever", description: "Run agents yourself, with a monthly usage allowance. Nothing charged.", action: { label: "Start free", href: "#free" }, features: ["5 concurrent cloud sessions", "Sandboxes up to 2 vCPU, 8 GiB RAM", "5 projects", "All platform models"], nodes: { count: 1, active: 1 } },
  { name: "Plus", price: { monthly: "$20", yearly: "$16.67" }, unit: "per seat / month", note: { monthly: "$16.67 per month on yearly", yearly: "Billed yearly" }, description: "The team features with lower limits and generous included usage per seat.", action: { label: "Start plus", href: "#plus" }, intro: "Everything in Free, and:", features: ["Generous included usage", "50 concurrent sandboxes per seat", "Unlimited projects", "Team seats and shared organizations"], nodes: { count: 3, active: 1 } },
  { name: "Team", price: { monthly: "$60", yearly: "$50" }, unit: "per seat / month", note: { monthly: "$50 per month on yearly", yearly: "Billed yearly" }, description: "The highest limits and the most included usage per seat.", action: { label: "Start team", href: "#team", primary: true }, intro: "Everything in Plus, and:", features: ["Most included usage per seat", "150 concurrent sandboxes per seat", "500 new threads per hour", "Usage charts and analytics"], nodes: { count: 5, active: 3 } },
  { name: "Enterprise", price: "Custom", note: "Annual agreement", description: "For organizations with custom security, infrastructure and support requirements.", action: { label: "Book a call", href: "#call" }, details: [["Sandbox capacity", "custom"], ["Security and governance", "advanced"], ["Networking and retention", "private"], ["Support", "contractual SLAs"], ["Agreement", "annual"]], nodes: { count: 5, active: 3, ghost: 2 } },
];

const per = <T,>(v: { monthly: T; yearly: T } | T, period: "monthly" | "yearly") => (v && typeof v === "object" && "monthly" in v ? v[period] : v) as T;

// The pricing page (.pr-hero, .pr-plans): the heading and lead with the billing toggle at the right, then the plans in
// one stone frame split by hairlines. Each plan opens with its row of nodes over a dashed rule, its name in Chakra Petch,
// the price at heading size with its unit, a quiet note, the description, its key (the ink hexagon for the one to pick,
// outlined for the rest), then a rule and its features beside outlined hexagons, or its terms on dashed rows.
function PricingTable({
  title = "Stay at the frontier of agentic coding.",
  lead = "Start free, then pay per seat for more included usage. Switch plans or cancel anytime.",
  plans = PLANS,
  yearlyLabel = "Yearly, save 17%",
  className,
}: {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  plans?: Plan[];
  yearlyLabel?: string;
  className?: string;
}) {
  const [period, setPeriod] = React.useState<"monthly" | "yearly">("monthly");
  return (
    <section data-slot="pricing-table" className={cn("w-full pt-20 pb-20 sm:pt-32", className)}>
      <div className="mx-auto grid w-full max-w-320 gap-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="grid max-w-180 gap-6">
            <TypographyH1>{title}</TypographyH1>
            {lead && <TypographyLead>{lead}</TypographyLead>}
          </div>
          <ToggleGroup value={period} onValueChange={(v) => v && setPeriod(v as "monthly" | "yearly")} aria-label="Billing period">
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="yearly">{yearlyLabel}</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grid border border-line-frame md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p, i) => (
            <article key={p.name} className={cn("flex flex-col gap-6 p-8", i > 0 && "border-t border-line-frame md:border-t-0", i % 2 === 1 && "md:border-l", i >= 2 && "md:border-t xl:border-t-0", i > 0 && "xl:border-l")}>
              {p.nodes && <NodeCluster {...p.nodes} />}
              <div className="grid gap-2">
                <h3 className="m-0 font-display text-h4 leading-8 font-normal text-fg">{p.name}</h3>
                <p className="m-0 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-h2 leading-heading font-light text-fg">{per(p.price, period)}</span>
                  {p.unit && <span className="text-body-sm leading-line-body-sm text-fg-secondary">{p.unit}</span>}
                </p>
                {p.note && <p className="m-0 text-body-sm leading-line-body-sm text-fg-muted">{per(p.note, period)}</p>}
              </div>
              <p className="m-0 min-h-18 text-body leading-line-body font-light text-pretty text-fg-secondary">{p.description}</p>
              <Button variant={p.action.primary ? "default" : "outline"} className="w-full" render={<a href={p.action.href} />}>
                {p.action.label}
              </Button>
              <div className="grid gap-3 border-t border-line pt-6">
                {p.intro && <p className="m-0 text-body-sm leading-line-body-sm text-fg-muted">{p.intro}</p>}
                {p.features && (
                  <ul className="m-0 grid list-none gap-3 p-0">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-body-sm leading-line-body-sm text-fg">
                        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden className="mt-1 size-3 shrink-0 fill-none stroke-line-strong">
                          <path d="M11 6L8.5 10.33L3.5 10.33L1 6L3.5 1.67L8.5 1.67Z" strokeWidth={1} />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                {p.details && (
                  <dl className="m-0 grid">
                    {p.details.map(([k, v]) => (
                      <div key={k} className="ds-rule-x flex items-baseline justify-between gap-4 py-2 text-body-sm leading-line-body-sm">
                        <dt className="text-fg-secondary">{k}</dt>
                        <dd className="m-0 text-right text-fg">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PricingTable };

```
