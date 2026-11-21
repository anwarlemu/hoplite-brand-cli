"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { CalendarBlankIcon, CaretDownIcon } from "@phosphor-icons/react/ssr";

import { Calendar, type CalendarProps, type DateRange } from "@/components/ui/calendar";
import { usePortalContainer } from "@/lib/surface";
import { cn } from "@/lib/utils";

// A date field, extrapolated from the site's field and popup (it has none). The trigger is the field: square, 40px, a
// 32 percent edge on the ground, a 16px calendar glyph in the quiet gray 12px in, the date in 14px ink (the placeholder
// in the slate) and a 16px caret at the right; the edge turns strong under the pointer and while the calendar is open,
// the ink on focus. The calendar opens 4px under it in the site's popup, a square panel of the ground with the quiet
// hairline and long soft cast, growing from the field (opacity and 98 percent scale, 240ms on the strong ease-out) and
// leaving in 200ms. Presets sit in a column of the popup's 36px rows at the panel's left over a quiet rule, the chosen one
// on the hover wash. A single date closes the panel when picked; a range closes once both ends are set. Opening puts focus
// on the chosen day (or today), so the arrow keys work at once.
const TRIGGER =
  "group/date-picker flex h-10 w-full min-w-0 cursor-pointer items-center gap-2 border border-line-field bg-transparent px-3 font-sans text-body-sm leading-line-body-sm whitespace-nowrap text-fg select-none transition-[border-color] duration-fast ease-out hover:border-line-strong focus-visible:border-focus-ring focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring data-popup-open:border-line-strong aria-invalid:border-danger data-[empty=true]:text-fg-subtle disabled:cursor-not-allowed disabled:border-line disabled:text-fg-subtle pointer-coarse:h-12 motion-reduce:transition-none";

const POPUP =
  "max-w-(--available-width) origin-(--transform-origin) overflow-hidden bg-surface text-fg shadow-floating outline-none transition-[opacity,scale] duration-slow ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-moderate motion-reduce:transition-[opacity]";

type Preset<T> = { label: string; value: T };

