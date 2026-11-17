import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Preview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="label-repo">Repository</Label>
      <Input id="label-repo" placeholder="acme/payments-api" />
    </div>
  );
}

export function WithControl() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="label-ci" defaultChecked />
      <Label htmlFor="label-ci">Run checks on every pull request</Label>
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <div className="grid gap-2">
        <Label htmlFor="label-name">
          Sandbox name <span aria-hidden data-slot="label-required">*</span>
        </Label>
        <Input id="label-name" required placeholder="payments-staging" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="label-off" disabled />
        <Label htmlFor="label-off">Allow agents to merge (Team plan)</Label>
      </div>
    </div>
  );
}
