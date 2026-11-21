"use client";

import { CaretDownIcon, InfoIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

function Seats({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>
        Add seats
        <CaretDownIcon />
      </PopoverTrigger>
      {/* Shown open on load, nobody opened it: it keeps focus where it is instead of pulling it (and the page's scroll)
          into the field. Opened from the trigger, focus moves in as usual. */}
      <PopoverContent align="start" initialFocus={defaultOpen ? false : undefined} className="flex flex-col gap-4">
        <PopoverHeader>
          <PopoverTitle>Seats on the Team plan</PopoverTitle>
          <PopoverDescription>$20 per seat a month, prorated from today.</PopoverDescription>
        </PopoverHeader>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm leading-line-body-sm font-medium text-fg">Seats</span>
          <Input type="number" defaultValue={8} min={1} />
        </label>
        <Button size="sm" className="self-end">
          Update plan
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function Preview() {
  return <Seats />;
}

export function Open() {
  return (
    <div className="min-h-80">
      <Seats defaultOpen />
    </div>
  );
}

export function Info() {
  return (
    <div className="flex items-center gap-2 text-body-sm leading-line-body-sm text-fg-secondary">
      Sandbox minutes
      <Popover>
        <PopoverTrigger render={<Button variant="ghost" size="icon-sm" aria-label="About sandbox minutes" />}>
          <InfoIcon />
        </PopoverTrigger>
        <PopoverContent side="top">
          <PopoverHeader>
            <PopoverTitle>Sandbox minutes</PopoverTitle>
            <PopoverDescription>Counted while a sandbox is running a thread. Idle sandboxes stop after 30 minutes and are not counted.</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  );
}
