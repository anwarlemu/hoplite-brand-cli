import type { ComponentType } from "react";

import { Surface } from "@/lib/surface";
import { cn } from "@/lib/utils";

/** The panel an example sits in: a Kode Mono label over a canvas framed by the site's corner ticks. */
export function PreviewPanel({ label, actions, children }: { label: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <figure className="m-0 grid min-w-0 gap-3">
      <div className="flex min-h-10 items-center justify-between gap-3">
        <figcaption className="ds-label">{label}</figcaption>
        {actions}
      </div>
      <div className="ds-corners overflow-hidden">{children}</div>
    </figure>
  );
}

// An example rendered in place, centered on the canvas.
export function Preview({ example: Example, label }: { example: ComponentType; label: string }) {
  return (
    <PreviewPanel label={label}>
      <Surface className={cn("relative flex min-h-56 items-center justify-center bg-transparent p-6 sm:p-12")}>
        <div className="w-full max-w-full">
          <Example />
        </div>
      </Surface>
    </PreviewPanel>
  );
}
