import { readFileSync } from "node:fs";
import path from "node:path";

export type Example = { id: string; command: string; src: string; width: number; height: number };
export type Examples = { image: Example[]; social: Example[]; deck: Example[]; merch: Example[]; illustrate: Example[]; video: Example[]; loopVideo?: string };

/** The gallery files, written by scripts/build-assets-docs.mjs, which runs the CLI itself. */
export const examples = JSON.parse(readFileSync(path.join(process.cwd(), "public", "assets-examples", "examples.json"), "utf8")) as Examples;

/** Generated files in square frames with corner ticks, each over the command that wrote it. */
export function Gallery({ items, columns, bin }: { items: Example[]; columns: string; bin: string }) {
  return (
    <ul className={`grid gap-6 ${columns}`}>
      {items.map((e) => (
        <li key={e.id} className="flex min-w-0 flex-col gap-3">
          <div className="ds-corners p-2">
            <img src={e.src} width={e.width} height={e.height} alt={`${e.id}, as the CLI draws it`} loading="lazy" className="block h-auto w-full bg-subtle" />
          </div>
          <code className="truncate font-mono text-caption tracking-code text-fg-muted" title={`${bin} ${e.command}`}>
            {e.command}
          </code>
        </li>
      ))}
    </ul>
  );
}

/** Command rows: the command in the mono, what it does beside it (under it on a phone). */
export function CommandList({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid divide-y divide-line">
      {rows.map(([cmd, what]) => (
        <div key={cmd} className="grid gap-2 py-5 sm:grid-cols-[18rem_1fr] sm:gap-6">
          <dt className="font-mono text-body-sm break-words text-fg">{cmd}</dt>
          <dd className="text-body-sm leading-line-body-sm text-fg-muted">{what}</dd>
        </div>
      ))}
    </dl>
  );
}
