---
name: navigation-menu
title: Navigation Menu
type: ui
surface: site
description: "The site's header nav: bare 14px graphite triggers with a 12px chevron that turns over, a compact hexagon of the hover wash behind the open one, and a full-width square sheet of the ground under the bar, ruled off by the quiet line. Links are rows of a 20px glyph, a 14px medium label and a quiet line, the row under the pointer on the paper; groups sit under Kode Mono eyebrows divided by dashed rules."
use_for: "Use for a site's main navigation when a section needs a panel of links (Product, Use cases, Resources). Give each NavigationMenuItem a value, put rows of NavigationMenuLink inside NavigationMenuContent, and divide groups with ds-rule-y under a ds-label heading. A plain link in the bar takes navigationMenuTriggerStyle(). Let the menu span the header so its sheet spans the page."
never: [A floating rounded panel, Pill or ink triggers, An icon that moves on hover, Panels that need scrolling on desktop, More than five triggers]
source: "The Hoplite website's header nav (.hn__list, .hn__top, .hn__chevron, .hn__sheet, .hn__panel, .hn__group, .hn__heading, .hn__item, .hn__item-label, .hn__item-body)"
---
