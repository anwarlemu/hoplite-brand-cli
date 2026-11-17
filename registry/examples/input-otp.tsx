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
