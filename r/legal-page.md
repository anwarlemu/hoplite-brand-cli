# Legal page
The legal template: title and date over a solid rule, a numbered contents list, and the sections as prose.

Install: npx hoplite-ds add legal-page
Requires: theme, footer, site-header, typography, utils
Packages: none
Exports: LegalSection, LegalPage
Client boundary: not required by this entry file
Reference: The Hoplite website's blog prose (.bp-prose) and rules; the site's legal pages were not captured


## Usage
Use for terms, privacy and security pages. The copy is sample text: replace it with your own.
- Avoid: Copy from real people or third parties
- Avoid: Sections reordered so two closing bands meet
- Avoid: Values outside the brand tokens
Built only from the section blocks and library items; every part takes its copy through props.

## Examples
Example components: npx hoplite-ds add legal-page
[Preview](https://hoplite-ds.vercel.app/preview/legal-page/Preview)

examples/legal-page.tsx

```tsx
import { LegalPage } from "@/components/blocks/legal-page";

export function Preview() {
  return <LegalPage />;
}

```

## Source

components/blocks/legal-page.tsx

```tsx
import * as React from "react";

import { Footer } from "@/components/blocks/footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { TypographyH1, TypographyProse } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

const SECTIONS: LegalSection[] = [
  { id: "agreement", title: "The agreement", body: <p>These terms govern your use of the service. By creating a workspace you accept them on behalf of yourself or your organization. This is sample text: replace it with your own terms.</p> },
  { id: "accounts", title: "Accounts and seats", body: <p>Each seat belongs to one person. You are responsible for the activity in your workspace, including the work agents do on your behalf.</p> },
  { id: "code", title: "Your code", body: <p>Your repositories and the changes agents make to them remain yours. Sandboxes are isolated per run and deleted when the run ends.</p> },
  { id: "billing", title: "Billing", body: <p>Paid plans renew each period until cancelled. Usage beyond what a plan includes draws on prepaid credits.</p> },
  { id: "changes", title: "Changes to these terms", body: <p>We will tell you about material changes before they take effect.</p> },
];

// A legal page (terms, privacy): the Chakra Petch title with its mono date over a solid rule, a contents list in the left
// column on hairline rows, and the sections set as prose (18px on a 32px line) in the right.
function LegalPage({ title = "Terms of service", updated = "Last updated Nov 1, 2026", sections = SECTIONS, className }: { title?: string; updated?: string; sections?: LegalSection[]; className?: string }) {
  return (
    <div data-slot="legal-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main className="mx-auto w-full max-w-320 pb-20">
        <header className="grid gap-4 border-b border-line-strong pt-20 pb-12 sm:pt-32">
          <p className="ds-label m-0">{updated}</p>
          <TypographyH1>{title}</TypographyH1>
        </header>
        <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-16">
          <nav aria-label="Contents" className="grid content-start gap-3">
            <p className="ds-label m-0">Contents</p>
            <ol className="m-0 grid list-none border-t border-line p-0">
              {sections.map((s, i) => (
                <li key={s.id} className="border-b border-line">
                  <a href={`#${s.id}`} className="flex gap-3 py-2 text-body-sm leading-line-body-sm text-fg-secondary transition-colors duration-base ease-out hover:text-fg motion-reduce:transition-none">
                    <span className="font-code text-fg-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <TypographyProse className="max-w-180 [&>h2:first-child]:mt-0">
            {sections.map((s) => (
              <React.Fragment key={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                {s.body}
              </React.Fragment>
            ))}
          </TypographyProse>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export { LegalPage };

```
