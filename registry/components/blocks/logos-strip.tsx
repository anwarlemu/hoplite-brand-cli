import * as React from "react";

import { cn } from "@/lib/utils";

// The home page's customer strip (USED BY BUILDERS AT): a mono label centered between two hairlines, then the names in
// equal columns split by dashed rules, over a dashed rule. Names are placeholders: pass each customer's own logo as
// `mark` only with their permission. Without one, the name is set in Chakra Petch beside an outlined hexagon.
export type LogoEntry = { name: string; mark?: React.ReactNode };

const ACME: LogoEntry[] = [{ name: "Acme" }, { name: "Acme Labs" }, { name: "Acme Cloud" }, { name: "Acme Systems" }];

function LogosStrip({ label = "Used by builders at", logos = ACME, className }: { label?: string; logos?: LogoEntry[]; className?: string }) {
  return (
    <section data-slot="logos-strip" aria-label={label} className={cn("w-full", className)}>
      <p className="ds-label m-0 border-y border-line py-2 text-center">{label}</p>
      <ul className="ds-rule-x m-0 grid list-none grid-cols-2 p-0 md:grid-cols-4">
        {logos.map((l, i) => (
          <li key={l.name} className="relative flex h-20 items-center justify-center gap-2 text-fg md:h-24">
            {i % 2 === 1 && <span aria-hidden className="ds-rule-y absolute inset-y-0 left-0 w-px" />}
            {i % 4 === 2 && <span aria-hidden className="ds-rule-y absolute inset-y-0 left-0 hidden w-px md:block" />}
            {i >= 2 && <span aria-hidden className="ds-rule-x absolute inset-x-0 top-0 h-px md:hidden" />}
            {l.mark ?? (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className="size-5 fill-none stroke-fg">
                  <path d="M22 12L17 20.66L7 20.66L2 12L7 3.34L17 3.34Z" strokeWidth={1.5} />
                </svg>
                <span className="font-display text-h5 leading-7 font-normal">{l.name}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export { LogosStrip };
