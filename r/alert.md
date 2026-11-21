# Alert
A ruled notice: a square block inside a quiet edge, a 16px Phosphor glyph beside a 14px medium title and 14px graphite text. Destructive takes the orange edge and glyph; success and warning a glyph in their status color.

Install: npx hoplite-ds add alert
Requires: theme, utils
Packages: class-variance-authority
Exports: Alert, AlertAction, AlertDescription, AlertTitle, alertVariants
Client boundary: not required by this entry file
Reference: Extrapolated from the Hoplite website: its square frames on quiet lines (.hn__news), 14px notes and the orange used only as a mark


## Usage
Use Alert for a message about the page or the workspace that stays until it is resolved (a failed check, a usage limit close at hand, a connected repository). Put one glyph first, a short title, and a sentence of detail; an action goes in AlertAction. For a passing confirmation, use a toast.
- Avoid: An orange fill
- Avoid: A rounded or shadowed box
- Avoid: Bold titles
- Avoid: More than one action
- Avoid: An alert for every success


## Examples
Example components: npx hoplite-ds add alert button
Example packages: @phosphor-icons/react
[Preview](https://hoplite-ds.vercel.app/preview/alert/Preview) | [Variants](https://hoplite-ds.vercel.app/preview/alert/Variants) | [WithAction](https://hoplite-ds.vercel.app/preview/alert/WithAction) | [TitleOnly](https://hoplite-ds.vercel.app/preview/alert/TitleOnly)

examples/alert.tsx

```tsx
import { CheckCircleIcon, InfoIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react/ssr";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function Preview() {
  return (
    <Alert className="max-w-xl">
      <InfoIcon />
      <AlertTitle>Sandboxes now restart from their last snapshot</AlertTitle>
      <AlertDescription>Threads that were running when a sandbox stopped pick up from the last finished step.</AlertDescription>
    </Alert>
  );
}

export function Variants() {
  return (
    <div className="grid max-w-xl gap-4">
      <Alert variant="destructive">
        <WarningOctagonIcon />
        <AlertTitle>The deploy check failed</AlertTitle>
        <AlertDescription>e2e: checkout timed out after 10 minutes on pull request #482. The agent has paused.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircleIcon />
        <AlertTitle>Repository connected</AlertTitle>
        <AlertDescription>acme/storefront is ready. Setup ran green in 2 minutes.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <WarningIcon />
        <AlertTitle>You have used 84 percent of this month's usage</AlertTitle>
        <AlertDescription>Runs will draw on prepaid credits once the allowance is used up.</AlertDescription>
      </Alert>
    </div>
  );
}

export function WithAction() {
  return (
    <Alert className="max-w-xl">
      <InfoIcon />
      <AlertTitle>Two seats are unassigned</AlertTitle>
      <AlertDescription>Invite teammates or remove the seats before the next billing date.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Manage seats
        </Button>
      </AlertAction>
    </Alert>
  );
}

export function TitleOnly() {
  return (
    <Alert className="max-w-xl">
      <AlertTitle>Automations are paused while the workspace is in read-only mode.</AlertTitle>
    </Alert>
  );
}

```

## Source

components/ui/alert.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// A notice in the site's ruled language (extrapolated from its frames and notes): a square block on the ground inside a
// quiet 16 percent edge, 16px in, a 16px Phosphor glyph in the ink 2px down beside a 14px medium ink title and a 14px
// graphite description. Nothing is filled: `destructive` takes the orange edge and an orange glyph, `success` and
// `warning` keep the quiet edge with a glyph in their status color. An action sits at the end, centered on the block.
const alertVariants = cva(
  "group/alert relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 border px-4 py-4 font-sans text-body-sm leading-line-body-sm has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:gap-x-3 has-data-[slot=alert-action]:grid-cols-[0_1fr_auto] has-[>svg]:has-data-[slot=alert-action]:grid-cols-[16px_1fr_auto] [&>svg]:row-span-2 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-line text-fg [&>svg]:text-fg",
        destructive: "border-danger text-fg [&>svg]:text-danger",
        success: "border-line text-fg [&>svg]:text-success",
        warning: "border-line text-fg [&>svg]:text-warning",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" data-variant={variant ?? "default"} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("col-start-2 min-h-5 font-medium text-pretty text-fg", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("col-start-2 grid justify-items-start gap-1 text-pretty text-fg-secondary [&_a]:text-fg [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 [&_a:hover]:decoration-current [&_p]:leading-line-body-sm", className)} {...props} />;
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-action" className={cn("col-start-3 row-span-2 row-start-1 ml-4 flex items-center gap-2 self-center", className)} {...props} />;
}

export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants };

```
