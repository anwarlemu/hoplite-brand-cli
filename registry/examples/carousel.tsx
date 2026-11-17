"use client";

import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const AUTOMATIONS = [
  { label: "On a schedule", name: "Sentry triage", text: "Picks up new errors every night and opens a pull request with a failing test and a fix." },
  { label: "On a check", name: "Flaky test hunter", text: "Reruns a failing check on main, finds the flaky test and quarantines it." },
  { label: "On a label", name: "Dependency bumps", text: "Updates a package when its pull request is labeled, then runs the full suite." },
  { label: "On a comment", name: "Review follow-up", text: "Applies the changes a reviewer asks for and pushes them to the same branch." },
  { label: "On a release", name: "Changelog writer", text: "Drafts the release notes from the merged pull requests since the last tag." },
];

function Slide({ label, name, text }: { label: string; name: string; text: string }) {
  return (
    <div className="grid h-44 content-start gap-2 border border-line p-5">
      <p className="ds-label m-0">{label}</p>
      <p className="m-0 font-display text-h5 leading-title font-light text-fg">{name}</p>
      <p className="m-0 text-body-sm leading-line-body-sm text-fg-secondary">{text}</p>
    </div>
  );
}

export function Preview() {
  return (
    <div className="mx-auto w-full max-w-sm px-12">
      <Carousel>
        <CarouselContent>
          {AUTOMATIONS.map((a) => (
            <CarouselItem key={a.name}>
              <Slide {...a} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="mx-auto w-full max-w-2xl px-12">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {AUTOMATIONS.map((a) => (
            <CarouselItem key={a.name} className="sm:basis-1/2">
              <Slide {...a} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="mx-auto w-full max-w-xs py-12">
      <Carousel orientation="vertical">
        <CarouselContent className="h-48">
          {AUTOMATIONS.map((a) => (
            <CarouselItem key={a.name}>
              <Slide {...a} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
