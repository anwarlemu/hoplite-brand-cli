# Textarea
The square field for several lines: a 32 percent edge on the ground, 14px Satoshi on 20px lines, 96px tall at first and growing with its content; strong edge under the pointer, ink on focus, orange when invalid.

Install: npx hoplite-ds add textarea
Requires: theme, input, utils
Packages: none
Exports: Textarea
Client boundary: yes
Reference: Derived from the Hoplite website's lines and type, as Input is (the site has no fields): the 32 percent line (--line-margin), the strong edge (--line), 14px controls


## Usage
Use Textarea for free text longer than a line (a task for an agent, a review comment). Put it in a Field with a label above. For a message composer with actions inside the frame use InputGroup with InputGroupTextarea.
- Avoid: Rounded corners
- Avoid: A white or filled well
- Avoid: A fixed height that hides what was typed
- Avoid: A placeholder used as the label


## Examples
Example components: npx hoplite-ds add textarea field
[Preview](https://hoplite-ds.vercel.app/preview/textarea/Preview) | [States](https://hoplite-ds.vercel.app/preview/textarea/States)

examples/textarea.tsx

```tsx
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

```

## Source

components/ui/textarea.tsx

```tsx
"use client";

import * as React from "react";

import { inputClassName } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// The field (input.tsx) for several lines: square, a 32 percent edge on the ground, 14px Satoshi on 20px lines with
// 12px sides and 8px above and below, a slate placeholder. It starts 96px tall and grows with its content; people can
// still drag it taller. The edge turns strong under the pointer and the ink on focus (2px with the inset outline);
// invalid takes the orange edge, disabled goes quiet. The site has no fields: this follows its lines and type.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(inputClassName, "field-sizing-content group-data-invalid/field:border-danger h-auto min-h-24 resize-y py-2 pointer-coarse:h-auto", className)} {...props} />;
}

export { Textarea };

```
