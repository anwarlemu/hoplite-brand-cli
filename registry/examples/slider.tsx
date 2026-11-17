"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function Preview() {
  const [value, setValue] = React.useState([8]);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="flex items-center justify-between">
        <Label>Concurrent sandboxes</Label>
        <span className="font-mono text-body-sm text-fg-muted">{value[0]}</span>
      </div>
      <Slider value={value} onValueChange={setValue} min={1} max={50} aria-label="Concurrent sandboxes" />
    </div>
  );
}

export function Range() {
  const [value, setValue] = React.useState([4, 16]);
  return (
    <div className="grid w-full max-w-sm gap-3">
      <div className="flex items-center justify-between">
        <Label>Sandbox memory</Label>
        <span className="font-mono text-body-sm text-fg-muted">
          {value[0]} to {value[1]} GiB
        </span>
      </div>
      <Slider value={value} onValueChange={setValue} min={2} max={32} step={2} />
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-sm gap-8">
      <Slider defaultValue={[30]} aria-label="Enabled" />
      <Slider defaultValue={[60]} disabled aria-label="Disabled" />
      <div className="h-40">
        <Slider defaultValue={[40]} orientation="vertical" aria-label="Vertical" />
      </div>
    </div>
  );
}
