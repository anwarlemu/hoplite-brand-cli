"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const AGENTS = [
  { name: "Fix flaky upload test", state: "Running checks" },
  { name: "Prorate seats on upgrade", state: "Waiting for review" },
  { name: "Bump the Node image", state: "Done" },
];

function Subagents({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Drawer defaultOpen={defaultOpen}>
      <DrawerTrigger render={<Button variant="outline" />}>Steer subagents</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader>
            <DrawerTitle>Running subagents</DrawerTitle>
            <DrawerDescription>Three agents are working in acme-web. Swipe down to close.</DrawerDescription>
          </DrawerHeader>
          <ul className="m-0 list-none px-6 py-0">
            {AGENTS.map((agent) => (
              <li key={agent.name} className="flex items-center justify-between gap-4 border-b border-line py-3 text-body-sm leading-line-body-sm first:border-t">
                <span className="text-fg">{agent.name}</span>
                <span className="shrink-0 text-fg-muted">{agent.state}</span>
              </li>
            ))}
          </ul>
          <DrawerFooter>
            <Button>Open threads</Button>
            <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function Preview() {
  return <Subagents />;
}

export function Open() {
  return (
    <div className="min-h-120">
      <Subagents defaultOpen />
    </div>
  );
}

export function Side() {
  return (
    <Drawer direction="right">
      <DrawerTrigger render={<Button variant="outline" />}>Open from the right</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Thread details</DrawerTitle>
          <DrawerDescription>Swipe right to close.</DrawerDescription>
        </DrawerHeader>
        <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 px-6 text-body-sm leading-line-body-sm">
          <dt className="text-fg-muted">Repository</dt>
          <dd className="m-0 text-fg">acme/web</dd>
          <dt className="text-fg-muted">Branch</dt>
          <dd className="m-0 text-fg">fix/upload-retry</dd>
          <dt className="text-fg-muted">Agent</dt>
          <dd className="m-0 text-fg">Claude Code</dd>
        </dl>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
