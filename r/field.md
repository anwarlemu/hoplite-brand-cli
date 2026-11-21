# Field
Form layout on Base UI's Field and Fieldset: a 14px medium label 8px above the control, 14px quiet help and 14px orange errors below, fields 24px apart, Chakra Petch 20px set legends, choice cards framed in the quiet rule that turn ink when chosen, and an "or" between two quiet rules.

Install: npx hoplite-ds add field
Requires: theme, utils
Packages: @base-ui/react, class-variance-authority
Exports: Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle
Client boundary: yes
Reference: Extrapolated from the Hoplite website: its 14px type, the quiet and 32 percent lines (--line-quiet, --line-margin), its Chakra Petch group heads (.pr-table) and the principles for fields


## Usage
Wrap every form control in a Field with a FieldLabel, an optional FieldDescription and a FieldError; group fields in FieldGroup and related choices in FieldSet with a FieldLegend. Use orientation="horizontal" for a check, radio or switch beside its label, FieldContent with FieldTitle and FieldDescription for a setting row, and a FieldLabel wrapping a Field for a choice card. Pass invalid (or data-invalid) to mark the control and show the error.
- Avoid: Errors in any color but the orange
- Avoid: An orange label
- Avoid: Boxed or shaded field groups
- Avoid: Rounded choice cards
- Avoid: Help text above the control


