import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const RUNS = Array.from({ length: 24 }, (_, i) => ({
  name: ["Fix flaky checkout test", "Bump the Node image", "Triage Sentry issue", "Refactor the billing hook"][i % 4],
  when: `${(i * 7) % 59 + 1} min ago`,
}));

export function Preview() {
  return (
    <ScrollArea className="h-72 w-full max-w-80 border border-line">
      <div className="px-4 pt-4 pb-2">
        <p className="ds-label m-0 pb-3">Agent runs</p>
        <ul className="m-0 list-none border-t border-line p-0">
          {RUNS.map((run, i) => (
            <li key={i} className="flex items-baseline justify-between gap-4 border-b border-line py-2 text-body-sm leading-line-body-sm">
              <span className="truncate text-fg-secondary">{run.name}</span>
              <span className="shrink-0 text-fg-muted">{run.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
}

export function Horizontal() {
  return (
    <ScrollArea orientation="horizontal" className="w-full max-w-96 border border-line">
      <div className="flex w-max gap-2 p-4">
        {["main", "fix/null-check", "feat/automations", "chore/node-22", "feat/seats", "fix/flaky-test", "docs/quickstart"].map((branch) => (
          <span key={branch} className="flex h-8 items-center border border-line-field px-3 font-code text-body-sm text-fg">
            {branch}
          </span>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function Prose() {
  return (
    <ScrollArea className="h-48 w-full max-w-md border border-line">
      <div className="grid gap-4 p-5 text-body-sm leading-line-body-sm text-fg-secondary">
        <p className="m-0">Every agent runs in its own sandbox: a fresh container with the repository checked out, its dependencies installed, and nothing shared with the agent beside it.</p>
        <p className="m-0">When a run finishes, the sandbox keeps its logs and its diff for seven days, so a reviewer can open the exact state the agent left behind.</p>
        <p className="m-0">Automations start runs on a schedule or on an event, such as a new Sentry issue or a failing check on main, and open a pull request when the fix passes.</p>
        <p className="m-0">Seats are billed per person, not per agent. Run as many agents as the plan's concurrency allows.</p>
      </div>
    </ScrollArea>
  );
}
