"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A value to copy, in the code block's frame: a 48px box of the quiet line, the value in Kode Mono at 14px 20px in, and
 * a Copy action ruled off at the right that reads Copied for two seconds.
 */
export function CopyText({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    // ds-latency: resets completed clipboard feedback; copying and press feedback are already immediate.
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <div className={cn("flex h-12 w-full min-w-0 items-stretch border border-line", className)}>
      <code className="flex min-w-0 flex-1 items-center truncate pl-5 font-code text-body-sm leading-line-body-sm tracking-code text-code-text">
        <span className="truncate">{value}</span>
      </code>
      <button
        type="button"
        aria-label={copied ? "Copied" : label}
        onClick={() => navigator.clipboard.writeText(value).then(() => setCopied(true), () => undefined)}
        className="grid shrink-0 cursor-pointer place-items-center border-l border-line px-5 text-body-sm font-medium text-fg-muted transition-colors duration-base ease-out hover:text-fg active:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none"
      >
        <span className={cn("col-start-1 row-start-1", copied && "invisible")}>Copy</span>
        <span aria-hidden className={cn("col-start-1 row-start-1", !copied && "invisible")}>Copied</span>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}
