---
name: button
title: Button
type: ui
surface: site
description: "The hexagonal key: the 40px ink hexagon for the main action, the outlined hexagon for the second, a hexagon of the hover wash, a bare nav label whose compact hexagon appears under the pointer, and the underlined link. 32px keys cut their ends 8px; every key presses in to 0.97 the instant it is pressed."
use_for: "Use one default (ink hexagon) button per view for the main action (Start building), outline for the action beside it (Download for macOS), secondary for a quieter action inside content, ghost for nav items and toolbar glyphs, and link for an inline action in text. size sm is the 32px header key. Use type=\"submit\" in forms, or asChild (or render) with a link for navigation. A glyph goes before the label at 16px (Phosphor, regular weight)."
never: [Two ink hexagons side by side, A rounded or square key, An orange fill, Bold or caps labels, An icon that moves on hover, A half-opacity disabled key]
source: "The Hoplite website's .button, .button--primary, .button--line and .button--s (hoplite-website-fawn.vercel.app: Start building, Download for macOS, Start team, Start free) and its nav items (.hn__top)"
---
