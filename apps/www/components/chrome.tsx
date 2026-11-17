import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import { CopyText } from "@www/components/copy-text";

/**
 * A page's head, as the site opens a page (.pg-hero): a Kode Mono label, the title in Chakra Petch light at 44px, a
 * light 18px lead in graphite, and a quiet rule across the page under it. Actions sit at the right.
 */
export function PageHead({ title, description, eyebrow, children }: { title: React.ReactNode; description?: React.ReactNode; eyebrow?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="border-b border-line px-4 pt-12 pb-10 sm:px-8 lg:pt-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 max-w-180">
          {eyebrow && <p className="ds-label mb-4">{eyebrow}</p>}
          <h1 className="font-display text-h3 leading-snug font-light tracking-tight text-fg sm:text-h2 sm:leading-heading">{title}</h1>
          {description && <p className="mt-4 text-body leading-body font-light text-fg-secondary sm:text-body-lg sm:leading-relaxed">{description}</p>}
        </div>
        {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}

/** The page's body, 32px in. */
export function PageBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid gap-16 px-4 py-10 sm:px-8", className)}>{children}</div>;
}

/** A titled block of a page: a 24px Chakra Petch title over its content. */
export function Section({ id, title, description, children }: { id?: string; title: string; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="grid min-w-0 scroll-mt-8 gap-4">
      <div className="grid gap-2">
        <h2 className="font-display text-h4 leading-title font-light text-fg">{title}</h2>
        {description && <p className="max-w-150 text-body-sm leading-line-body-sm text-fg-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** A shell command in a copy box. */
export function Command({ command, className }: { command: string; className?: string }) {
  return <CopyText value={command} label="Copy command" className={className} />;
}

/** Code in the blog's code block, with its file name in the bar. */
export function Code({ code, title, lang = "tsx", tall = false, className }: { code: string; title?: string; lang?: string; tall?: boolean; className?: string }) {
  const text = code.trim();
  return (
    <CodeBlock className={className}>
      <CodeBlockHeader>
        <CodeBlockTitle language={lang}>{title ?? lang}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={text} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent code={text} language={lang} className={tall ? "max-h-140" : "max-h-96"} />
    </CodeBlock>
  );
}
