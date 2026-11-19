import { Code, PageBody, PageHead, Section } from "@www/components/chrome";
import { CommandList } from "@www/components/gallery";

export const metadata = { title: "Figma", description: "Brand tokens as Figma variables, assets pushed into Figma, frames pulled back as tokens, and checks for off-brand values." };

const BIN = "npx hoplite-ds";

const ACTIONS: [string, string][] = [
  ["figma tokens", "Writes tokens.json and use_figma scripts that create the variables: one collection with Light and Dark modes (one collection per mode on a one-mode plan), scoped and linked to their CSS names, and the shadows as effect styles. Safe to rerun."],
  ["figma push illustration <subject>", "The drawing as SVG and PNG, with a script that imports it as editable vector layers when it fits, else an upload_assets step."],
  ["figma push image | slide <file>", "Any image, slide or SVG the CLI wrote, cleaned for import, with the upload_assets step (small SVGs also as a script)."],
  ["figma push component <name>", "A library component's preview as self-contained HTML for html_to_figma."],
  ["figma push page <url | file>", "A page as rendered, stylesheets and pictures inlined, for html_to_figma."],
  ["figma pull <url> [saved files]", "The read steps for a frame and where to save each result; given the saved results, every value the frame uses mapped to its token and Tailwind class."],
  ["figma check <saved files>", "Every color, font, size, radius and spacing that is not a brand token, with the nearest token. Exits 1 when there are any."],
];

export default function FigmaPage() {
  return (
    <>
      <PageHead eyebrow="Figma" title="Work in Figma through its tools" description="The CLI never calls Figma. Each action writes files and prints, in order, the Figma MCP tool calls an agent makes with them." />
      <PageBody className="max-w-240">
        <Code title="terminal" lang="sh" code={`${BIN} figma tokens --out figma\n${BIN} figma push illustration globe --file <fileKey>\n${BIN} figma pull "https://figma.com/design/<fileKey>/x?node-id=1-2"\n${BIN} figma check figma/variables-1-2.json figma/design-1-2.txt`} />
        <Section title="Actions" description="Every action takes --out (default ./figma), --file for an existing file key, and --json.">
          <CommandList rows={ACTIONS} />
        </Section>
        <Section title="Order of calls" description="What every printed plan starts with.">
          <ol className="grid list-none gap-3 p-0 text-body-sm leading-line-body-sm text-fg-secondary">
            <li className="border-t border-line pt-3">create_session with the file key, before any other file tool; pass its sessionId on every later call.</li>
            <li className="border-t border-line pt-3">Load the figma-use skill before the first use_figma call, then run the written scripts in order.</li>
            <li className="border-t border-line pt-3">One get_screenshot of the result to confirm it; stop when it matches.</li>
          </ol>
        </Section>
      </PageBody>
    </>
  );
}
