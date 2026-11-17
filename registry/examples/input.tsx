import { Input } from "@/components/ui/input";

export function Preview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="repo" className="text-body-sm font-medium text-fg">Repository</label>
      <Input id="repo" placeholder="usehoplite/notra-api" />
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Search threads" />
      <Input defaultValue="notra-api" />
      <Input aria-invalid defaultValue="notra api" />
      <Input disabled placeholder="Sandbox size is set by your plan" />
      <Input type="file" />
    </div>
  );
}
