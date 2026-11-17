"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("Sandbox paused", {
            description: "sbx-7f3a keeps its files for seven days.",
            action: { label: "Resume", onClick: () => toast.success("Sandbox resumed") },
          })
        }
      >
        Pause sandbox
      </Button>
    </div>
  );
}

export function Types() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toaster />
      <Button variant="outline" onClick={() => toast.success("Pull request merged", { description: "Fix the null check in billing is on main." })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Check failed", { description: "npm test exited with code 1 on sbx-91c2." })}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning("2 seats left", { description: "Add seats before inviting more people." })}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info("Automation scheduled", { description: "Sentry triage runs every night at 2:00." })}>
        Info
      </Button>
    </div>
  );
}

export function Promise() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            // ds-latency: demonstrates a pending notification; no control or input waits for the demo timer.
            new globalThis.Promise((resolve) => setTimeout(resolve, 1600)),
            { loading: "Starting the agent...", success: "The agent is running in sbx-04de", error: "Could not start the agent" },
          )
        }
      >
        Start agent
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Delete this automation?", {
            description: "Its runs and logs are removed too.",
            cancel: { label: "Cancel", onClick: () => undefined },
            action: { label: "Delete", onClick: () => toast("Automation deleted") },
          })
        }
      >
        With cancel
      </Button>
    </div>
  );
}
