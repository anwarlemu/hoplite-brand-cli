"use client";

import * as React from "react";
import { CaretUpDownIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function Preview() {
  return (
    <Collapsible defaultOpen className="w-full max-w-md">
      <CollapsibleTrigger>Advanced sandbox settings</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid gap-2 pt-4 pl-6 text-body-sm leading-line-body-sm text-fg-secondary">
          <p>Image: ubuntu-24.04 with Node 22</p>
          <p>Size: 4 vCPU, 16 GiB</p>
          <p>Idle timeout: 30 minutes</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const CHECKS = ["lint", "typecheck", "unit tests", "e2e: checkout"];

export function WithButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
        <span className="text-body-sm leading-line-body-sm font-medium text-fg">4 checks passed on #482</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={open ? "Hide checks" : "Show checks"}>
            <CaretUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ul className="grid">
          {CHECKS.map((check) => (
            <li key={check} className="flex h-9 items-center justify-between border-b border-line text-body-sm leading-line-body-sm text-fg-secondary">
              {check}
              <span className="font-mono text-caption tracking-code text-fg-muted">passed</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Disabled() {
  return (
    <Collapsible disabled>
      <CollapsibleTrigger>Billing history (owners only)</CollapsibleTrigger>
      <CollapsibleContent>Hidden</CollapsibleContent>
    </Collapsible>
  );
}
