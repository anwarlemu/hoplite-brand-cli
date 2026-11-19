import * as React from "react";

import { Lockup } from "@/components/site/brand-marks";
import { cn } from "@/lib/utils";

export type FooterColumn = { title: string; links: { label: string; href: string }[] };

const COLUMNS: FooterColumn[] = [
  { title: "Product", links: [{ label: "Overview", href: "#product" }, { label: "Automations", href: "#automations" }, { label: "Desktop app", href: "#desktop" }, { label: "Pricing", href: "#pricing" }] },
  { title: "Resources", links: [{ label: "Docs", href: "#docs" }, { label: "Blog", href: "#blog" }, { label: "Changelog", href: "#changelog" }, { label: "Status", href: "#status" }] },
  { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Careers", href: "#careers" }, { label: "Contact", href: "#contact" }] },
  { title: "Legal", links: [{ label: "Terms", href: "#terms" }, { label: "Privacy", href: "#privacy" }, { label: "Security", href: "#security" }] },
];

// The site's footer: a solid hairline above, the lockup and a light line at the left, the link columns under mono
// labels at the right, and a quiet row with the copyright under a dashed rule. Links are graphite and turn ink under
// the pointer (color only).
function Footer({ tagline = "A workstation for your army of coding agents.", columns = COLUMNS, copyright = "© 2026 Hoplite", className }: { tagline?: string; columns?: FooterColumn[]; copyright?: string; className?: string }) {
  return (
    <footer data-slot="footer" className={cn("w-full border-t border-line", className)}>
      <div className="mx-auto grid w-full max-w-320 gap-12 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="grid content-start gap-4">
            <Lockup />
            <p className="m-0 max-w-80 text-body-sm leading-line-body-sm font-light text-fg-secondary">{tagline}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((c) => (
              <div key={c.title} className="grid content-start gap-4">
                <p className="ds-label m-0">{c.title}</p>
                <ul className="m-0 grid list-none gap-2 p-0">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-body-sm leading-line-body-sm text-fg-secondary transition-colors duration-base ease-out outline-none hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="ds-label m-0 pt-6 [background:repeating-linear-gradient(90deg,var(--ds-color-border-default)_0_10px,transparent_0_18px)_left_top/100%_1px_no-repeat]">{copyright}</p>
      </div>
    </footer>
  );
}

export { Footer };
