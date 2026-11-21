"use client";

import * as React from "react";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// A row of slides that snap into place, extrapolated from the Hoplite website's keys and marks: slides scroll natively
// (touch, trackpad and wheel) and snap; the previous and next keys are 32px outlined hexagons (the outline icon key,
// a 1px strong edge around the ground that fills with the hover wash) holding a 16px arrow, 48px outside the row, and
// they turn the quiet line and slate when there is nowhere to go. CarouselDots is the row of point-up hexagon marks
// (the site's bullets): 8px marks in the field line, the current one ink, each in a 24px target that turns the strong
// line under the pointer (160ms). Arrow keys move a slide when the carousel has focus. The scroll is smooth (the
// browser's own easing) unless reduced motion is set, then it jumps.
type CarouselEvent = "select" | "reInit";
type CarouselApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: CarouselEvent, callback: (api: CarouselApi) => void) => void;
  off: (event: CarouselEvent, callback: (api: CarouselApi) => void) => void;
};
type CarouselOptions = { loop?: boolean; align?: "start" | "center" | "end" };

type CarouselProps = {
  opts?: CarouselOptions;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  viewport: React.RefObject<HTMLDivElement | null>;
  orientation: "horizontal" | "vertical";
  align: "start" | "center" | "end";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  index: number;
  count: number;
  scrollTo: (index: number) => void;
  update: () => void;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}

function Carousel({ orientation = "horizontal", opts, setApi, className, children, ...props }: React.ComponentProps<"div"> & CarouselProps) {
  const viewport = React.useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = React.useState({ prev: false, next: false, index: 0, count: 0 });
  const listeners = React.useRef<Record<CarouselEvent, Set<(api: CarouselApi) => void>>>({ select: new Set(), reInit: new Set() });
  const vertical = orientation === "vertical";
  const loop = !!opts?.loop;

  const slides = React.useCallback(() => Array.from(viewport.current?.querySelectorAll<HTMLElement>(":scope > [data-slot=carousel-content] > [data-slot=carousel-item]") ?? []), []);
  const offsetOf = React.useCallback((el: HTMLElement) => (vertical ? el.offsetTop : el.offsetLeft), [vertical]);
  const current = React.useCallback(() => {
    const el = viewport.current;
    if (!el) return 0;
    const pos = vertical ? el.scrollTop : el.scrollLeft;
    const list = slides();
    let best = 0;
    list.forEach((s, i) => {
      if (Math.abs(offsetOf(s) - pos) < Math.abs(offsetOf(list[best]) - pos)) best = i;
    });
    return best;
  }, [offsetOf, slides, vertical]);

  const scrollTo = React.useCallback((index: number) => {
    const el = viewport.current;
    const list = slides();
    if (!el || !list.length) return;
    const i = loop ? (index + list.length) % list.length : Math.max(0, Math.min(list.length - 1, index));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ [vertical ? "top" : "left"]: offsetOf(list[i]), behavior: reduce ? "auto" : "smooth" });
  }, [loop, offsetOf, slides, vertical]);

  const api = React.useMemo<CarouselApi>(() => {
    const self: CarouselApi = {
      scrollPrev: () => scrollTo(current() - 1),
      scrollNext: () => scrollTo(current() + 1),
      scrollTo,
      canScrollPrev: () => {
        const el = viewport.current;
        return !!el && (loop || (vertical ? el.scrollTop : el.scrollLeft) > 1);
      },
      canScrollNext: () => {
        const el = viewport.current;
        if (!el) return false;
        return loop || (vertical ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
      },
      selectedScrollSnap: current,
      scrollSnapList: () => slides().map((_, i) => i),
      on: (event, cb) => void listeners.current[event].add(cb),
      off: (event, cb) => void listeners.current[event].delete(cb),
    };
    return self;
  }, [current, loop, scrollTo, slides, vertical]);

  const update = React.useCallback(() => {
    const next = { prev: api.canScrollPrev(), next: api.canScrollNext(), index: api.selectedScrollSnap(), count: slides().length };
    setEdges((e) => {
      if (e.index !== next.index) listeners.current.select.forEach((cb) => cb(api));
      return e.prev === next.prev && e.next === next.next && e.index === next.index && e.count === next.count ? e : next;
    });
  }, [api, slides]);

  React.useEffect(() => {
    setApi?.(api);
    const el = viewport.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(() => {
      update();
      listeners.current.reInit.forEach((cb) => cb(api));
    });
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [api, setApi, update]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const back = vertical ? "ArrowUp" : "ArrowLeft";
    const forward = vertical ? "ArrowDown" : "ArrowRight";
    if (event.key === back) {
      event.preventDefault();
      api.scrollPrev();
    } else if (event.key === forward) {
      event.preventDefault();
      api.scrollNext();
    }
  };

  return (
    <CarouselContext.Provider value={{ viewport, orientation, align: opts?.align ?? "start", scrollPrev: api.scrollPrev, scrollNext: api.scrollNext, canScrollPrev: edges.prev, canScrollNext: edges.next, index: edges.index, count: edges.count, scrollTo, update }}>
      <div onKeyDownCapture={onKeyDown} className={cn("relative", className)} role="region" aria-roledescription="carousel" data-slot="carousel" data-orientation={orientation} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { viewport, orientation } = useCarousel();
  const vertical = orientation === "vertical";
  return (
    <div
      ref={viewport}
      data-slot="carousel-viewport"
      className={cn("relative overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", vertical ? "h-full snap-y snap-mandatory fade-y" : "snap-x snap-mandatory fade-x")}
    >
      <div data-slot="carousel-content" className={cn("flex", vertical ? "-mb-4 flex-col" : "-mr-4", className)} {...props} />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation, align } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pr-4" : "pb-4", align === "center" ? "snap-center" : align === "end" ? "snap-end" : "snap-start", className)}
      {...props}
    />
  );
}

function CarouselPrevious({ className, ...props }: Omit<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      data-slot="carousel-previous"
      variant="outline"
      size="icon-sm"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn("absolute", orientation === "horizontal" ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2", className)}
      {...props}
    >
      {orientation === "horizontal" ? <ArrowLeftIcon /> : <ArrowUpIcon />}
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({ className, ...props }: Omit<React.ComponentProps<typeof Button>, "variant" | "size">) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant="outline"
      size="icon-sm"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn("absolute", orientation === "horizontal" ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2", className)}
      {...props}
    >
      {orientation === "horizontal" ? <ArrowRightIcon /> : <ArrowDownIcon />}
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

/** One point-up hexagon mark per slide; the current slide's is ink. Each mark is a button that scrolls to its slide. */
function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { index, count, scrollTo } = useCarousel();
  return (
    <div data-slot="carousel-dots" className={cn("flex items-center justify-center gap-1 pt-4", className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          data-slot="carousel-dot"
          data-active={i === index || undefined}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => scrollTo(i)}
          className="group/dot grid size-6 cursor-pointer place-items-center focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring data-active:cursor-default"
        >
          <span className="ds-hex-mark size-2 bg-line-field transition-colors duration-base ease-out group-hover/dot:bg-line-strong group-data-active/dot:bg-primary motion-reduce:transition-none" />
        </button>
      ))}
    </div>
  );
}

export { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, useCarousel };
export type { CarouselApi };
