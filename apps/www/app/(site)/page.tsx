import Link from "next/link";

import { Command, PageBody, PageHead, Section } from "@www/components/chrome";
import { CLI_COMMAND, INSTALL_COMMAND, items, registryName } from "@www/lib/registry";

export default function HomePage() {
  return (
    <>
      <PageHead title={`${registryName} design system`} description={`Every component, token and rule for building ${registryName} interfaces, drawn from the Hoplite website. ${items.length} components, each with examples and source.`} />
      <PageBody className="max-w-240">
        <Section title="Install the CLI" description="Run once from the project root. It adds the brand stylesheet, the fonts and the agent instructions.">
          <div className="grid gap-2">
            <Command command={INSTALL_COMMAND} />
            <Command command="npx hoplite-ds init" />
          </div>
        </Section>
        <Section title="Add components" description="Components need React 19.2 or later, Tailwind CSS 4 and project configuration. The CLI respects configured aliases and JavaScript or TypeScript output, copies source and installs dependencies.">
          <Command command={`${CLI_COMMAND} add button dialog field input`} />
        </Section>
        <Section title="Discover and preview" description="Read the project configuration and exact component APIs before installing. Preview diffs before replacing local changes.">
          <div className="grid gap-2">
            <Command command="npx hoplite-ds info --json" />
            <Command command="npx hoplite-ds search button --json" />
            <Command command="npx hoplite-ds view button --json" />
            <Command command="npx hoplite-ds add button --diff" />
          </div>
        </Section>
        <Section title="Use with shadcn and agents" description="Init configures the standard registry and installs portable Claude/Codex skills. Include the theme when using shadcn to update existing theme aliases. Advanced commands use pinned shadcn 4.22.1.">
          <div className="grid gap-2">
            <Command command="npx hoplite-ds shadcn add @hoplite-ds/theme @hoplite-ds/button" />
            <Command command="npx hoplite-ds mcp init --client claude" />
            <Command command="npx hoplite-ds create --template vite --name my-app" />
          </div>
        </Section>
        <Section title="Components" description="Every component in the library, in the website's style.">
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] border-t border-l border-line">
            {items.map((i) => (
              <li key={i.name} className="border-r border-b border-line">
                <Link href={`/components/${i.name}`} className="flex h-12 items-center px-4 text-body-sm text-fg-secondary transition-colors duration-base ease-out hover:bg-subtle hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none">
                  {i.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </PageBody>
    </>
  );
}
