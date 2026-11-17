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
