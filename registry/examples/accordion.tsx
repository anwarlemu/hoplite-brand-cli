"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Preview() {
  return (
    <Accordion defaultValue="usage" className="max-w-3xl">
      <AccordionItem value="usage">
        <AccordionTrigger>What counts as usage?</AccordionTrigger>
        <AccordionContent>
          Model tokens and sandbox time. Every plan includes some each month, per seat on paid plans. Beyond that, runs draw on prepaid credits you buy in Billing.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="limit">
        <AccordionTrigger>What happens when I reach a limit?</AccordionTrigger>
        <AccordionContent>Running threads finish their current step and pause. Add credits or move to a bigger plan and they pick up where they stopped.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="agents">
        <AccordionTrigger>How many agents run at once?</AccordionTrigger>
        <AccordionContent>Five concurrent cloud sessions on Free, twenty per seat on Team, and as many as you need on Enterprise.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="cancel">
        <AccordionTrigger>Can I switch plans or cancel?</AccordionTrigger>
        <AccordionContent>Any time, from Billing. Changes take effect at the next billing date, and unused credits stay on the workspace.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function Multiple() {
  return (
    <Accordion type="multiple" defaultValue={["sandboxes", "models"]} className="max-w-3xl">
      <AccordionItem value="sandboxes">
        <AccordionTrigger>Which sandbox sizes are there?</AccordionTrigger>
        <AccordionContent>From 2 vCPU with 8 GiB of memory up to 16 vCPU with 64 GiB, billed by the second.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="models">
        <AccordionTrigger>Which models can agents use?</AccordionTrigger>
        <AccordionContent>Every platform model on every plan. Bring your own subscription to run on your own limits.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="api" disabled>
        <AccordionTrigger>Does the Platform API cost extra?</AccordionTrigger>
        <AccordionContent>No. API runs draw on the same usage as threads started in the app.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function Compact() {
  return (
    <Accordion variant="compact" defaultValue="subagents" className="max-w-2xl">
      <AccordionItem value="subagents">
        <AccordionTrigger>Steer running subagents from your phone</AccordionTrigger>
        <AccordionContent>
          <p>Open a thread on mobile to see each subagent's step, send it a message, or stop it before it opens a pull request.</p>
          <p className="font-mono text-caption leading-line-caption font-normal tracking-code text-fg-muted">Oct 28 · Mobile</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="checks">
        <AccordionTrigger>Checks rerun when a sandbox restarts</AccordionTrigger>
        <AccordionContent>
          <p>A restarted sandbox now replays the last failing check before the agent continues, so the run never resumes on a stale result.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="seats">
        <AccordionTrigger>Seats can be moved between workspaces</AccordionTrigger>
        <AccordionContent>
          <p>Admins can move a seat from Billing without losing the member's threads or automations.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
