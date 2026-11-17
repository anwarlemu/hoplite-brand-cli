"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function Preview() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-terms" defaultChecked />
      <Label htmlFor="checkbox-terms">Require a passing check before merge</Label>
    </div>
  );
}

export function States() {
  return (
    <div className="grid gap-4">
      <Label>
        <Checkbox />
        Off
      </Label>
      <Label>
        <Checkbox defaultChecked />
        On
      </Label>
      <Label>
        <Checkbox indeterminate />
        Some
      </Label>
      <Label>
        <Checkbox aria-invalid />
        Invalid
      </Label>
      <Label>
        <Checkbox disabled />
        Disabled
      </Label>
      <Label>
        <Checkbox disabled defaultChecked />
        Disabled on
      </Label>
    </div>
  );
}

const CHECKS = ["Typecheck", "Unit tests", "Lint", "Preview deploy"];

export function Indeterminate() {
  const [on, setOn] = React.useState<string[]>(["Typecheck", "Unit tests"]);
  const all = on.length === CHECKS.length;
  return (
    <div className="grid gap-3">
      <Label>
        <Checkbox checked={all} indeterminate={on.length > 0 && !all} onCheckedChange={(checked) => setOn(checked ? CHECKS : [])} />
        Required checks
      </Label>
      <div className="grid gap-3 pl-6">
        {CHECKS.map((check) => (
          <Label key={check} className="font-normal text-fg-secondary">
            <Checkbox checked={on.includes(check)} onCheckedChange={(checked) => setOn((current) => (checked ? [...current, check] : current.filter((item) => item !== check)))} />
            {check}
          </Label>
        ))}
      </div>
    </div>
  );
}
