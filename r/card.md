# Card
The site's frames: a square stone frame 32px in (a plan card), crop-mark corners (a feature frame), or a quiet rule above. Titles are Chakra Petch 24px (20px small); text is 16px light graphite; an action at the top right and keys in the footer.

Install: npx hoplite-ds add card
Requires: theme, utils
Packages: class-variance-authority
Exports: Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants
Client boundary: not required by this entry file
Reference: The Hoplite website's plan cards (.pr-plan, .pr-plan__name, .pr-plan__body), bands (.band__frame, .band__title) and feature frames (.how__frame with its corners)


## Usage
Use Card for a plan, a feature or a resource that sits beside others. Use the default frame for plans and settings groups, variant="corners" around product art or a figure, and variant="ruled" for a row of short features. size="sm" for dense grids (24px in, 20px titles). One ink key per card at most.
- Avoid: A white or filled card on the ground
- Avoid: Rounded corners
- Avoid: A drop shadow
- Avoid: Bold titles
- Avoid: A card inside a card


## Examples
Example components: npx hoplite-ds add card badge button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/card/Preview) | [Variants](https://hoplite-ds.vercel.app/preview/card/Variants) | [Small](https://hoplite-ds.vercel.app/preview/card/Small) | [Ruled](https://hoplite-ds.vercel.app/preview/card/Ruled)

examples/card.tsx

```tsx
import { CheckIcon, DotsThreeIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Preview() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>For teams shipping with agents every day. Shared threads, seats and automations.</CardDescription>
        <CardAction>
          <Badge variant="accent">Most popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-1">
        <span className="font-display text-h2 leading-heading font-light text-fg">$20</span>
        <span className="text-body-sm leading-line-body-sm font-normal text-fg-muted">per seat a month</span>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start team</Button>
      </CardFooter>
    </Card>
  );
}

const FEATURES = ["20 concurrent cloud sessions", "Sandboxes up to 8 vCPU, 32 GiB", "Unlimited projects"];

export function Variants() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>Run agents yourself, with a monthly usage allowance.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 border-t border-line pt-6">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-body-sm leading-line-body-sm font-normal text-fg">
                <CheckIcon className="size-4 text-fg-muted" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card variant="corners">
        <CardHeader>
          <CardTitle>Every agent in one place</CardTitle>
          <CardDescription>Watch threads run side by side, step in when one needs you, and merge when checks pass.</CardDescription>
        </CardHeader>
        <div className="grid aspect-4/3 w-full place-items-center border border-line">
          <span className="ds-label">Product art</span>
        </div>
      </Card>
    </div>
  );
}

export function Small() {
  return (
    <Card size="sm" className="max-w-sm">
      <CardHeader>
        <CardTitle>Nightly dependency bump</CardTitle>
        <CardDescription>Automation · runs at 02:00 on acme/storefront</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More">
            <DotsThreeIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button size="sm" variant="outline">
          Run now
        </Button>
        <Button size="sm" variant="ghost">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

export function Ruled() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {[
        ["Parallel threads", "Start as many agents as the work needs, each in its own sandbox."],
        ["Checks first", "Nothing reaches review until tests pass in the sandbox."],
        ["Yours to steer", "Message a running agent from the desktop or your phone."],
      ].map(([title, body]) => (
        <Card key={title} variant="ruled" size="sm">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{body}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

```

## Source

components/ui/card.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// The site's frames. `default` is a plan card or a band (.pr-plan, .band__frame): a square frame of the stone line on
// the same ground, 32px in (24px at size sm), never a fill or a shadow. `corners` is the feature frame (.how__frame,
// .band__frame on the home page): four 16px slate crop marks at the corners over a transparent edge. `ruled` drops the
// frame for a quiet rule above, for cards that sit in a row of their own. Titles are Chakra Petch 24px (20px at size sm)
// in the ink (.band__title, .pr-plan__name); the description and body are 16px light graphite (.pr-plan__body); an
// action sits at the top right and the footer holds the keys.
const cardVariants = cva("group/card flex min-w-0 flex-col gap-6 font-sans text-fg data-[size=sm]:gap-4", {
  variants: {
    variant: {
      default: "border border-line-frame p-8 data-[size=sm]:p-6",
      corners: "ds-corners p-8 data-[size=sm]:p-6",
      ruled: "border-t border-line pt-8 data-[size=sm]:pt-6",
    },
  },
  defaultVariants: { variant: "default" },
});

function Card({ className, variant, size = "default", ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
  return <div data-slot="card" data-variant={variant ?? "default"} data-size={size} className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid auto-rows-min items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:gap-x-4 has-data-[slot=card-action]:*:data-[slot=card-description]:col-span-2", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("font-display text-h4 leading-8 font-normal text-balance text-fg group-data-[size=sm]/card:text-h5 group-data-[size=sm]/card:leading-7", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-body leading-line-body font-light text-pretty text-fg-secondary", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("text-body leading-line-body font-light text-fg-secondary", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex flex-wrap items-center gap-3", className)} {...props} />;
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };

```
