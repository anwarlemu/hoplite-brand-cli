"use client";

import * as React from "react";

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";

export function Preview() {
  return <Progress value={62} aria-label="Monthly usage" className="max-w-sm" />;
}

export function WithLabel() {
  return (
    <div className="grid max-w-sm gap-6">
      <Progress value={84}>
        <ProgressLabel>Usage this month</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={96} variant="accent">
        <ProgressLabel>Sandbox hours</ProgressLabel>
        <ProgressValue>{(formatted) => `${formatted} of 400 h`}</ProgressValue>
      </Progress>
    </div>
  );
}

export function Live() {
  const [value, setValue] = React.useState(12);
  React.useEffect(() => {
    // ds-latency: the demo advances a simulated clone; nothing waits on it.
    const id = window.setInterval(() => setValue((current) => (current >= 100 ? 12 : Math.min(100, current + 11))), 900);
    return () => window.clearInterval(id);
  }, []);
  return (
    <Progress value={value} className="max-w-sm">
      <ProgressLabel>Cloning acme/storefront</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

export function Indeterminate() {
  return (
    <Progress value={null} className="max-w-sm">
      <ProgressLabel>Waiting for a sandbox</ProgressLabel>
    </Progress>
  );
}
