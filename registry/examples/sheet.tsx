"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const CHECKS = [
  { name: "Unit tests", state: "Passed" },
  { name: "Type check", state: "Passed" },
  { name: "End-to-end", state: "Running" },
  { name: "Lint", state: "Passed" },
];

function PullRequest({ defaultOpen, side = "right" }: { defaultOpen?: boolean; side?: "right" | "left" | "top" | "bottom" }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger render={<Button variant="outline" />}>{side === "right" ? "Review pull request" : `Open ${side}`}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Fix flaky upload test</SheetTitle>
          <SheetDescription>#482 on acme/web, opened by the agent after its checks passed in the sandbox.</SheetDescription>
        </SheetHeader>
        <ul className="m-0 list-none px-6 py-0">
          {CHECKS.map((check) => (
            <li key={check.name} className="flex items-center justify-between border-b border-line py-3 text-body-sm leading-line-body-sm first:border-t">
              <span className="text-fg-secondary">{check.name}</span>
              <span className="text-fg">{check.state}</span>
            </li>
          ))}
        </ul>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
          <Button>Merge</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function Preview() {
  return <PullRequest />;
}

export function Open() {
  return (
    <div className="min-h-120">
      <PullRequest defaultOpen />
    </div>
  );
}

export function Sides() {
  return (
    <div className="flex flex-wrap gap-3">
      <PullRequest side="left" />
      <PullRequest side="top" />
      <PullRequest side="bottom" />
    </div>
  );
}

export function Form() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Edit sandbox</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sandbox settings</SheetTitle>
          <SheetDescription>Applies to new threads in acme-web.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-6">
          <label className="flex flex-col gap-2">
            <span className="text-body-sm leading-line-body-sm font-medium text-fg">Setup command</span>
            <Input defaultValue="pnpm install" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-body-sm leading-line-body-sm font-medium text-fg">Idle timeout, minutes</span>
            <Input type="number" defaultValue={30} />
          </label>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
