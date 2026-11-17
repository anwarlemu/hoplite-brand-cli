---
name: button-group
title: Button Group
type: ui
surface: site
kinds: [button-primary, button-secondary]
description: "Keys joined into one control: one hexagon cut into segments with square joins. The split key is one ink hexagon with a hairline between the action and its caret; outlined keys share their strong edges like a segmented choice; a field can open a group and the key after it squares off to meet it."
use_for: "Use a ButtonGroup for a split action (Squash and merge with a caret for the other merge methods: Button, ButtonGroupSeparator, an icon Button), for two to four related outlined actions, for a stepper (minus, ButtonGroupText with the count, plus), or for a field with its action (Input then an outline Button). Keep every key in a group the same variant and size. orientation=\"vertical\" stacks whole keys 4px apart."
never: [Mixing ink and outlined keys in one group, Two ink groups in a view, Hexagon points between joined keys, Square or rounded segments at the ends]
source: "The Hoplite website's product window split key (.pa-merge, .pa-merge__main, .pa-merge__more: Squash and merge) redrawn on its hexagonal keys (.button, .button--primary, .button--line), and its segmented choice (.pr-period)"
---
