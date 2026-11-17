"use client";

import * as React from "react";
import { CloudIcon, CpuIcon, DesktopTowerIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";

const MODELS = [
  { value: "auto", label: "Auto" },
  { value: "opus", label: "Claude Opus" },
  { value: "sonnet", label: "Claude Sonnet" },
  { value: "gpt", label: "GPT-5 Codex" },
];

export function Preview() {
  const [saved, setSaved] = React.useState<string>();
  return (
    <form
      className="grid w-full max-w-sm gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("model")));
      }}
    >
      <label id="model-label" className="text-body-sm font-medium text-fg">
        Default model
      </label>
      <Select name="model" items={MODELS} defaultValue="auto">
        <SelectTrigger aria-labelledby="model-label">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-body-sm text-fg-muted">New threads start on this model.</p>
      <div className="mt-2 flex items-center gap-4">
        <Button type="submit">Save</Button>
        <p aria-live="polite" className="text-body-sm text-fg-muted">
          {saved ? `Saved: ${saved}` : ""}
        </p>
      </div>
    </form>
  );
}

export function Grouped() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label id="sandbox-label" className="text-body-sm font-medium text-fg">
        Sandbox size
      </label>
      <Select defaultValue={null}>
        <SelectTrigger aria-labelledby="sandbox-label">
          <SelectValue placeholder="Choose a size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cloud</SelectLabel>
            <SelectItem value="s">
              <CloudIcon /> 2 vCPU, 8 GiB
            </SelectItem>
            <SelectItem value="m">
              <CloudIcon /> 8 vCPU, 32 GiB
            </SelectItem>
            <SelectItem value="l" disabled>
              <CpuIcon /> 16 vCPU, 64 GiB (Team)
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Local</SelectLabel>
            <SelectItem value="local">
              <DesktopTowerIcon /> This Mac
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Select defaultValue="main">
        <SelectTrigger size="sm" aria-label="Base branch" className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main">main</SelectItem>
          <SelectItem value="develop">develop</SelectItem>
          <SelectItem value="release">release/1.4</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={null}>
        <SelectTrigger aria-label="Reviewer" aria-invalid>
          <SelectValue placeholder="Choose a reviewer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="maya">Maya</SelectItem>
          <SelectItem value="lead">Platform lead</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="weekly" disabled>
        <SelectTrigger aria-label="Report">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Weekly usage report</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
