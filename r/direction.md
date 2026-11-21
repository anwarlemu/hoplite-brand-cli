# Direction
Sets the reading direction (ltr or rtl) for every Base UI part inside it, so tabs, menus, sliders and scroll areas flip for right-to-left text. It draws nothing of its own.

Install: npx hoplite-ds add direction
Requires: theme
Packages: @base-ui/react
Exports: DirectionProvider, useDirection
Client boundary: yes
Reference: Extrapolated from the Hoplite website: a wrapper around Base UI's DirectionProvider with no look of its own


## Usage
Wrap an app or a region whose text reads right to left in DirectionProvider with dir="rtl", and set dir="rtl" on the element it wraps too so the page's own layout flips with it.
- Avoid: Flipping layout with transforms
- Avoid: Setting the provider without the matching dir attribute
- Avoid: Mirroring icons that do not point


## Examples
Example components: npx hoplite-ds add direction tabs
[Preview](https://hoplite-ds.vercel.app/preview/direction/Preview) | [LeftToRight](https://hoplite-ds.vercel.app/preview/direction/LeftToRight)

examples/direction.tsx

```tsx
"use client";

import { DirectionProvider } from "@/components/ui/direction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Preview() {
  return (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="grid gap-4">
        <p className="ds-label">الفوترة</p>
        <Tabs defaultValue="monthly">
          <TabsList aria-label="فترة الفوترة">
            <TabsTrigger value="monthly">شهري</TabsTrigger>
            <TabsTrigger value="yearly">سنوي</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="text-body-sm text-fg-secondary">
            ٢٠ دولارًا لكل مقعد، تُدفع كل شهر.
          </TabsContent>
          <TabsContent value="yearly" className="text-body-sm text-fg-secondary">
            تُدفع مرة واحدة في السنة.
          </TabsContent>
        </Tabs>
      </div>
    </DirectionProvider>
  );
}

export function LeftToRight() {
  return (
    <DirectionProvider dir="ltr">
      <div dir="ltr" className="grid gap-4">
        <p className="ds-label">Billing</p>
        <Tabs defaultValue="monthly">
          <TabsList aria-label="Billing period">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </DirectionProvider>
  );
}

```

## Source

components/ui/direction.tsx

```tsx
"use client";

import * as React from "react";
import { DirectionProvider as BaseDirectionProvider, useDirection } from "@base-ui/react/direction-provider";

// Sets the reading direction (ltr or rtl) for every Base UI part inside it, so menus, sliders, tabs and scroll areas
// flip for right-to-left text. It draws nothing of its own; set dir on the element it wraps too. `dir` is kept beside
// Base UI's `direction` so code written for shadcn keeps working.
type DirectionProviderProps = React.ComponentProps<typeof BaseDirectionProvider> & { dir?: React.ComponentProps<typeof BaseDirectionProvider>["direction"] };

function DirectionProvider({ dir, direction, children }: DirectionProviderProps) {
  return <BaseDirectionProvider direction={direction ?? dir}>{children}</BaseDirectionProvider>;
}

export { DirectionProvider, useDirection };

```
