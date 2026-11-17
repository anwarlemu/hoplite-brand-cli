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
