import Link from "next/link";

import { PageBody, PageHead } from "@www/components/chrome";
import { items } from "@www/lib/registry";

export const metadata = { title: "Components" };

export default function ComponentsPage() {
  return (
    <>
      <PageHead title="Components" description={`${items.length} components, each with its examples, usage rules and source.`} />
      <PageBody>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] border-t border-l border-line">
          {items.map((i) => (
            <li key={i.name} className="border-r border-b border-line">
              <Link href={`/components/${i.name}`} className="grid h-full content-start gap-2 p-6 transition-colors duration-base ease-out hover:bg-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none">
                <span className="font-display text-h5 leading-snug font-light text-fg">{i.title}</span>
                <span className="text-body-sm leading-line-body-sm text-fg-muted">{i.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </PageBody>
    </>
  );
}
