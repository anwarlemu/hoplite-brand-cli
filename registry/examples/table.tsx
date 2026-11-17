import { Table, TableBody, TableCaption, TableCell, TableFooter, TableGroup, TableHead, TableHeader, TableNo, TableRow, TableYes } from "@/components/ui/table";

const THREADS = [
  { name: "Fix flaky checkout test", repo: "acme/storefront", agent: "Claude Code", status: "Ready for review", updated: "2 min ago" },
  { name: "Migrate auth to sessions", repo: "acme/api", agent: "Codex", status: "Running", updated: "14 min ago" },
  { name: "Bump Next to 16.1", repo: "acme/web", agent: "Claude Code", status: "Merged", updated: "1 h ago" },
  { name: "Add rate limits to webhooks", repo: "acme/api", agent: "Amp", status: "Needs input", updated: "3 h ago" },
];

export function Preview() {
  return (
    <Table className="min-w-160">
      <TableHeader>
        <TableRow>
          <TableHead>Thread</TableHead>
          <TableHead>Repository</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {THREADS.map((t) => (
          <TableRow key={t.name}>
            <TableCell className="font-medium">{t.name}</TableCell>
            <TableCell className="font-code text-fg-secondary">{t.repo}</TableCell>
            <TableCell>{t.agent}</TableCell>
            <TableCell className="text-fg-secondary">{t.status}</TableCell>
            <TableCell className="text-right text-fg-muted">{t.updated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const PLANS = ["Free", "Plus", "Team", "Enterprise"];
const GROUPS: { name: string; rows: [string, ...(string | boolean)[]][] }[] = [
  {
    name: "Usage",
    rows: [
      ["Included usage", "Monthly, with a daily limit", "Generous, per seat", "Most, per seat", "Custom"],
      ["All platform models", true, true, true, true],
      ["Prepaid credits beyond that", false, true, true, true],
    ],
  },
  {
    name: "Sandboxes",
    rows: [
      ["Largest sandbox", "2 vCPU, 8 GiB", "8 vCPU, 32 GiB", "16 vCPU, 64 GiB", "Custom"],
      ["Subagents per task at once", "4", "8", "8", "8"],
      ["Snapshots and forks", false, false, true, true],
    ],
  },
];

export function Compare() {
  return (
    <Table variant="compare" className="min-w-160">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">
            <span className="sr-only">Feature</span>
          </TableHead>
          {PLANS.map((p) => (
            <TableHead key={p}>{p}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {GROUPS.map((g) => (
        <TableBody key={g.name}>
          <TableGroup colSpan={PLANS.length + 1}>{g.name}</TableGroup>
          {g.rows.map(([name, ...values]) => (
            <TableRow key={name}>
              <TableHead scope="row">{name}</TableHead>
              {values.map((v, i) => (
                <TableCell key={PLANS[i]}>{v === true ? <TableYes /> : v === false ? <TableNo /> : v}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      ))}
    </Table>
  );
}

export function Prose() {
  return (
    <div className="w-full max-w-160">
      <Table variant="prose">
        <TableHeader>
          <TableRow>
            <TableHead>Sandbox</TableHead>
            <TableHead>Cold start</TableHead>
            <TableHead>Warm start</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>2 vCPU, 8 GiB</TableCell>
            <TableCell>1.8 s</TableCell>
            <TableCell>240 ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>8 vCPU, 32 GiB</TableCell>
            <TableCell>2.4 s</TableCell>
            <TableCell>260 ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>16 vCPU, 64 GiB</TableCell>
            <TableCell>3.1 s</TableCell>
            <TableCell>310 ms</TableCell>
          </TableRow>
        </TableBody>
        <TableCaption>Median of 500 starts per size, measured in October.</TableCaption>
      </Table>
    </div>
  );
}

export function WithFooter() {
  return (
    <Table className="max-w-120">
      <TableHeader>
        <TableRow>
          <TableHead>Seat</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead className="text-right">Monthly</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Maya</TableCell>
          <TableCell className="text-fg-secondary">Team</TableCell>
          <TableCell className="text-right tabular-nums">$40.00</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>Platform lead</TableCell>
          <TableCell className="text-fg-secondary">Team</TableCell>
          <TableCell className="text-right tabular-nums">$40.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Release bot</TableCell>
          <TableCell className="text-fg-secondary">Plus</TableCell>
          <TableCell className="text-right tabular-nums">$20.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right tabular-nums">$100.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
