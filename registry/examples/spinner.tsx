import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function Preview() {
  return (
    <div className="flex items-center gap-3 text-body-sm leading-line-body-sm text-fg-secondary">
      <Spinner />
      Setting up the sandbox
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-6 text-fg">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-5" />
      <Spinner className="size-8" />
    </div>
  );
}

export function InControls() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Spinner />
        Starting thread
      </Button>
      <Button variant="outline" disabled>
        <Spinner />
        Running checks
      </Button>
      <Badge variant="secondary">
        <Spinner />
        Queued
      </Badge>
    </div>
  );
}
