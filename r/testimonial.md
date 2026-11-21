# Testimonial
A quote in Chakra Petch light inside corner ticks, an orange opening mark and the attribution as a mono label: a role and a company, never an invented person.

Install: npx hoplite-ds add testimonial
Requires: theme, utils
Packages: none
Exports: Testimonial
Client boundary: not required by this entry file
Reference: The Hoplite website's frames and type (.band__frame, .heading); the site carries no customer quotes of its own


## Usage
Use one per page between feature sections. Quote real customers with permission; otherwise keep the Acme placeholder.
- Avoid: Invented names or photos of people
- Avoid: Star ratings
- Avoid: More than one quote mark in orange


## Examples
Example components: npx hoplite-ds add testimonial
[Preview](https://hoplite-ds.vercel.app/preview/testimonial/Preview)

examples/testimonial.tsx

```tsx
import { Testimonial } from "@/components/blocks/testimonial";

export function Preview() {
  return <Testimonial />;
}

```

## Source

components/blocks/testimonial.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

// A quote in the site's voice: set in Chakra Petch light at heading size inside a frame of corner ticks, an opening
// quote mark in the orange (the one mark), and the attribution as a mono label under a dashed rule. The site carries no
// customer quotes of its own: use a role and a company you have permission to name, never an invented person.
function Testimonial({
  quote = "We hand the agents a backlog on Friday and review green pull requests on Monday. Nobody babysits a terminal anymore.",
  role = "Head of platform",
  company = "Acme",
  className,
}: {
  quote?: React.ReactNode;
  role?: string;
  company?: string;
  className?: string;
}) {
  return (
    <section data-slot="testimonial" className={cn("w-full py-20 sm:py-32", className)}>
      <figure className="ds-corners mx-auto m-0 grid w-full max-w-320 gap-10 p-8 sm:p-16">
        <blockquote className="m-0 grid max-w-240 gap-4">
          <span aria-hidden className="font-display text-h2 leading-none font-light text-fg-accent">“</span>
          <p className="m-0 font-display text-h4 leading-8 font-light text-balance text-fg sm:text-h3 sm:leading-10">{quote}</p>
        </blockquote>
        <figcaption className="ds-rule-x ds-label w-fit pb-2">
          {role}, {company}
        </figcaption>
      </figure>
    </section>
  );
}

export { Testimonial };

```
