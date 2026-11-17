---
name: combobox
title: Combobox
type: ui
surface: site
kinds: [input, menu-panel, menu-item]
description: "A searchable choice: the square 40px field you type into (or a field button whose list holds its own search row), opening the site's square popup with 36px rows, the highlighted row on the hover wash and a check at the end of each chosen row; several values sit in the field as outlined hexagon chips."
use_for: "Use instead of Select when there are more than about fifteen choices or people know what they want (a repository, an agent, a branch or pull request). Pass items to Combobox and render rows with a function in ComboboxList; put ComboboxEmpty beside it. Type in ComboboxInput (showClear adds a clear key), or use ComboboxTrigger with ComboboxValue and put ComboboxInput inside ComboboxContent for a search row. For several values use multiple with ComboboxChips, ComboboxChip and ComboboxChipsInput, and pass useComboboxAnchor's ref to ComboboxContent. Group with ComboboxGroup, ComboboxLabel and ComboboxCollection. Built on Base UI Combobox."
never: [A combobox for five or fewer choices (use Select or a radio group), Rounded fields or chips, Animating the highlight between rows, A list without an empty state, Orange chips]
source: "Extrapolated from the Hoplite website: the field lines and 14px controls, the nav popup (.hn__panel, .hn__item) and the outlined tag hexagon (.tag)"
---
