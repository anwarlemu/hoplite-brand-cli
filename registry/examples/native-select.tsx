import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";

export function Preview() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="native-size" className="font-sans text-body-sm font-medium text-fg">
        Sandbox size
      </label>
      <NativeSelect id="native-size" defaultValue="standard" className="w-full">
        <NativeSelectOption value="small">Small, 1 vCPU, 4 GiB</NativeSelectOption>
        <NativeSelectOption value="standard">Standard, 2 vCPU, 8 GiB</NativeSelectOption>
        <NativeSelectOption value="large">Large, 8 vCPU, 32 GiB</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

export function Groups() {
  return (
    <NativeSelect defaultValue="sonnet" aria-label="Model">
      <NativeSelectOptGroup label="Fast">
        <NativeSelectOption value="haiku">Haiku</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Balanced">
        <NativeSelectOption value="sonnet">Sonnet</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Deep">
        <NativeSelectOption value="opus">Opus</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <NativeSelect size="sm" defaultValue="main" aria-label="Base branch">
        <NativeSelectOption value="main">main</NativeSelectOption>
        <NativeSelectOption value="develop">develop</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-invalid defaultValue="" aria-label="Region">
        <NativeSelectOption value="">Choose a region</NativeSelectOption>
        <NativeSelectOption value="us">US East</NativeSelectOption>
      </NativeSelect>
      <NativeSelect disabled defaultValue="team" aria-label="Plan">
        <NativeSelectOption value="team">Team plan</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
