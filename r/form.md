# Form
react-hook-form helpers laid out as Field: a 14px medium label 8px above the control, 14px quiet help and a 14px orange message below; the control alone takes the orange edge when it fails.

Install: npx hoplite-ds add form
Requires: theme, label, utils
Packages: react-hook-form
Exports: Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField
Client boundary: yes
Reference: Extrapolated from the Hoplite website's type and lines and the principles for fields (the site has no forms)


## Usage
Use Form with react-hook-form's useForm: FormField for each value, FormItem around its FormLabel, FormControl (around exactly one control), FormDescription and FormMessage. Stack items in a grid with gap-6. For forms without react-hook-form use Field.
- Avoid: Messages in any color but the orange
- Avoid: An orange label
- Avoid: Errors above the control
- Avoid: Wrapping more than one element in FormControl


## Examples
Example components: npx hoplite-ds add form button checkbox input textarea
Example packages: react-hook-form
[Preview](https://hoplite-ds.vercel.app/preview/form/Preview) | [Errors](https://hoplite-ds.vercel.app/preview/form/Errors)

examples/form.tsx

```tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Values = { repository: string; task: string; autoMerge: boolean };

export function Preview() {
  const form = useForm<Values>({ defaultValues: { repository: "", task: "", autoMerge: false } });
  const [sent, setSent] = React.useState<Values | null>(null);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(setSent)} className="grid w-full max-w-md gap-6" noValidate>
        <FormField
          control={form.control}
          name="repository"
          rules={{ required: "Choose a repository.", pattern: { value: /^[\w.-]+\/[\w.-]+$/, message: "Use the owner/name form, like acme/payments-api." } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input placeholder="acme/payments-api" {...field} />
              </FormControl>
              <FormDescription>Agents clone it into a fresh sandbox.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="task"
          rules={{ required: "Describe the task." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Textarea placeholder="Upgrade to Node 22 and fix failing tests" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autoMerge"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Merge when checks pass</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4">
          <Button type="submit">Start thread</Button>
          {sent && <span className="text-body-sm text-fg-muted">Started on {sent.repository}</span>}
        </div>
      </form>
    </Form>
  );
}

export function Errors() {
  const form = useForm<Values>({ defaultValues: { repository: "payments api", task: "", autoMerge: false } });
  React.useEffect(() => {
    form.setError("repository", { message: "Use the owner/name form, like acme/payments-api." });
  }, [form]);
  return (
    <Form {...form}>
      <form className="grid w-full max-w-md gap-6" noValidate>
        <FormField
          control={form.control}
          name="repository"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

```

## Source

components/ui/form.tsx

```tsx
"use client";

import * as React from "react";
import { Controller, FormProvider, useFormContext, useFormState, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// A react-hook-form form laid out as Field lays out a field (extrapolated from the site's type and lines: it has no
// forms). Each FormItem is its 14px medium ink label 8px above the control; a FormDescription is 14px quiet gray 8px
// under it and a FormMessage the 14px orange line. A field that fails keeps its label ink: only the control (through
// aria-invalid, the orange edge) and the message take the orange. Items stack 24px apart in a `grid gap-6` form.
const Form = FormProvider;

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = { id: string };

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

/** The state of the field around it: its ids for labels and messages, and react-hook-form's error, dirty and touched state. */
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
  if (!itemContext) throw new Error("useFormField should be used within <FormItem>");
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;
  return { id, name: fieldContext.name, formItemId: `${id}-form-item`, formDescriptionId: `${id}-form-item-description`, formMessageId: `${id}-form-item-message`, ...fieldState };
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid min-w-0 gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();
  return <Label data-slot="form-label" data-error={!!error} htmlFor={formItemId} className={cn("w-fit", className)} {...props} />;
}

type ControlProps = { id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean };

/** Hands the field's id, its description and message ids and aria-invalid to the one control inside it. */
function FormControl({ children }: { children: React.ReactElement<ControlProps> }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    id: formItemId,
    "aria-describedby": !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`,
    "aria-invalid": !!error,
  });
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();
  return <p data-slot="form-description" id={formDescriptionId} className={cn("m-0 font-sans text-body-sm leading-line-body-sm text-fg-muted", className)} {...props} />;
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;
  if (!body) return null;
  return (
    <p data-slot="form-message" id={formMessageId} role={error ? "alert" : undefined} className={cn("m-0 font-sans text-body-sm leading-line-body-sm text-danger", className)} {...props}>
      {body}
    </p>
  );
}

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField };

```
