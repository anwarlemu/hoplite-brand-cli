"use client";

import * as React from "react";
import { GitBranchIcon, RobotIcon } from "@phosphor-icons/react/ssr";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

const REPOS = ["acme/api", "acme/web", "acme/storefront", "acme/mobile", "acme/infra", "acme/docs", "acme/billing", "acme/search", "acme/design-system", "acme/data-pipeline"];

export function Preview() {
  const id = React.useId();
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-fg">
        Repository
      </label>
      <Combobox items={REPOS} defaultValue="acme/api">
        <ComboboxInput id={id} placeholder="Search repositories" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No repository by that name.</ComboboxEmpty>
          <ComboboxList>
            {(repo: string) => (
              <ComboboxItem key={repo} value={repo}>
                <GitBranchIcon />
                {repo}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

type Agent = { value: string; label: string };
const AGENTS: Agent[] = [
  { value: "claude", label: "Claude Code" },
  { value: "codex", label: "Codex" },
  { value: "amp", label: "Amp" },
  { value: "gemini", label: "Gemini CLI" },
  { value: "cursor", label: "Cursor agent" },
  { value: "opencode", label: "OpenCode" },
];

export function WithTrigger() {
  const [agent, setAgent] = React.useState<Agent | null>(AGENTS[0]);
  return (
    <div className="grid w-full max-w-sm gap-2">
      <span id="agent-label" className="text-body-sm font-medium text-fg">
        Agent for new threads
      </span>
      <Combobox items={AGENTS} value={agent} onValueChange={setAgent}>
        <ComboboxTrigger aria-labelledby="agent-label">
          <ComboboxValue placeholder="Choose an agent" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search agents" />
          <ComboboxEmpty>No agent with that name.</ComboboxEmpty>
          <ComboboxList>
            {(a: Agent) => (
              <ComboboxItem key={a.value} value={a}>
                <RobotIcon />
                {a.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

const CHECKS = ["typecheck", "lint", "unit tests", "e2e tests", "build", "preview deploy", "bundle size", "license scan"];

export function Multiple() {
  const id = React.useId();
  const anchor = useComboboxAnchor();
  return (
    <div className="grid w-full max-w-md gap-2">
      <label htmlFor={id} className="text-body-sm font-medium text-fg">
        Required checks
      </label>
      <Combobox items={CHECKS} multiple defaultValue={["typecheck", "unit tests"]}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((v) => (
                  <ComboboxChip key={v} aria-label={v}>
                    {v}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput id={id} placeholder={values.length ? "" : "Add checks"} />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No check by that name.</ComboboxEmpty>
          <ComboboxList>
            {(check: string) => (
              <ComboboxItem key={check} value={check}>
                {check}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <p className="text-body-sm text-fg-muted">A pull request merges once these pass.</p>
    </div>
  );
}

const GROUPS = [
  { value: "Branches", items: ["main", "develop", "release/1.4"] },
  { value: "Pull requests", items: ["PR 4820: Fix flaky checkout test", "PR 4791: Migrate auth to sessions", "PR 4710: Bump Next to 16.1"] },
];

export function Grouped() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Combobox items={GROUPS}>
        <ComboboxInput aria-label="Base for the sandbox" placeholder="Branch or pull request" />
        <ComboboxContent>
          <ComboboxEmpty>Nothing matches.</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof GROUPS)[number]) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
