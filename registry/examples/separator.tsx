import { Separator } from "@/components/ui/separator";

export function Preview() {
  return (
    <div className="max-w-sm">
      <p className="text-body-sm leading-line-body-sm font-medium text-fg">acme/storefront</p>
      <p className="text-body-sm leading-line-body-sm text-fg-muted">3 threads running, 12 merged this week</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-body-sm leading-line-body-sm text-fg-secondary">
        <span>Threads</span>
        <Separator orientation="vertical" />
        <span>Sandboxes</span>
        <Separator orientation="vertical" />
        <span>Automations</span>
      </div>
    </div>
  );
}

export function Dashed() {
  return (
    <div className="grid max-w-md gap-6">
      <Separator variant="dashed" />
      <div className="flex h-16 items-stretch gap-6 text-body-sm leading-line-body-sm text-fg-secondary">
        <span className="self-center">Free</span>
        <Separator variant="dashed" orientation="vertical" />
        <span className="self-center">Team</span>
        <Separator variant="dashed" orientation="vertical" />
        <span className="self-center">Enterprise</span>
      </div>
    </div>
  );
}
