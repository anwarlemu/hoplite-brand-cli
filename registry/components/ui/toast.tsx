"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { CheckCircleIcon, InfoIcon, SpinnerGapIcon, WarningCircleIcon, WarningIcon, XIcon } from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";
import { usePortalContainer } from "@/lib/surface";

// The Base UI toast behind shadcn's older toast API (prefer Sonner for new work), with the same look as the Sonner
// toasts, extrapolated from the Hoplite website's popups: a square 360px panel of the ground with the floating shadow
// and 16px of padding, an optional 16px Phosphor status glyph, the 14px medium ink title over the 14px quiet
// description, the action as the compact outlined hexagon (32px, 8px cuts) and the close key a ghost glyph whose
// compact hexagon of the hover wash appears under the pointer. `destructive` leads with the orange warning glyph and
// makes its action orange. Toasts stack 12px apart at the bottom right, the ones behind tucked under the front one
// until the pointer or focus opens the stack; they rise from the bottom edge in 240ms on the strong ease-out and leave
// the same way in 200ms (a swipe right or down throws them out). Reduced motion keeps only the fade.
const toastManager = BaseToast.createToastManager();

type ToastVariant = "default" | "destructive";
type ToastType = ToastVariant | "success" | "error" | "warning" | "info" | "loading";
type ToastActionElement = React.ReactElement<React.ComponentProps<typeof ToastAction>>;
type ToastData = { action?: ToastActionElement };
type ToastInput = { title?: React.ReactNode; description?: React.ReactNode; action?: ToastActionElement; variant?: ToastVariant; type?: ToastType; duration?: number; onOpenChange?: (open: boolean) => void };

const GLYPHS: Partial<Record<ToastType, React.ReactNode>> = {
  destructive: <WarningCircleIcon className="size-4 text-danger" />,
  error: <WarningCircleIcon className="size-4 text-danger" />,
  success: <CheckCircleIcon className="size-4 text-success" />,
  warning: <WarningIcon className="size-4 text-warning" />,
  info: <InfoIcon className="size-4 text-fg-muted" />,
  loading: <SpinnerGapIcon className="size-4 animate-spin text-fg-muted motion-reduce:animate-none" />,
};

/** Holds the toasts. The Toaster brings its own; mount one yourself only to build a custom viewport. */
function ToastProvider({ toastManager: manager = toastManager, ...props }: React.ComponentProps<typeof BaseToast.Provider>) {
  return <BaseToast.Provider toastManager={manager} {...props} />;
}

function ToastViewport({ className, ...props }: React.ComponentProps<typeof BaseToast.Viewport>) {
  return (
    <BaseToast.Portal container={usePortalContainer()}>
      <BaseToast.Viewport
        data-slot="toast-viewport"
        className={cn("fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] outline-none sm:right-6 sm:bottom-6 sm:w-90", className)}
        {...props}
      />
    </BaseToast.Portal>
  );
}

const ROOT =
  "[--gap:12px] [--peek:12px] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] " +
  "absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] h-(--height) w-full origin-bottom bg-surface font-sans text-fg shadow-floating select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring " +
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] " +
  "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))] " +
  "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] " +
  "data-starting-style:opacity-0 data-starting-style:[transform:translateY(150%)] data-limited:opacity-0 data-ending-style:opacity-0 " +
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)] " +
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] " +
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] " +
  "transition-[transform,opacity,height] duration-slow ease-out data-ending-style:duration-moderate motion-reduce:transition-opacity";

function Toast({ className, variant, children, ...props }: React.ComponentProps<typeof BaseToast.Root> & { variant?: ToastVariant }) {
  return (
    <BaseToast.Root data-slot="toast" data-variant={variant ?? props.toast.type ?? "default"} swipeDirection={["down", "right"]} className={cn("group/toast", ROOT, className)} {...props}>
      <BaseToast.Content data-slot="toast-content" className="flex h-full items-start gap-3 overflow-hidden p-4 transition-opacity duration-slow ease-out data-behind:opacity-0 data-expanded:opacity-100 motion-reduce:transition-none">
        {children}
      </BaseToast.Content>
    </BaseToast.Root>
  );
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof BaseToast.Title>) {
  return <BaseToast.Title data-slot="toast-title" className={cn("m-0 text-body-sm leading-line-body-sm font-medium text-fg", className)} {...props} />;
}

function ToastDescription({ className, ...props }: React.ComponentProps<typeof BaseToast.Description>) {
  return <BaseToast.Description data-slot="toast-description" className={cn("m-0 text-body-sm leading-line-body-sm text-fg-muted", className)} {...props} />;
}

/** The toast's action: the compact outlined hexagon. `altText` names it for screen readers, as in shadcn's API. */
function ToastAction({ className, altText, ...props }: React.ComponentProps<typeof BaseToast.Action> & { altText?: string }) {
  return (
    <BaseToast.Action
      data-slot="toast-action"
      aria-label={altText}
      className={cn(
        "ds-hex-frame-s inline-flex h-8 shrink-0 cursor-pointer items-center justify-center self-center px-4 font-sans text-body-sm leading-none font-medium whitespace-nowrap text-fg transition-colors duration-base ease-out before:bg-line-strong after:bg-surface hover:after:bg-subtle-hover active:after:bg-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring group-data-[variant=destructive]/toast:text-danger motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({ className, ...props }: React.ComponentProps<typeof BaseToast.Close>) {
  return (
    <BaseToast.Close
      data-slot="toast-close"
      aria-label="Close"
      className={cn(
        "ds-hex-frame-s -my-1 -mr-2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-fg-muted transition-colors duration-base ease-out hover:text-fg hover:before:bg-subtle-hover active:before:bg-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <XIcon className="size-4" />
    </BaseToast.Close>
  );
}

/** Shows a toast from anywhere, inside or outside React. Returns its id, `dismiss` and `update`. */
function toast({ title, description, action, variant, type, duration, onOpenChange }: ToastInput) {
  const id = toastManager.add<ToastData>({ title, description, type: type ?? variant, timeout: duration, data: { action }, onClose: onOpenChange ? () => onOpenChange(false) : undefined });
  return {
    id,
    dismiss: () => toastManager.close(id),
    update: (next: Omit<ToastInput, "onOpenChange">) => toastManager.update<ToastData>(id, { title: next.title, description: next.description, type: next.type ?? next.variant, data: next.action ? { action: next.action } : undefined }),
  };
}

function dismiss(id?: string) {
  toastManager.close(id);
}

function useToast() {
  return { toast, dismiss };
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((item) => {
    const glyph = item.type ? GLYPHS[item.type as ToastType] : undefined;
    const action = (item.data as ToastData | undefined)?.action;
    return (
      <Toast key={item.id} toast={item}>
        {glyph && <span className="flex h-5 w-4 shrink-0 items-center justify-center">{glyph}</span>}
        <div className="grid min-w-0 flex-1 gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        {action}
        <ToastClose />
      </Toast>
    );
  });
}

/** Renders the queue. Mount it once, near the root; call toast() from anywhere. */
function Toaster({ limit = 3, timeout = 5000 }: { limit?: number; timeout?: number }) {
  return (
    <ToastProvider limit={limit} timeout={timeout}>
      <ToastViewport>
        <ToastList />
      </ToastViewport>
    </ToastProvider>
  );
}

type ToastProps = React.ComponentProps<typeof Toast>;

export { Toast, ToastAction, ToastClose, ToastDescription, Toaster, ToastProvider, ToastTitle, ToastViewport, dismiss, toast, useToast };
export type { ToastActionElement, ToastProps };
