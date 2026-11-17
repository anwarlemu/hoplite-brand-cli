"use client";

import * as React from "react";
import { DesktopIcon, DeviceMobileIcon, TextBIcon, TextItalicIcon, TextUnderlineIcon } from "@phosphor-icons/react/ssr";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Preview() {
  const [period, setPeriod] = React.useState("monthly");
  return (
    <ToggleGroup value={period} onValueChange={(value) => value && setPeriod(value)} aria-label="Billing period">
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
      <ToggleGroupItem value="yearly">Yearly, save 17%</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function Outline() {
  return (
    <ToggleGroup variant="outline" type="multiple" defaultValue={["features", "fixes"]} aria-label="Show">
      <ToggleGroupItem value="features">Features</ToggleGroupItem>
      <ToggleGroupItem value="fixes">Fixes</ToggleGroupItem>
      <ToggleGroupItem value="agents">Agents</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function Icons() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ToggleGroup defaultValue="desktop" aria-label="Preview">
        <ToggleGroupItem value="desktop" aria-label="Desktop">
          <DesktopIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="phone" aria-label="Phone">
          <DeviceMobileIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline" type="multiple" defaultValue={["bold"]} aria-label="Formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <TextBIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <TextItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <TextUnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export function States() {
  return (
    <div className="grid gap-4">
      <ToggleGroup defaultValue="all" disabled aria-label="Disabled">
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="open">Open</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup variant="outline" size="lg" defaultValue="week" aria-label="Range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
