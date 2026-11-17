"use client";

import { GitPullRequestIcon } from "@phosphor-icons/react/ssr";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

function PullRequestCard({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <p className="m-0 max-w-md text-body leading-body text-fg-secondary">
      The agent opened{" "}
      <HoverCard defaultOpen={defaultOpen}>
        <HoverCardTrigger href="#pull-482" className="font-medium text-fg underline decoration-line decoration-1 underline-offset-4 transition-[text-decoration-color] duration-base ease-out hover:decoration-current motion-reduce:transition-none">
          #482
        </HoverCardTrigger>
        <HoverCardContent align="start" className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <GitPullRequestIcon className="size-5 shrink-0 text-fg" />
            <div className="flex flex-col">
              <span className="font-medium text-fg">Fix flaky upload test</span>
              <span className="text-fg-muted">acme/web, fix/upload-retry into main</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3">
            <span className="ds-label">Checks</span>
            <span className="text-fg">4 of 4 passed</span>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      after its checks passed in the sandbox.
    </p>
  );
}

export function Preview() {
  return <PullRequestCard />;
}

export function Open() {
  return (
    <div className="min-h-64">
      <PullRequestCard defaultOpen />
    </div>
  );
}
