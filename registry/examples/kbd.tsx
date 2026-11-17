import { CommandIcon } from "@phosphor-icons/react/ssr";

import { Kbd, KbdGroup } from "@/components/ui/kbd";

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <KbdGroup>
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>Enter</Kbd>
      </KbdGroup>
      <Kbd>Esc</Kbd>
    </div>
  );
}

export function InText() {
  return (
    <p className="max-w-md text-body-sm leading-line-body-sm text-fg-secondary">
      Press <Kbd>N</Kbd> to start a thread, or{" "}
      <KbdGroup>
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>{" "}
      to send the message and keep the agent running.
    </p>
  );
}

export function OnInk() {
  return (
    <div data-slot="tooltip-content" className="inline-flex items-center gap-2 bg-primary px-2 py-1 text-caption leading-line-caption text-on-primary">
      Search threads
      <KbdGroup>
        <Kbd>
          <CommandIcon />
        </Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  );
}
