import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function Preview() {
  return (
    <Field className="max-w-md">
      <FieldLabel>Task</FieldLabel>
      <Textarea placeholder="Describe what the agent should do, and how you will know it is done." />
      <FieldDescription>Agents read this before they open a sandbox.</FieldDescription>
    </Field>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <Textarea defaultValue="Upgrade the payments service to Node 22 and fix any failing tests." />
      <Field invalid>
        <Textarea defaultValue="" placeholder="Task" />
        <FieldError>Describe the task before starting the thread.</FieldError>
      </Field>
      <Textarea disabled placeholder="Threads are read-only once merged" />
    </div>
  );
}
