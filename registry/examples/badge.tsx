import { CheckIcon, GitPullRequestIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>New</Badge>
      <Badge variant="solid">Team</Badge>
      <Badge variant="accent">Most popular</Badge>
    </div>
  );
}

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="solid">Solid</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Passed</Badge>
      <Badge variant="warning">Queued</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  );
}

export function WithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="success">
        <CheckIcon />
        Checks passed
      </Badge>
      <Badge>
        <GitPullRequestIcon />
        PR #482
      </Badge>
      <Badge asChild variant="outline">
        <a href="#changelog">Changelog</a>
      </Badge>
    </div>
  );
}

export function NavNews() {
  return (
    <a href="#subagents" className="grid w-full max-w-xs justify-items-start gap-3 border border-line p-4 transition-[border-color] duration-base ease-out hover:border-line-field focus-visible:-outline-offset-2 motion-reduce:transition-none">
      <Badge>New</Badge>
      <span className="text-body-sm leading-line-body-sm font-medium text-fg">Steer running subagents from your phone</span>
    </a>
  );
}
