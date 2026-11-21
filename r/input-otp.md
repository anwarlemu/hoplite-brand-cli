# Input OTP
A one-time code on Base UI's OTP field: joined square 40px cells on the quiet rule, a 16px Kode Mono character in each, the cell with the caret on the strong edge; orange edges when invalid.

Install: npx hoplite-ds add input-otp
Requires: theme, utils
Packages: @base-ui/react, @phosphor-icons/react
Exports: InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS
Client boundary: yes
Reference: Extrapolated from the Hoplite website: the joined boxes of its changelog filter (.cl-filter), its quiet and strong lines, and Kode Mono for codes


## Usage
Use InputOTP for a short verification or pairing code. Set maxLength and lay out InputOTPSlot cells in one or two InputOTPGroup rows with an InputOTPSeparator between. Digits are the default; pass pattern=REGEXP_ONLY_DIGITS_AND_CHARS for letters too. Label it with a visible label and htmlFor on the id.
- Avoid: Rounded cells
- Avoid: Satoshi or display type in the cells
- Avoid: An orange active cell
- Avoid: Cells that grow when focused


## Examples
Example components: npx hoplite-ds add input-otp
[Preview](https://hoplite-ds.vercel.app/preview/input-otp/Preview) | [Controlled](https://hoplite-ds.vercel.app/preview/input-otp/Controlled) | [States](https://hoplite-ds.vercel.app/preview/input-otp/States)

examples/input-otp.tsx

```tsx
"use client";

import * as React from "react";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_DIGITS_AND_CHARS } from "@/components/ui/input-otp";

export function Preview() {
  return (
    <div className="grid gap-2">
      <label htmlFor="otp-code" className="font-sans text-body-sm font-medium text-fg">
        Verification code
      </label>
      <InputOTP id="otp-code" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="m-0 text-body-sm text-fg-muted">Enter the code we sent to your device.</p>
    </div>
  );
}

export function Controlled() {
  const [value, setValue] = React.useState("");
  return (
    <div className="grid gap-2">
      <InputOTP maxLength={4} value={value} onChange={setValue} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} aria-label="Pairing code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <p className="m-0 text-body-sm text-fg-muted">{value ? `Pairing code: ${value.toUpperCase()}` : "Enter the pairing code shown in the desktop app."}</p>
    </div>
  );
}

export function States() {
  return (
    <div className="grid gap-4">
      <InputOTP maxLength={6} defaultValue="482913" aria-label="Complete">
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <InputOTP maxLength={6} defaultValue="4829" aria-invalid aria-label="Invalid">
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <InputOTP maxLength={6} defaultValue="48" disabled aria-label="Disabled">
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}

```

## Source

components/ui/input-otp.tsx

```tsx
"use client";

import * as React from "react";
import { OTPField } from "@base-ui/react/otp-field";
import { MinusIcon } from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";

// A one-time code field on Base UI's OTP field, drawn with the site's lines (extrapolated: the site has no fields):
// joined square 40px cells on the quiet rule, as the changelog filter joins its boxes (.cl-filter), each holding one
// 16px Kode Mono character in the ink. The cell with the caret takes the strong edge, 2px with an inset outline, and
// rises above its neighbors; nothing moves or grows. An invalid code turns every edge orange; a disabled one goes quiet
// with slate characters. Groups sit 8px apart around a 16px slate dash. Each cell is a real input, so typing,
// deleting, pasting a whole code, SMS autofill and arrow keys work; `pattern` picks digits, letters or both.
const REGEXP_ONLY_DIGITS = "^\\d+$";
const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";

const VALIDATION: Record<string, "numeric" | "alpha" | "alphanumeric"> = {
  [REGEXP_ONLY_DIGITS]: "numeric",
  [REGEXP_ONLY_CHARS]: "alpha",
  [REGEXP_ONLY_DIGITS_AND_CHARS]: "alphanumeric",
};

const InputOTPContext = React.createContext<{ length: number; invalid: boolean; className?: string }>({ length: 0, invalid: false });

type InputOTPProps = Omit<React.ComponentProps<typeof OTPField.Root>, "length" | "onChange" | "onValueChange" | "onValueComplete" | "className"> & {
  maxLength: number;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** One of REGEXP_ONLY_DIGITS (the default), REGEXP_ONLY_CHARS or REGEXP_ONLY_DIGITS_AND_CHARS; anything else allows every character. */
  pattern?: string;
  containerClassName?: string;
  /** Classes for every cell. */
  className?: string;
};

function InputOTP({ maxLength, onChange, onComplete, pattern = REGEXP_ONLY_DIGITS, validationType, containerClassName, className, children, ...props }: InputOTPProps) {
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true";
  return (
    <InputOTPContext.Provider value={{ length: maxLength, invalid, className }}>
      <OTPField.Root
        data-slot="input-otp"
        length={maxLength}
        validationType={validationType ?? VALIDATION[pattern] ?? "none"}
        onValueChange={onChange ? (value) => onChange(value) : undefined}
        onValueComplete={onComplete ? (value) => onComplete(value) : undefined}
        className={cn("group/input-otp flex items-center gap-2", containerClassName)}
        {...props}
      >
        {children}
      </OTPField.Root>
    </InputOTPContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />;
}

function InputOTPSlot({ index, className, ...props }: Omit<React.ComponentProps<typeof OTPField.Input>, "className"> & { index: number; className?: string }) {
  const context = React.useContext(InputOTPContext);
  return (
    <OTPField.Input
      data-slot="input-otp-slot"
      aria-label={index > 0 ? `Character ${index + 1} of ${context.length}` : undefined}
      aria-invalid={context.invalid || undefined}
      className={cn(
        "relative -ml-px size-10 min-w-0 border border-line bg-transparent p-0 text-center font-mono text-body leading-none text-fg caret-fg transition-[border-color] duration-fast ease-out first:ml-0 hover:z-10 hover:border-line-field focus:z-20 focus:border-line-strong focus:outline-1 focus:-outline-offset-2 focus:outline-line-strong aria-invalid:z-10 aria-invalid:border-danger aria-invalid:focus:outline-danger data-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:text-fg-subtle pointer-coarse:size-12 motion-reduce:transition-none",
        context.className,
        className,
      )}
      {...props}
    />
  );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<typeof OTPField.Separator>) {
  return (
    <OTPField.Separator data-slot="input-otp-separator" className={cn("flex items-center text-fg-subtle", className)} {...props}>
      <MinusIcon aria-hidden className="size-4" />
    </OTPField.Separator>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS };

```
