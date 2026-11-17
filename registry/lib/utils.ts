import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The brand's scales have their own names (text-body-sm, rounded-control, shadow-s). Without teaching tailwind-merge,
// it reads text-body-sm as a text color and drops the real color beside it, and keeps a default rounded-md next to a
// brand radius meant to replace it. Brand text sizes do not set line height: keep explicit leading in either order.
const twMerge = extendTailwindMerge<"brand-font-size">({
  extend: {
    theme: {
      leading: ["tight", "display", "heading", "title", "snug", "body", "relaxed", "prose", "code", "line-body", "line-body-sm", "line-caption"],
      tracking: ["normal", "tight", "caps", "code"],
      radius: ["xs", "sm", "control", "panel", "dialog", "pill"],
      shadow: ["s", "line", "card", "floating", "dialog", "cast", "knob", "focus"],
    },
    classGroups: {
      "brand-font-size": [{ text: ["display", "h1", "h2", "h3", "h4", "h5", "body-lg", "body", "body-sm", "caption", "micro"] }],
    },
    conflictingClassGroups: {
      "brand-font-size": ["font-size"],
      "font-size": ["brand-font-size"],
    },
    conflictingClassGroupModifiers: { "brand-font-size": ["leading"] },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `asChild` for a Base UI part: the one child element becomes the rendered element (Base UI's `render`), keeping its
 * own children, so `<Button asChild><a href="/docs">Docs</a></Button>` renders the link with the button's look.
 */
export function slot<R>(asChild: boolean | undefined, children: React.ReactNode, render?: R): { render: R | React.ReactElement | undefined; children: React.ReactNode } {
  if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) return { render: children, children: children.props.children };
  return { render, children };
}
