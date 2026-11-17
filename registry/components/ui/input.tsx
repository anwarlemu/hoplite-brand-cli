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
