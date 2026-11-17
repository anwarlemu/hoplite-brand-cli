---
name: toast
title: Toast
type: ui
surface: site
kinds: [popover-panel]
description: "shadcn's older toast API on Base UI's toast, with the Sonner look: a square ground panel with the floating shadow, a 14px medium title over a quiet description, a compact outlined hexagon action and a ghost close glyph. Destructive toasts lead with the orange warning glyph."
use_for: "Prefer Sonner for new work. Use this when an app already calls useToast or toast({ title, description, action }) from shadcn's toast: mount Toaster once, pass a ToastAction with altText as the action, variant=\"destructive\" for a failure, or type success, warning, info or loading for a glyph."
never: [Red or orange panels, Rounded toasts, More than one action, Toasts that never time out for routine news]
source: "Extrapolated from the Hoplite website's popups (the nav sheet and menus, .hn__): the square ground panel with its hairline and long cast, and its compact keys (.button--s)"
---
