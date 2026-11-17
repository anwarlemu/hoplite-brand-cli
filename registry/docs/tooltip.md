---
name: tooltip
title: Tooltip
type: ui
surface: site
description: "A small square panel of the ink with 12px Satoshi in the ground color, 8px by 12px of air, 8px from its trigger. It waits 400ms the first time, then neighbors open at once; it only fades, and not at all between tooltips."
use_for: "Use to name an icon-only control (New thread, Open in terminal) or add one short line about a control. Wrap a toolbar in TooltipProvider so moving along it opens each tooltip at once. Use asChild or render on TooltipTrigger to attach it to a Button."
never: [Information found nowhere else, Interactive content, Rounded corners or an arrow, Text over two lines, A tooltip on a disabled control]
source: "Extrapolated from the Hoplite website's ink (the main key's fill, .button--primary) and its 12px labels; the site has no tooltips."
---
