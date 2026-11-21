---
name: select
title: Select
type: ui
surface: site
kinds: [input, menu-panel, menu-item]
description: "The square 40px field with a caret, opening the site's popup: a square panel of the ground with a hairline and a long soft cast, 36px rows, the highlighted row on the hover wash and a check at the end of the chosen one. A long list fades at the edge it scrolls past (fade-y)."
use_for: "Use to choose one value from five to about fifteen (a model, a sandbox size, a base branch). Give it a label or aria-label and a placeholder when nothing is chosen; group long lists with SelectGroup and SelectLabel. Pass items (value and label) to Select, or write SelectItems as children and the trigger shows the chosen label. Give it a name so its value is in the form's FormData; size=\"sm\" is the 32px toolbar field. Built on Base UI Select."
never: [Rounded corners on the trigger or the list, A check at the start of a row, Animating the highlight between rows, An orange chosen row, A white list on the gray ground]
source: "Extrapolated from the Hoplite website: the field lines and 14px controls, and the nav popup (.hn__panel, .hn__item: rows on the hover wash, the quiet hairline)"
---
