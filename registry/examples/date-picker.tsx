"use client";

import * as React from "react";

import type { DateRange } from "@/components/ui/calendar";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";

// A fixed today, so the examples read the same on every visit.
const TODAY = new Date(2026, 10, 17);
const days = (n: number) => new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + n);
const LABEL = "text-body-sm font-medium text-fg";

export function Preview() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="grid w-full max-w-72 gap-2">
      <label htmlFor="token-expires" className={LABEL}>
        Token expires
      </label>
      <DatePicker id="token-expires" value={date} onValueChange={setDate} placeholder="Never" calendar={{ today: TODAY, disabled: { before: TODAY } }} />
    </div>
  );
}

export function Range() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: days(-6), to: TODAY });
  return (
    <div className="grid w-full max-w-80 gap-2">
      <label htmlFor="usage-range" className={LABEL}>
        Usage period
      </label>
      <DateRangePicker id="usage-range" value={range} onValueChange={setRange} calendar={{ today: TODAY, disabled: { after: TODAY } }} />
    </div>
  );
}

export function Presets() {
  const [run, setRun] = React.useState<Date | undefined>(days(1));
  return (
    <div className="grid w-full max-w-80 gap-2">
      <label htmlFor="run-on" className={LABEL}>
        Run the automation on
      </label>
      <DatePicker
        id="run-on"
        value={run}
        onValueChange={setRun}
        calendar={{ today: TODAY, disabled: { before: TODAY } }}
        presets={[
          { label: "Today", value: TODAY },
          { label: "Tomorrow", value: days(1) },
          { label: "In a week", value: days(7) },
          { label: "In a month", value: days(30) },
        ]}
      />
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-72 gap-3">
      <DatePicker aria-label="Release date" aria-invalid placeholder="Pick a release date" calendar={{ today: TODAY }} />
      <DatePicker aria-label="Plan renews" defaultValue={new Date(2026, 11, 1)} disabled calendar={{ today: TODAY }} />
    </div>
  );
}
