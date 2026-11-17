"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Preview() {
  const [period, setPeriod] = React.useState("monthly");
  return (
    <Tabs value={period} onValueChange={setPeriod}>
      <TabsList aria-label="Billing period">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly, save 17%</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly" className="text-body-sm text-fg-secondary">
        $20 per seat, billed every month.
      </TabsContent>
      <TabsContent value="yearly" className="text-body-sm text-fg-secondary">
        $16.67 per seat a month, billed once a year.
      </TabsContent>
    </Tabs>
  );
}

export function Boxed() {
  return (
    <Tabs defaultValue="all">
      <TabsList variant="boxed" aria-label="Show">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="fixes">Fixes</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="text-body-sm text-fg-secondary">Everything shipped this month, newest first.</TabsContent>
      <TabsContent value="features" className="text-body-sm text-fg-secondary">New things you can do.</TabsContent>
      <TabsContent value="fixes" className="text-body-sm text-fg-secondary">Things that work better now.</TabsContent>
    </Tabs>
  );
}

export function FullWidth() {
  return (
    <Tabs defaultValue="claude" className="max-w-md">
      <TabsList full aria-label="Import from">
        <TabsTrigger value="claude">Claude Code</TabsTrigger>
        <TabsTrigger value="codex">Codex</TabsTrigger>
        <TabsTrigger value="cursor">Cursor</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
