import { ArrowRightIcon, GitBranchIcon, RobotIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function Preview() {
  return (
    <Empty variant="outline">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RobotIcon />
        </EmptyMedia>
        <EmptyTitle>No threads yet</EmptyTitle>
        <EmptyDescription>Start a thread and an agent picks up the task in its own sandbox.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Start a thread</Button>
        <Button variant="outline">Import an issue</Button>
      </EmptyContent>
    </Empty>
  );
}

export function Corners() {
  return (
    <Empty variant="corners">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GitBranchIcon />
        </EmptyMedia>
        <EmptyTitle>Connect a repository</EmptyTitle>
        <EmptyDescription>
          Agents need a repository to work in. <a href="#docs">Read the setup guide</a>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="link">
          Connect GitHub
          <ArrowRightIcon />
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function Bare() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No automations match “nightly”</EmptyTitle>
        <EmptyDescription>Try another name, or clear the filter.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="secondary" size="sm">
          Clear filter
        </Button>
      </EmptyContent>
    </Empty>
  );
}
