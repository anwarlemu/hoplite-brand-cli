import { readFileSync } from "node:fs";
import path from "node:path";

import { Code, PageBody, PageHead, Section } from "@www/components/chrome";
import { examples, Gallery } from "@www/components/gallery";

export const metadata = { title: "Illustrations", description: "The brand's line drawings as code: the globe, its dome, the cube, the cog node and the loader." };

const BIN = "npx hoplite-ds";
// The rules, with their sources, from brand/illustration.md.
const md = readFileSync(path.join(process.cwd(), "../../brand/illustration.md"), "utf8");
const rules = [...md.matchAll(/^\d+\.\s+([\s\S]*?)(?=\n\d+\.\s|\n\n)/gm)].map((m) => m[1]!.replace(/\s+/g, " ").trim());

export default function IllustrationsPage() {
  return (
    <>
      <PageHead eyebrow="Illustrations" title="Drawn like a survey" description="Thin dotted, dashed and solid lines on the ground, and a few orange cog nodes marking points. Every drawing comes from a seed, so the same seed redraws the same picture." />
      <PageBody className="max-w-300">
        <Code title="terminal" lang="sh" code={`${BIN} illustrate globe --palette night --seed 12\n${BIN} illustrate cube --palette transparent --size 800x800\n${BIN} illustrate --image photo.jpg --shade 40\n${BIN} illustrate --list`} />
        <Section title="Subjects" description="SVG keeps every line a vector path (a dashed line is one path with its dash pattern), so it opens editable in Figma. PNG is drawn at 2x.">
          <Gallery items={examples.illustrate} columns="sm:grid-cols-2 lg:grid-cols-3" bin={BIN} />
        </Section>
        <Section title="Rules" description="Each names its source: the brand social tool, the website's stylesheets or the brand principles.">
          <ol className="grid list-none gap-4 p-0">
            {rules.map((r, i) => (
              <li key={i} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-line pt-4 text-body-sm leading-line-body-sm text-fg-secondary">
                <span className="font-mono text-caption tracking-code text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </Section>
      </PageBody>
    </>
  );
}
