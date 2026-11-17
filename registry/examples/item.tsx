import { CaretRightIcon, ChatsCircleIcon, CubeIcon, GithubLogoIcon, GitPullRequestIcon, LightningIcon, SlackLogoIcon, WarningIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

const NAV = [
  { icon: ChatsCircleIcon, title: "Threads", body: "Run agents side by side and steer them" },
  { icon: CubeIcon, title: "Sandboxes", body: "A fresh machine for every task" },
  { icon: LightningIcon, title: "Automations", body: "Start work from alerts, issues and schedules" },
];

export function Preview() {
  return (
    <ItemGroup className="max-w-sm">
      {NAV.map(({ icon: Icon, title, body }) => (
        <Item key={title} asChild role="listitem">
          <a href={`#${title.toLowerCase()}`}>
            <ItemMedia variant="icon">
              <Icon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{body}</ItemDescription>
            </ItemContent>
          </a>
        </Item>
      ))}
    </ItemGroup>
  );
}

const STACK = [
  { icon: WarningIcon, title: "Starts from an alert", body: "A new Sentry issue starts a fix before anyone has opened it." },
  { icon: GitPullRequestIcon, title: "Ships a pull request", body: "Tests pass before you look. Comment on it and the agent pushes the change." },
  { icon: GithubLogoIcon, title: "Keeps issues current", body: "Each issue is linked to its run and moves along as the work lands." },
  { icon: SlackLogoIcon, title: "Reports back in Slack", body: "The pull request lands in the thread your team already reads." },
];

export function Ruled() {
  return (
    <ItemGroup className="max-w-md">
      {STACK.map(({ icon: Icon, title, body }) => (
        <Item key={title} variant="ruled" role="listitem">
          <ItemMedia variant="icon">
            <Icon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>{body}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

export function Variants() {
  return (
    <div className="grid max-w-md gap-4">
      <Item variant="outline" asChild>
        <a href="#subagents" className="flex-col items-start">
          <Badge>New</Badge>
          <ItemTitle>Steer running subagents from your phone</ItemTitle>
        </a>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>acme/storefront</ItemTitle>
          <ItemDescription>Setup ran green · 3 threads running</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="secondary">
            Open
          </Button>
        </ItemActions>
      </Item>
      <Item size="sm" asChild>
        <a href="#billing">
          <ItemContent>
            <ItemTitle>Billing and seats</ItemTitle>
          </ItemContent>
          <ItemActions>
            <CaretRightIcon className="size-4 text-fg-muted" />
          </ItemActions>
        </a>
      </Item>
    </div>
  );
}
