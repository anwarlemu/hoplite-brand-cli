import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";

import { Code, Command, PageBody, PageHead, Section } from "@www/components/chrome";
import { FramePreview } from "@www/components/frame-preview";
import { Preview } from "@www/components/preview";
import { InlineCode, Prose } from "@www/components/prose";
import { examples } from "@www/lib/examples.generated";
import { CLI_COMMAND, type Item, exampleSource, findItem, items, needsPreviewFrame, sourceOf } from "@www/lib/registry";

export function generateStaticParams() {
  return items.map((i) => ({ name: i.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const item = findItem((await params).name);
  return item ? { title: item.title, description: item.description, alternates: { canonical: `/components/${item.name}`, types: { "text/markdown": `/r/${item.name}.md`, "application/json": `/r/${item.name}.json` } } } : {};
}

function exampleLabel(name: string) {
  const words = name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const item = findItem((await params).name);
  if (!item) notFound();
  // The main example first, then its states in their own order.
  const all = examples[item.name] ?? {};
  const demos = item.examples.filter((name) => all[name]).map((name) => [name, all[name]] as const);
  const framed = needsPreviewFrame(item);
  const at = items.findIndex((i) => i.name === item.name);
  const prev = at > 0 ? items[at - 1] : undefined;
  const next = at < items.length - 1 ? items[at + 1] : undefined;
  return (
    <>
      <PageHead eyebrow="Component" title={item.title} description={<Prose text={item.description} />}>
        <a href={`/r/${item.name}.md`} className="ds-link"><span>Text reference</span></a>
      </PageHead>
      <PageBody className="max-w-240">
        <Command command={`${CLI_COMMAND} add ${item.name}`} />

        {demos.length > 0 && (
          <div id="preview" className="grid scroll-mt-8 gap-10">
            {demos.map(([name, Demo]) => (framed ? <FramePreview key={name} src={`/preview/${item.name}/${name}`} label={exampleLabel(name)} /> : <Preview key={name} example={Demo} label={exampleLabel(name)} />))}
          </div>
        )}

        <Usage item={item} />

        {item.examples.length > 0 && (
          <Section id="example" title="Example">
            <Code title={`examples/${item.name}.tsx`} code={exampleSource(item.name)} />
          </Section>
        )}

        <Section id="source" title="Source">
          <div className="grid gap-5">
            {item.paths.map((p) => (
              <Code key={p} title={p} code={sourceOf(p)} tall />
            ))}
          </div>
          {item.source && <p className="text-body-sm leading-line-body-sm text-fg-muted">Reference: {item.source}.</p>}
        </Section>

        <nav aria-label="More components" className="flex items-center justify-between gap-3 border-t border-line pt-8">
          {prev ? (
            <Link href={`/components/${prev.name}`} className="inline-flex items-center gap-2 py-2 text-body-sm font-medium text-fg-muted transition-colors duration-base ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none">
              <CaretLeftIcon className="size-4" /> {prev.title}
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/components/${next.name}`} className="inline-flex items-center gap-2 py-2 text-body-sm font-medium text-fg-muted transition-colors duration-base ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none">
              {next.title} <CaretRightIcon className="size-4" />
            </Link>
          )}
        </nav>
      </PageBody>
    </>
  );
}

function Usage({ item }: { item: Item }) {
  const requires = item.dependencies.filter((d) => d !== "utils");
  return (
    <Section id="usage" title="Usage">
      <div className="grid gap-6 border-t border-line pt-6">
        <p className="max-w-180 text-body leading-body font-light text-fg-secondary">
          <Prose text={item.use_for} />
        </p>
        {item.never.length > 0 && (
          <div>
            <p className="ds-label mb-3">Avoid</p>
            <ul className="grid gap-2 text-body-sm leading-line-body-sm text-fg-secondary">
              {item.never.map((n) => (
                <li key={n} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-danger" />
                  <Prose text={n} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="text-body-sm leading-line-body-sm text-fg-muted">
        Exports: <InlineCode>{item.exports.join(", ")}</InlineCode>. {item.client ? "This component is a client component." : "Read the examples for composition and props."}
      </p>
      {item.body && (
        <div className="text-body leading-body font-light text-fg-secondary">
          <Prose text={item.body} />
        </div>
      )}
      {(requires.length > 0 || item.npm.length > 0) && (
        <p className="text-body-sm leading-line-body-sm text-fg-muted">
          Dependencies:{" "}
          {requires.map((d, i) => (
            <span key={d}>
              {findItem(d) ? <Link href={`/components/${d}`} className="text-fg underline decoration-line underline-offset-4 transition-[text-decoration-color] duration-base ease-out hover:decoration-current">{d}</Link> : <InlineCode>{d}</InlineCode>}
              {i < requires.length - 1 || item.npm.length ? ", " : ""}
            </span>
          ))}
          {item.npm.map((p, i) => (
            <span key={p}>
              <InlineCode>{p}</InlineCode>
              {i < item.npm.length - 1 ? ", " : ""}
            </span>
          ))}
          .
        </p>
      )}
    </Section>
  );
}
