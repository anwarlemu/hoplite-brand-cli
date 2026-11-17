import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

function Pane({ label, note }: { label: string; note: string }) {
  return (
    <div className="grid h-full content-start gap-2 p-5">
      <p className="ds-label m-0">{label}</p>
      <p className="m-0 text-body-sm leading-line-body-sm text-fg-secondary">{note}</p>
    </div>
  );
}

export function Preview() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-64 max-w-2xl border border-line">
      <ResizablePanel defaultSize={60} minSize={30}>
        <Pane label="Thread" note="The agent reproduced the failure with a test and is writing the fix." />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40} minSize={25}>
        <Pane label="Checks" note="3 of 4 checks passed. Lint is still running." />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function Vertical() {
  return (
    <ResizablePanelGroup direction="vertical" className="min-h-72 max-w-md border border-line">
      <ResizablePanel defaultSize={55} minSize={25}>
        <Pane label="Diff" note="billing/charge.ts: 4 lines added, 1 removed." />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45} minSize={20}>
        <Pane label="Terminal" note="npm test passed in 41 seconds." />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function Nested() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-72 max-w-2xl border border-line">
      <ResizablePanel defaultSize={30} minSize={20}>
        <Pane label="Sandboxes" note="sbx-7f3a, sbx-91c2 and sbx-04de are running." />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50} minSize={20}>
            <Pane label="Preview" note="The checkout page on port 3000." />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <Pane label="Logs" note="Compiled in 1.2 seconds." />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
