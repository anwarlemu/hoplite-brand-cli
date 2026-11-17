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
