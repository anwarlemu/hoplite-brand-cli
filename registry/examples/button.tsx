import { AppleLogoIcon, ArrowRightIcon, GearSixIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Start building</Button>
      <Button variant="outline">
        <AppleLogoIcon weight="fill" />
        Download for macOS
      </Button>
    </div>
  );
}

export function Variants() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Start team</Button>
        <Button variant="outline">Start free</Button>
        <Button variant="secondary">
          <PlusIcon />
          New thread
        </Button>
        <Button variant="destructive">
          <TrashIcon />
          Delete sandbox
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Button variant="ghost">Product</Button>
        <Button variant="ghost">Pricing</Button>
        <Button variant="ghost" size="icon-sm" aria-label="Settings">
          <GearSixIcon />
        </Button>
        <Button variant="link">
          Read the quickstart
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Start building</Button>
      <Button>Start building</Button>
      <Button size="lg">Start building</Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Start building</Button>
      <Button variant="outline" disabled>
        Start free
      </Button>
      <Button asChild variant="outline">
        <a href="#pricing">See pricing</a>
      </Button>
    </div>
  );
}