function formatDate(date: Date, locale?: string, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatRange(range: DateRange | undefined, locale?: string) {
  if (!range?.from) return undefined;
  if (!range.to) return `${formatDate(range.from, locale)} -`;
  const sameYear = range.from.getFullYear() === range.to.getFullYear();
  return `${formatDate(range.from, locale, sameYear ? { month: "short", day: "numeric" } : undefined)} - ${formatDate(range.to, locale)}`;
}

function DatePickerTrigger({ empty, label, className, children, ...props }: React.ComponentProps<"button"> & { empty: boolean; label?: string }) {
  return (
    <BasePopover.Trigger data-slot="date-picker-trigger" data-empty={empty} aria-label={label} className={cn(TRIGGER, className)} {...props}>
      <CalendarBlankIcon aria-hidden className="size-4 shrink-0 text-fg-muted" />
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <CaretDownIcon aria-hidden className="size-4 shrink-0 text-fg-muted" />
    </BasePopover.Trigger>
  );
}

function Content({ slot, children }: { slot: string; children: React.ReactNode }) {
  const container = usePortalContainer();
  return (
    <BasePopover.Portal container={container}>
      <BasePopover.Positioner side="bottom" align="start" sideOffset={4} collisionPadding={8} className="z-50 outline-none">
        <BasePopover.Popup data-slot={slot} initialFocus={false} className={POPUP}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

function Presets<T>({ presets, isActive, onPick }: { presets: Preset<T>[]; isActive: (p: Preset<T>) => boolean; onPick: (value: T) => void }) {
  return (
    <div data-slot="date-picker-presets" className="min-w-0 border-line max-sm:border-b sm:w-40 sm:border-r">
      <div role="group" aria-label="Presets" className="flex gap-1 overflow-x-auto p-1 fade-x sm:flex-col">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-pressed={isActive(p)}
            onClick={() => onPick(p.value)}
            className="flex h-9 shrink-0 cursor-pointer items-center px-3 text-left font-sans text-body-sm leading-line-body-sm font-normal whitespace-nowrap text-fg hover:bg-subtle-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-pressed:bg-subtle-hover"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const sameDay = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString();

type CalendarPassThrough = Omit<CalendarProps, "mode" | "selected" | "onSelect" | "required" | "min" | "max">;

type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Shortcuts beside the calendar (Today, In a week). */
  presets?: Preset<Date>[];
  /** Props for the calendar inside (disabled days, the first day of the week, today). */
  calendar?: CalendarPassThrough;
  locale?: string;
  id?: string;
  name?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-label"?: string;
};

function DatePicker({ value: valueProp, defaultValue, onValueChange, placeholder = "Pick a date", disabled, presets, calendar, locale, id, name, className, ...aria }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const set = (d: Date | undefined) => {
    if (valueProp === undefined) setInner(d);
    onValueChange?.(d);
  };
  return (
    <BasePopover.Root open={open} onOpenChange={(next) => setOpen(next)}>
      <DatePickerTrigger id={id} empty={!value} disabled={disabled} className={className} aria-invalid={aria["aria-invalid"]} label={aria["aria-label"]}>
        {value ? formatDate(value, locale) : placeholder}
      </DatePickerTrigger>
      {name && <input type="hidden" name={name} value={value ? value.toISOString().slice(0, 10) : ""} />}
      <Content slot="date-picker-content">
        <div className="flex flex-col sm:flex-row">
          {presets && (
            <Presets
              presets={presets}
              isActive={(p) => sameDay(p.value, value)}
              onPick={(d) => {
                set(d);
                setOpen(false);
              }}
            />
          )}
          <Calendar
            {...calendar}
            mode="single"
            selected={value}
            defaultMonth={value ?? calendar?.defaultMonth}
            locale={locale}
            autoFocus
            onSelect={(d) => {
              set(d);
              if (d) setOpen(false);
            }}
          />
        </div>
      </Content>
    </BasePopover.Root>
  );
}

type DateRangePickerProps = Omit<DatePickerProps, "value" | "defaultValue" | "onValueChange" | "presets"> & {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  presets?: Preset<DateRange>[];
  /** How many months show side by side (two by default; one on a phone). */
  numberOfMonths?: number;
};

function DateRangePicker({ value: valueProp, defaultValue, onValueChange, placeholder = "Pick a date range", disabled, presets, calendar, locale, numberOfMonths = 2, id, name, className, ...aria }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const set = (r: DateRange | undefined) => {
    if (valueProp === undefined) setInner(r);
    onValueChange?.(r);
  };
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 39.99rem)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const label = formatRange(value, locale);
  return (
    <BasePopover.Root open={open} onOpenChange={(next) => setOpen(next)}>
      <DatePickerTrigger id={id} empty={!label} disabled={disabled} className={className} aria-invalid={aria["aria-invalid"]} label={aria["aria-label"]}>
        {label ?? placeholder}
      </DatePickerTrigger>
      {name && (
        <>
          <input type="hidden" name={`${name}From`} value={value?.from ? value.from.toISOString().slice(0, 10) : ""} />
          <input type="hidden" name={`${name}To`} value={value?.to ? value.to.toISOString().slice(0, 10) : ""} />
        </>
      )}
      <Content slot="date-range-picker-content">
        <div className="flex flex-col sm:flex-row">
          {presets && (
            <Presets
              presets={presets}
              isActive={(p) => sameDay(p.value.from, value?.from) && sameDay(p.value.to, value?.to)}
              onPick={(r) => {
                set(r);
                setOpen(false);
              }}
            />
          )}
          <Calendar
            {...calendar}
            mode="range"
            selected={value}
            defaultMonth={value?.from ?? calendar?.defaultMonth}
            numberOfMonths={narrow ? 1 : numberOfMonths}
            locale={locale}
            autoFocus
            onSelect={(r) => {
              set(r);
              if (r?.from && r.to) setOpen(false);
            }}
          />
        </div>
      </Content>
    </BasePopover.Root>
  );
}

export { DatePicker, DateRangePicker, formatDate, formatRange };
export type { DatePickerProps, DateRangePickerProps };
