---
name: menubar
title: Menubar
type: ui
surface: site
kinds: [menu-panel, menu-item]
description: "A 40px bar framed by the quiet line holding bare 14px graphite labels; under the pointer or while open, a compact hexagon of the hover wash appears behind a label and it turns ink. Each label opens the dropdown menu's square ground panel aligned to its start, and moving along the bar opens the neighbors."
use_for: "Use for the app menu of a desktop-like tool (Thread, Edit, View, Help) where each menu holds commands with shortcuts. Build each with MenubarMenu, MenubarTrigger and MenubarContent, and the rows with the same parts as Dropdown Menu. For site navigation use Navigation Menu instead."
never: [Pill or square triggers, An ink-filled trigger, Rounded panels, More than five menus, Site navigation links in a menubar]
source: "The Hoplite website's header nav items (.hn__list, .hn__top: bare labels with a compact hexagon of the hover fill) and its popups (.hn__sheet, .hn__item); the bar itself is extrapolated."
---
