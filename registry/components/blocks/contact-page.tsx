"use client";

import * as React from "react";

import { Footer } from "@/components/blocks/footer";
import { SiteHeader } from "@/components/blocks/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { TypographyDisplay, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type Channel = { label: string; value: string; href: string };

const CHANNELS: Channel[] = [
  { label: "Sales", value: "sales@acme.com", href: "mailto:sales@acme.com" },
  { label: "Support", value: "support@acme.com", href: "mailto:support@acme.com" },
  { label: "Security", value: "security@acme.com", href: "mailto:security@acme.com" },
];

// The contact page: the display heading and lead at the left with each channel as a mono label over its address on
// dashed rows, and the form at the right in a stone frame (name, work email, topic, message) ending in the ink hexagon.
// The form only calls `onSubmit`; wire it to your own endpoint.
function ContactPage({ channels = CHANNELS, onSubmit, className }: { channels?: Channel[]; onSubmit?: (data: FormData) => void; className?: string }) {
  return (
    <div data-slot="contact-page" className={cn("bg-surface text-fg", className)}>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-320 gap-16 pt-20 pb-20 sm:pt-32 lg:grid-cols-2">
        <div className="grid content-start gap-6">
          <TypographyDisplay>Talk to the team.</TypographyDisplay>
          <TypographyLead>Questions about plans, security reviews or a pilot for your organization. We answer within a working day.</TypographyLead>
          <ul className="m-0 mt-6 grid list-none p-0">
            {channels.map((c) => (
              <li key={c.label} className="ds-rule-x grid gap-1 py-4">
                <span className="ds-label">{c.label}</span>
                <a href={c.href} className="w-fit text-body leading-line-body text-fg transition-colors duration-base ease-out hover:text-fg-secondary motion-reduce:transition-none">
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Card className="sm:p-10">
          <form
            className="grid gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.(new FormData(e.currentTarget));
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input name="name" autoComplete="name" required />
              </Field>
              <Field>
                <FieldLabel>Work email</FieldLabel>
                <Input name="email" type="email" autoComplete="email" placeholder="you@acme.com" required />
              </Field>
              <Field>
                <FieldLabel>Topic</FieldLabel>
                <NativeSelect name="topic" defaultValue="sales">
                  <NativeSelectOption value="sales">Plans and pricing</NativeSelectOption>
                  <NativeSelectOption value="security">Security review</NativeSelectOption>
                  <NativeSelectOption value="support">Support</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel>Message</FieldLabel>
                <Textarea name="message" rows={5} placeholder="Tell us about your team and what your agents should do." />
              </Field>
            </FieldGroup>
            <Button type="submit" className="w-fit">
              Send message
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export { ContactPage };
