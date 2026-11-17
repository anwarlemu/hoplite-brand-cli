"use client";

import * as React from "react";
import { PlusIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

type Run = { id: string; thread: string; repo: string; agent: string; status: string; minutes: number; started: Date };

const AGENTS = ["Claude Code", "Codex", "Amp", "Gemini CLI"];
const REPOS = ["acme/api", "acme/web", "acme/storefront", "acme/infra"];
const STATUS = ["Ready for review", "Running", "Merged", "Needs input", "Failed"];
const TASKS = ["Fix flaky checkout test", "Migrate auth to sessions", "Bump Next to 16.1", "Add rate limits to webhooks", "Cache search results", "Split the billing service", "Upgrade Postgres driver", "Remove the legacy cron", "Add audit log export", "Tighten CSP headers", "Speed up cold starts", "Retry failed webhooks", "Port tests to Vitest", "Document the CLI flags"];

const RUNS: Run[] = TASKS.map((thread, i) => ({
  id: `run-${1040 + i}`,
  thread,
  repo: REPOS[i % REPOS.length],
  agent: AGENTS[(i * 3) % AGENTS.length],
  status: STATUS[(i * 7) % STATUS.length],
  minutes: 4 + ((i * 13) % 47),
  started: new Date(2026, 10, 17, 9 + (i % 8), (i * 11) % 60),
}));

const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

const COLUMNS: DataTableColumn<Run>[] = [
  { id: "thread", header: "Thread", accessor: (r) => r.thread, sortable: true, hideable: false, className: "font-medium" },
  { id: "repo", header: "Repository", accessor: (r) => r.repo, sortable: true, cell: (r) => <span className="font-code text-fg-secondary">{r.repo}</span> },
  { id: "agent", header: "Agent", accessor: (r) => r.agent, sortable: true },
  { id: "status", header: "Status", accessor: (r) => r.status, cell: (r) => <span className={r.status === "Failed" ? "text-danger" : "text-fg-secondary"}>{r.status}</span> },
  { id: "minutes", header: "Minutes", accessor: (r) => r.minutes, sortable: true, align: "end", cell: (r) => <span className="tabular-nums">{r.minutes}</span> },
  { id: "started", header: "Started", accessor: (r) => r.started, sortable: true, align: "end", hidden: true, cell: (r) => <span className="text-fg-muted tabular-nums">{time.format(r.started)}</span> },
];

export function Preview() {
  return (
    <div className="w-full min-w-0">
      <DataTable columns={COLUMNS} data={RUNS} getRowId={(r) => r.id} pageSize={5} pageSizes={[5, 10, 20]} filter={{ placeholder: "Filter runs" }} defaultSort={{ id: "minutes", desc: true }} rowName="run" />
    </div>
  );
}

export function Selectable() {
  const [selection, setSelection] = React.useState<string[]>(["run-1041"]);
  return (
    <div className="w-full min-w-0">
      <DataTable
        columns={COLUMNS}
        data={RUNS}
        getRowId={(r) => r.id}
        selectable
        selection={selection}
        onSelectionChange={setSelection}
        pageSize={5}
        rowName="run"
        filter={{ placeholder: "Filter runs" }}
        toolbar={
          <Button size="sm" variant="secondary" disabled={!selection.length}>
            Rerun {selection.length || ""}
          </Button>
        }
      />
    </div>
  );
}

export function Empty() {
  return (
    <div className="w-full min-w-0">
      <DataTable
        columns={COLUMNS}
        data={[]}
        getRowId={(r) => r.id}
        hideViewOptions
        empty={
          <span className="grid justify-items-center gap-3">
            No runs yet. Start a thread and its runs land here.
            <Button size="sm" variant="outline">
              <PlusIcon />
              New thread
            </Button>
          </span>
        }
      />
    </div>
  );
}
