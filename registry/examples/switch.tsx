import { Label } from "@/components/ui/label";
import { Surface } from "@/lib/surface";
import { Switch } from "@/components/ui/switch";

export function Preview() {
  return (
    <Label>
      <Switch defaultChecked />
      Auto-merge green pull requests
    </Label>
  );
}

export function States() {
  return (
    <div className="grid gap-4">
      <Label>
        <Switch />
        Off
      </Label>
      <Label>
        <Switch defaultChecked />
        On
      </Label>
      <Label>
        <Switch disabled />
        Disabled
      </Label>
      <Label>
        <Switch disabled defaultChecked />
        Disabled on
      </Label>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="grid gap-4">
      <Label>
        <Switch size="sm" defaultChecked />
        Small
      </Label>
      <Label>
        <Switch defaultChecked />
        Default
      </Label>
    </div>
  );
}

export function Settings() {
  const rows = [
    { name: "Run checks on agent branches", on: true },
    { name: "Post summaries in the thread", on: true },
    { name: "Share sandboxes with the team", on: false },
  ];
  return (
    <Surface ground="night" className="w-full max-w-md p-6">
      <ul className="divide-y divide-line">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-4 py-3">
            <span className="text-body-sm text-fg-secondary">{row.name}</span>
            <Switch defaultChecked={row.on} aria-label={row.name} />
          </li>
        ))}
      </ul>
    </Surface>
  );
}
