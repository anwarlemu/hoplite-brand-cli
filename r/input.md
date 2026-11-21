# Input
A square 40px field: a 32 percent edge on the ground, 14px Satoshi with 12px sides, a slate placeholder; the edge turns strong under the pointer and ink on focus, orange when invalid.

Install: npx hoplite-ds add input
Requires: theme, utils
Packages: @base-ui/react
Exports: Input, inputClassName
Client boundary: yes
Reference: Derived from the Hoplite website's lines and type (the site has no fields): the 32 percent line (--line-margin), the strong edge (--line), 14px controls


## Usage
Use Input for one line of text, email, numbers or a search. Put it in a Field with a label above and help or an error below; use InputGroup for a glyph or an action inside the field. Pass aria-invalid when the value fails.
- Avoid: Rounded corners
- Avoid: A white or filled well
- Avoid: A placeholder used as the label
- Avoid: Orange anywhere but an error


## Examples
Example components: npx hoplite-ds add input
[Preview](https://hoplite-ds.vercel.app/preview/input/Preview) | [States](https://hoplite-ds.vercel.app/preview/input/States)

examples/input.tsx

```tsx
import { Input } from "@/components/ui/input";

export function Preview() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="repo" className="text-body-sm font-medium text-fg">Repository</label>
      <Input id="repo" placeholder="usehoplite/notra-api" />
    </div>
  );
}

export function States() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Search threads" />
      <Input defaultValue="notra-api" />
      <Input aria-invalid defaultValue="notra api" />
      <Input disabled placeholder="Sandbox size is set by your plan" />
      <Input type="file" />
    </div>
  );
}

```

## Source

components/ui/input.tsx

```tsx
"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

// A field as the site would draw one: square, 40px, a 32 percent edge on the ground, 14px Satoshi with 12px sides and a
// slate placeholder. The edge turns strong under the pointer and the ink on focus (an inset 1px outline makes it 2px).
// Invalid fields take the orange edge; disabled ones go quiet. Inside a Field it takes the label, help and error.
const FIELD =
  "flex h-10 w-full min-w-0 border border-line-field bg-transparent px-3 font-sans text-body-sm leading-line-body-sm text-fg transition-[border-color] duration-fast ease-out placeholder:text-fg-subtle hover:border-line-strong focus-visible:border-focus-ring focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring aria-invalid:border-danger aria-invalid:focus-visible:outline-danger data-invalid:border-danger disabled:cursor-not-allowed disabled:border-line disabled:text-fg-subtle file:mr-3 file:border-0 file:bg-transparent file:font-sans file:text-body-sm file:font-medium file:text-fg pointer-coarse:h-12 pointer-coarse:text-body motion-reduce:transition-none";

function Input({ className, type = "text", ...props }: React.ComponentProps<typeof BaseInput>) {
  return <BaseInput data-slot="input" type={type} className={cn(FIELD, className)} {...props} />;
}

export { Input, FIELD as inputClassName };

```
