---
name: date-picker
title: Date picker
type: ui
surface: site
kinds: [input, popover-panel]
description: "The square 40px field with a calendar glyph and a caret, opening the calendar in the site's square popup; presets sit in a column of 36px rows beside it, and a range picker shows two months."
use_for: "Use DatePicker for one date in a form (a token's expiry, when an automation runs) and DateRangePicker for a period (usage, a log). Control them with value and onValueChange; pass presets for common choices and calendar for disabled days, the first day of the week or today. Give it a label (id) or aria-label; name submits the date as YYYY-MM-DD (a range as nameFrom and nameTo). Built on Base UI Popover and the Calendar item."
never: [Rounded fields or panels, A native date input beside it, An orange chosen day, A calendar that stays open after a single date is picked]
source: "Extrapolated from the Hoplite website: the field lines and 14px controls, the nav popup (.hn__panel, .hn__item) and the Calendar item"
---
