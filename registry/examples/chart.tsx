"use client";

import { AreaChart, BarChart, type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, LineChart, PieChart } from "@/components/ui/chart";

const THREADS = [
  { week: "Oct 6", merged: 42, opened: 58 },
  { week: "Oct 13", merged: 51, opened: 63 },
  { week: "Oct 20", merged: 47, opened: 55 },
  { week: "Oct 27", merged: 66, opened: 72 },
  { week: "Nov 3", merged: 71, opened: 80 },
  { week: "Nov 10", merged: 84, opened: 91 },
];

const config = {
  opened: { label: "Threads opened" },
  merged: { label: "Pull requests merged" },
} satisfies ChartConfig;

export function Preview() {
  return (
    <ChartContainer config={config} className="aspect-auto h-80 w-full max-w-180">
      <BarChart data={THREADS} index="week" showYAxis aria-label="Threads opened and pull requests merged per week" />
      <ChartTooltip content={<ChartTooltipContent />} />
      <ChartLegend content={<ChartLegendContent />} />
    </ChartContainer>
  );
}

const MINUTES = [
  { day: "Mon", minutes: 312 },
  { day: "Tue", minutes: 428 },
  { day: "Wed", minutes: 391 },
  { day: "Thu", minutes: 506 },
  { day: "Fri", minutes: 472 },
  { day: "Sat", minutes: 118 },
  { day: "Sun", minutes: 96 },
];

const minutesConfig = { minutes: { label: "Sandbox minutes" } } satisfies ChartConfig;

export function Line() {
  return (
    <ChartContainer config={minutesConfig} className="aspect-auto h-72 w-full max-w-180">
      <LineChart data={MINUTES} index="day" showYAxis dots aria-label="Sandbox minutes per day this week" />
      <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
    </ChartContainer>
  );
}

export function Area() {
  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full max-w-180">
      <AreaChart data={THREADS} index="week" stacked aria-label="Threads opened and merged per week, stacked" />
      <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
      <ChartLegend content={<ChartLegendContent />} />
    </ChartContainer>
  );
}

const AGENTS = [
  { agent: "claude", runs: 1240 },
  { agent: "codex", runs: 610 },
  { agent: "amp", runs: 320 },
  { agent: "other", runs: 140 },
];

const agentConfig = {
  claude: { label: "Claude Code" },
  codex: { label: "Codex" },
  amp: { label: "Amp" },
  other: { label: "Other agents" },
} satisfies ChartConfig;

export function Pie() {
  return (
    <ChartContainer config={agentConfig} className="aspect-auto h-72 w-full max-w-96">
      <PieChart data={AGENTS} index="agent" value="runs" aria-label="Runs by agent this month" />
      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
      <ChartLegend content={<ChartLegendContent />} />
    </ChartContainer>
  );
}
