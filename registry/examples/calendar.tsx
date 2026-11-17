"use client";

import * as React from "react";

import { Calendar, type DateRange } from "@/components/ui/calendar";

const TODAY = new Date(2026, 10, 17);
const FRAME = "border border-line";

export function Preview() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 10, 20));
  return <Calendar mode="single" selected={date} onSelect={setDate} today={TODAY} className={FRAME} />;
}

export function Range() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(2026, 10, 9), to: new Date(2026, 10, 18) });
  return <Calendar mode="range" selected={range} onSelect={setRange} today={TODAY} numberOfMonths={2} className={FRAME} />;
}

export function Multiple() {
  const [days, setDays] = React.useState<Date[]>([new Date(2026, 10, 3), new Date(2026, 10, 10), new Date(2026, 10, 24)]);
  return <Calendar mode="multiple" selected={days} onSelect={setDays} today={TODAY} weekStartsOn={1} className={FRAME} />;
}

export function Disabled() {
  const [date, setDate] = React.useState<Date | undefined>();
  return <Calendar mode="single" selected={date} onSelect={setDate} today={TODAY} disabled={[{ before: TODAY }, { dayOfWeek: [0, 6] }]} showOutsideDays={false} className={FRAME} />;
}

export function Dropdown() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2024, 2, 14));
  return <Calendar mode="single" selected={date} onSelect={setDate} today={TODAY} captionLayout="dropdown" fromYear={2020} toYear={2027} className={FRAME} />;
}