## Examples
Example components: npx hoplite-ds add field button checkbox input radio-group switch
[Preview](https://hoplite-ds.vercel.app/preview/field/Preview) | [Sets](https://hoplite-ds.vercel.app/preview/field/Sets) | [Settings](https://hoplite-ds.vercel.app/preview/field/Settings) | [ChoiceCards](https://hoplite-ds.vercel.app/preview/field/ChoiceCards)

examples/field.tsx

```tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export function Preview() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel>Repository</FieldLabel>
        <Input placeholder="acme/payments-api" />
        <FieldDescription>Agents clone it into a fresh sandbox for every thread.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>Branch prefix</FieldLabel>
        <Input defaultValue="agent fix/" />
        <FieldError>Branch names cannot contain spaces.</FieldError>
      </Field>
    </FieldGroup>
  );
}

export function Sets() {
  return (
    <FieldSet className="max-w-md">
      <FieldLegend>Notifications</FieldLegend>
      <FieldDescription>Choose when you hear about agent work.</FieldDescription>
      <FieldGroup className="gap-4">
        <Field orientation="horizontal">
          <Checkbox defaultChecked />
          <FieldLabel>A pull request is ready for review</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox defaultChecked />
          <FieldLabel>A check fails on an agent branch</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox />
          <FieldLabel>A thread is waiting for input</FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

export function Settings() {
  return (
    <FieldGroup className="max-w-md">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Auto-merge green pull requests</FieldTitle>
          <FieldDescription>Merge once every required check passes and a reviewer approves.</FieldDescription>
        </FieldContent>
        <Switch defaultChecked />
      </Field>
      <FieldSeparator />
      <Field orientation="horizontal" disabled>
        <FieldContent>
          <FieldTitle>Run agents on Windows sandboxes</FieldTitle>
          <FieldDescription>Available on the Team plan.</FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
    </FieldGroup>
  );
}

export function ChoiceCards() {
  return (
    <FieldSet className="max-w-md">
      <FieldLegend variant="label">Sandbox size</FieldLegend>
      <RadioGroup defaultValue="standard" className="gap-3">
        <FieldLabel>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Standard</FieldTitle>
              <FieldDescription>2 vCPU, 8 GiB RAM</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="standard" />
          </Field>
        </FieldLabel>
        <FieldLabel>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Large</FieldTitle>
              <FieldDescription>8 vCPU, 32 GiB RAM</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="large" />
          </Field>
        </FieldLabel>
      </RadioGroup>
      <FieldSeparator>or</FieldSeparator>
      <Button variant="outline" className="self-start">Bring your own runner</Button>
    </FieldSet>
  );
}

```

## Source

components/ui/field.tsx

```tsx
"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A form's fields as the site's principles lay them out (the site itself has no forms, so this is extrapolated from
// its type and lines). A field is its 14px medium ink label 8px above the control; help sits 8px below in 14px quiet
// gray and an error in 14px orange (the orange is the error's mark, so only the message and the control's edge take it,
// never the label). Fields stack 24px apart in a group; a check, radio or switch sits 8px from its label. A set's
// legend is a 20px Chakra Petch light title. A label that wraps a whole field becomes a choice card: a square frame of
// the quiet rule, 16px in, whose edge turns the 32 percent line under the pointer and the ink when its control is on.
// "or" between two ways in is a 14px quiet word between two quiet rules. Built on Base UI's Field and Fieldset, so the
// label, description and error are wired to the control and a disabled field quiets every part.
// Base UI's Field parts must sit inside a Field.Root; outside a Field (a set's description, a choice card's label)
// the same parts render as plain elements with the same look.
const InField = React.createContext(false);

function FieldSet({ className, ...props }: React.ComponentProps<typeof BaseFieldset.Root>) {
  return <BaseFieldset.Root data-slot="field-set" className={cn("m-0 flex min-w-0 flex-col gap-6 border-0 p-0 has-[>[data-slot=checkbox-group]]:gap-4 has-[>[data-slot=radio-group]]:gap-4", className)} {...props} />;
}

function FieldLegend({ className, variant = "legend", ...props }: React.ComponentProps<typeof BaseFieldset.Legend> & { variant?: "legend" | "label" }) {
  return (
    <BaseFieldset.Legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "p-0 text-fg data-[variant=label]:font-sans data-[variant=label]:text-body-sm data-[variant=label]:leading-line-body-sm data-[variant=label]:font-medium data-[variant=legend]:font-display data-[variant=legend]:text-h5 data-[variant=legend]:leading-title data-[variant=legend]:font-light data-disabled:text-fg-subtle",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("group/field-group @container/field-group flex w-full flex-col gap-6 [&>[data-slot=field-group]]:gap-4", className)} {...props} />;
}

const fieldVariants = cva("group/field flex w-full gap-2", {
  variants: {
    orientation: {
      // Label over control.
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      // Label beside its control (a check and its label, a setting and its switch).
      horizontal: "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[data-slot=checkbox],&>[data-slot=radio-group-item],&>[data-slot=switch]]:mt-[calc(var(--ds-space-1)/2)]",
      // Over on a narrow form, beside from 28rem of container.
      responsive: "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:gap-4 @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

type FieldProps = React.ComponentProps<typeof BaseField.Root> & VariantProps<typeof fieldVariants> & { "data-invalid"?: boolean | "true" | "false" };

function Field({ className, orientation = "vertical", invalid, "data-invalid": dataInvalid, ...props }: FieldProps) {
  const marked = dataInvalid === true || dataInvalid === "true" ? true : undefined;
  return (
    <InField.Provider value>
      <BaseField.Root role="group" data-slot="field" data-orientation={orientation} invalid={invalid ?? marked} className={cn(fieldVariants({ orientation }), className)} {...props} />
    </InField.Provider>
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn("group/field-content flex min-w-0 flex-1 flex-col gap-1", className)} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof BaseField.Label>) {
  const inField = React.useContext(InField);
  const Part = inField ? BaseField.Label : PlainLabel;
  return (
    <Part
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit items-center gap-2 font-sans text-body-sm leading-line-body-sm font-medium text-fg select-none data-disabled:cursor-not-allowed data-disabled:text-fg-subtle group-data-disabled/field:text-fg-subtle",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:cursor-pointer has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-line has-[>[data-slot=field]]:transition-[border-color] has-[>[data-slot=field]]:duration-fast has-[>[data-slot=field]]:ease-out *:data-[slot=field]:p-4 has-[>[data-slot=field]]:hover:border-line-field has-[[data-slot=field]_[data-checked]]:border-primary has-[[data-slot=field]_[data-checked]]:hover:border-primary motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function PlainLabel({ className, nativeLabel: _native, ...props }: React.ComponentProps<typeof BaseField.Label>) {
  return <label className={typeof className === "string" ? className : undefined} {...(props as React.ComponentProps<"label">)} />;
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-title" className={cn("flex w-fit items-center gap-2 font-sans text-body-sm leading-line-body-sm font-medium text-fg group-data-disabled/field:text-fg-subtle", className)} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<typeof BaseField.Description>) {
  const inField = React.useContext(InField);
  const Part = inField ? BaseField.Description : PlainDescription;
  return (
    <Part
      data-slot="field-description"
      className={cn(
        "m-0 font-sans text-body-sm leading-line-body-sm font-normal text-fg-muted group-has-[[data-orientation=horizontal]]/field:text-balance [[data-variant=legend]+&]:-mt-4 [&>a]:font-medium [&>a]:text-fg [&>a]:underline [&>a]:decoration-line [&>a]:underline-offset-4 [&>a:hover]:decoration-current",
        className,
      )}
      {...props}
    />
  );
}

function PlainDescription({ className, ...props }: React.ComponentProps<typeof BaseField.Description>) {
  return <p className={typeof className === "string" ? className : undefined} {...(props as React.ComponentProps<"p">)} />;
}

/** The "or" between two ways in: a 14px quiet word between two quiet rules. */
function FieldSeparator({ children, className, ...props }: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div data-slot="field-separator" data-content={!!children} className={cn("relative flex h-5 items-center gap-3 font-sans text-body-sm leading-line-body-sm", className)} {...props}>
      <div aria-hidden className="h-px flex-1 bg-line" />
      {children && (
        <span data-slot="field-separator-content" className="shrink-0 text-fg-muted">
          {children}
        </span>
      )}
      {children && <div aria-hidden className="h-px flex-1 bg-line" />}
    </div>
  );
}

type FieldErrorProps = Omit<React.ComponentProps<typeof BaseField.Error>, "children"> & { children?: React.ReactNode; errors?: Array<{ message?: string } | undefined> };

// With children or errors it always shows them; without, it shows the browser's own message while the field is invalid.
function FieldError({ className, children, errors, match, ...props }: FieldErrorProps) {
  const content = React.useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;
    const unique = [...new Map(errors.map((error) => [error?.message, error])).values()];
    if (unique.length === 1) return unique[0]?.message;
    return <ul className="m-0 flex list-disc flex-col gap-1 pl-4">{unique.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}</ul>;
  }, [children, errors]);
  const inField = React.useContext(InField);
  const look = cn("font-sans text-body-sm leading-line-body-sm font-normal text-danger", className);
  if (!inField) {
    if (!content) return null;
    return (
      <div role="alert" data-slot="field-error" className={look} {...(props as React.ComponentProps<"div">)}>
        {content}
      </div>
    );
  }
  if (!content) return <BaseField.Error data-slot="field-error" match={match} className={look} {...props} />;
  return (
    <BaseField.Error role="alert" data-slot="field-error" match={match ?? true} className={look} {...props}>
      {content}
    </BaseField.Error>
  );
}

export { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle };

```
