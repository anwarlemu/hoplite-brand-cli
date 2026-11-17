import { EyeIcon, ListChecksIcon, PushPinIcon, TextBIcon, TextItalicIcon } from "@phosphor-icons/react/ssr";

import { Toggle } from "@/components/ui/toggle";

export function Preview() {
  return (
    <div className="flex items-center gap-1">
      <Toggle defaultPressed>
        <EyeIcon />
        Watch thread
      </Toggle>
      <Toggle>
        <PushPinIcon />
        Pin
      </Toggle>
    </div>
  );
}

export function Variants() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-1">
        <Toggle aria-label="Bold">
          <TextBIcon />
        </Toggle>
        <Toggle aria-label="Italic" defaultPressed>
          <TextItalicIcon />
        </Toggle>
        <Toggle>
          <ListChecksIcon />
          Checks only
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <Toggle variant="outline">Failing only</Toggle>
        <Toggle variant="outline" defaultPressed>
          Mine
        </Toggle>
      </div>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Toggle size="sm" defaultPressed>
        Small
      </Toggle>
      <Toggle defaultPressed>Default</Toggle>
      <Toggle size="lg" variant="outline" defaultPressed>
        Large
      </Toggle>
    </div>
  );
}

export function States() {
  return (
    <div className="flex items-center gap-3">
      <Toggle disabled>Disabled</Toggle>
      <Toggle disabled defaultPressed>
        Disabled on
      </Toggle>
      <Toggle variant="outline" disabled>
        Disabled
      </Toggle>
    </div>
  );
}
