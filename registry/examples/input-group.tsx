import { ArrowUpIcon, CopyIcon, GitBranchIcon, MagnifyingGlassIcon, PaperclipIcon } from "@phosphor-icons/react/ssr";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";

export function Preview() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search threads" aria-label="Search threads" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>12 results</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}

export function Addons() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>github.com/</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="acme/payments-api" aria-label="Repository" />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <GitBranchIcon />
        </InputGroupAddon>
        <InputGroupInput defaultValue="agent/upgrade-node-22" aria-label="Branch" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Copy branch name">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-invalid defaultValue="payments api" aria-label="Sandbox name" />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-danger">No spaces</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupInput disabled placeholder="Search is off while indexing" aria-label="Search" />
      </InputGroup>
    </div>
  );
}

export function Composer() {
  return (
    <InputGroup className="max-w-md">
      <InputGroupTextarea placeholder="Ask an agent to fix the failing check" aria-label="Message" />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="sm">
          <PaperclipIcon />
          Attach
        </InputGroupButton>
        <InputGroupText className="ml-auto">Sonnet, 2 sandboxes</InputGroupText>
        <InputGroupButton size="icon-sm" variant="default" aria-label="Send">
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
