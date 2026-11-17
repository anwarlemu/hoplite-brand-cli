---
name: direction
title: Direction
type: ui
surface: site
description: "Sets the reading direction (ltr or rtl) for every Base UI part inside it, so tabs, menus, sliders and scroll areas flip for right-to-left text. It draws nothing of its own."
use_for: "Wrap an app or a region whose text reads right to left in DirectionProvider with dir=\"rtl\", and set dir=\"rtl\" on the element it wraps too so the page's own layout flips with it."
never: [Flipping layout with transforms, Setting the provider without the matching dir attribute, Mirroring icons that do not point]
source: "Extrapolated from the Hoplite website: a wrapper around Base UI's DirectionProvider with no look of its own"
---
