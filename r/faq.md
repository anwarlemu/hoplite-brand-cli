# FAQ
Questions and answers: the heading and lead in the left column and the accordion in the right, rows ruled by hairlines.

Install: npx hoplite-ds add faq
Requires: theme, accordion, typography, utils
Packages: none
Exports: Question, Faq
Client boundary: not required by this entry file
Reference: The Hoplite website's pricing page questions and its accordion rows


## Usage
Use near the end of the pricing or product page for the questions people ask before they sign up.
- Avoid: Every row open at once by default
- Avoid: Plus icons that rotate or move


## Examples
Example components: npx hoplite-ds add faq
[Preview](https://hoplite-ds.vercel.app/preview/faq/Preview)

examples/faq.tsx

```tsx
import { Faq } from "@/components/blocks/faq";

export function Preview() {
  return <Faq />;
}

```

## Source

components/blocks/faq.tsx

```tsx
import * as React from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TypographyH2, TypographyLead } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type Question = { question: string; answer: React.ReactNode };

const QUESTIONS: Question[] = [
  { question: "What counts as usage?", answer: "Model tokens and sandbox time. Every plan includes some each month, per seat on paid plans. Beyond that, runs draw on prepaid credits." },
  { question: "What happens when I reach a limit?", answer: "Running threads finish their current step and pause. Add credits or move to a bigger plan and they pick up where they stopped." },
  { question: "Can I bring my own model subscription?", answer: "Yes. Connect the subscription you already pay for and agents run on it, on every plan." },
  { question: "Can I switch plans or cancel?", answer: "Any time, from Billing. Changes take effect at the next billing date, and unused credits stay on the workspace." },
];

// Questions and answers as the pricing page sets them: the Chakra Petch heading and a lead in the left column, the
// accordion in the right (one column on a phone). Rows are ruled by hairlines and open one at a time.
function Faq({ title = "Questions, answered", lead = "Everything else is in the docs.", questions = QUESTIONS, className }: { title?: React.ReactNode; lead?: React.ReactNode; questions?: Question[]; className?: string }) {
  return (
    <section data-slot="faq" className={cn("w-full py-20 sm:py-32", className)}>
      <div className="mx-auto grid w-full max-w-320 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="grid content-start gap-6">
          <TypographyH2>{title}</TypographyH2>
          {lead && <TypographyLead>{lead}</TypographyLead>}
        </div>
        <Accordion defaultValue={questions[0]?.question}>
          {questions.map((q) => (
            <AccordionItem key={q.question} value={q.question}>
              <AccordionTrigger>{q.question}</AccordionTrigger>
              <AccordionContent>{q.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export { Faq };

```
