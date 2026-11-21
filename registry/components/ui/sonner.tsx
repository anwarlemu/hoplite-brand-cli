"use client";

import * as React from "react";
import { CheckCircleIcon, InfoIcon, SpinnerGapIcon, WarningCircleIcon, WarningIcon, XIcon } from "@phosphor-icons/react/ssr";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// Toasts, extrapolated from the Hoplite website's popups (the nav's sheet and menus): a square 360px panel of the
// ground with the floating shadow (a quiet hairline and a long soft cast) and 16px of padding. A 16px Phosphor status
// glyph leads (a check in green, a warning in amber, an error in orange, info in the quiet gray, a turning loader),
// then the 14px medium ink title over the 14px quiet description. The action is the compact ink hexagon (32px, 8px
// cuts) and cancel the compact outlined one; the close key is a ghost glyph at the top right whose compact hexagon of
// the hover wash appears under the pointer. The stack sits 24px in from the bottom right. Sonner stacks, swipes and
// times them; its motion is retimed to the brand's: toasts rise in 240ms on the strong ease-out and leave in 200ms,
// and reduced motion turns it off.
const KEY = "ds-hex-frame-s inline-flex h-8 shrink-0 cursor-pointer items-center justify-center px-4 font-sans text-body-sm leading-none font-medium whitespace-nowrap transition-colors duration-base ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none";

function Toaster({ toastOptions, closeButton, offset = 24, mobileOffset = 16, ...props }: ToasterProps) {
  return (
    <Sonner
      data-slot="sonner"
      className="toaster group font-sans duration-slow! ease-out!"
      closeButton={closeButton}
      offset={offset}
      mobileOffset={mobileOffset}
      gap={12}
      icons={{
        success: <CheckCircleIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-fg-muted" />,
        warning: <WarningIcon className="size-4 text-warning" />,
        error: <WarningCircleIcon className="size-4 text-danger" />,
        loading: <SpinnerGapIcon className="size-4 animate-spin text-fg-muted motion-reduce:animate-none" />,
        close: <XIcon className="size-4" />,
      }}
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: {
          toast:
            "group/toast flex w-(--width) items-start gap-3 bg-surface p-4 font-sans text-fg shadow-floating duration-slow! ease-out! focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring data-[removed=true]:duration-moderate! data-[expanded=false]:data-[front=false]:[&>*]:opacity-0 [&>*]:duration-slow! [&>*]:ease-out!",
          icon: "flex h-6 w-4 shrink-0 items-center justify-center",
          content: "grid min-w-0 flex-1 gap-1 pr-8 group-has-data-button/toast:pr-0",
          title: "text-body-sm leading-line-body-sm font-medium text-fg",
          description: "max-h-40 overflow-y-auto fade-y text-body-sm leading-line-body-sm text-fg-muted whitespace-pre-line wrap-anywhere",
          actionButton: `${KEY} self-center group-has-data-close-button/toast:last:mr-8 text-on-primary before:bg-primary hover:before:bg-primary-hover active:before:bg-primary-hover`,
          cancelButton: `${KEY} self-center group-has-data-close-button/toast:last:mr-8 text-fg before:bg-line-strong after:bg-surface hover:after:bg-subtle-hover active:after:bg-pressed`,
          closeButton:
            "ds-hex-frame-s absolute! top-3 right-3 inline-flex size-8 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-base ease-out hover:text-fg hover:before:bg-subtle-hover active:before:bg-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none",
          ...toastOptions?.classNames,
        },
      }}
      style={{ "--width": "22.5rem" } as React.CSSProperties}
      {...props}
    />
  );
}

export { Toaster };
