import { CaretDownIcon, CopyIcon, DotsThreeIcon, GitMergeIcon, MinusIcon, PlusIcon, TerminalWindowIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

export function Preview() {
  return (
    <ButtonGroup aria-label="Merge the pull request">
      <Button className="pl-8">
        <GitMergeIcon />
        Squash and merge
      </Button>
      <ButtonGroupSeparator />
      <Button size="icon" className="w-12" aria-label="More merge options">
        <CaretDownIcon />
      </Button>
    </ButtonGroup>
  );
}

export function Outline() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ButtonGroup aria-label="Branch actions">
        <Button variant="outline">
          <CopyIcon />
          Copy branch
        </Button>
        <Button variant="outline">
          <TerminalWindowIcon />
          Open in terminal
        </Button>
        <Button variant="outline" size="icon" aria-label="More branch actions">
          <DotsThreeIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Seats">
        <Button variant="outline" size="icon" aria-label="Remove a seat">
          <MinusIcon />
        </Button>
        <ButtonGroupText className="min-w-24 justify-center text-fg">4 seats</ButtonGroupText>
        <Button variant="outline" size="icon" aria-label="Add a seat">
          <PlusIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export function WithField() {
  return (
    <ButtonGroup className="w-full max-w-md">
      <Input aria-label="Email to invite" placeholder="maya@acme.dev" />
      <Button variant="outline">Invite</Button>
    </ButtonGroup>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ButtonGroup aria-label="Run the agent">
        <Button size="sm">Run agent</Button>
        <ButtonGroupSeparator />
        <Button size="icon-sm" className="w-10" aria-label="More run options">
          <CaretDownIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Zoom">
        <Button variant="outline" size="icon-sm" aria-label="Zoom out">
          <MinusIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Zoom in">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Sandbox actions">
        <Button variant="outline" size="sm">Restart sandbox</Button>
        <Button variant="outline" size="sm">Open logs</Button>
      </ButtonGroup>
    </div>
  );
}
