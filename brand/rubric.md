# Review rubric

Score a restyled screen against the reference screenshots (the Hoplite website's own pages) and the principles. The screen
keeps its own copy, elements and purpose; judge only how it looks and how usable it is. Scores 0 to 10: 7 is
shippable, 9 matches the reference in quality, 5 is generic. Be consistent: the same screen with the same problems
gets the same scores. When a previous punch list is given, check each item first and say whether it is fixed.

## Same composition (blocker when broken)
When "before" images are given (the screen right after the automatic conversion, before any hand edits), compare
the layout: every element is still there, at the same size relative to its neighbors, in the same place in the
arrangement. Nothing enlarged to fill space or shrunk, no floating piece moved over the content it used to frame, no
image or effect lost. Colors and type are expected to change; sizes, proportions and overlaps are not. Report any
break as a blocker naming the element.

## Purpose (score: hierarchy)
Say in one line what the screen is for. Its main action is the most prominent thing (one ink hexagon), its key
information is easy to find and scan, and the restyle did not bury, flatten or reorder anything.

## One system (score: coherence)
Every section uses the same few parts: the same hexagonal keys, square fields, ruled lists, line frames with corner
ticks, square popups, spacing rhythm (4px steps) and type scale. Nothing left from the old look: an old accent color or
font, pure black or white panels, rounded corners, pill or square buttons, drop shadows on cards, gray smudges where an
old shadow or fade was converted.

## Reads as Hoplite (score: brand_voice)
Compared side by side with the reference, does it look like the same product? The warm gray ground (#F2F2F0) and
near-black ink with gray steps for quieter text; Chakra Petch light headings, Satoshi text, Kode Mono capital labels;
an ink hexagon for the main action and outlined hexagons beside it; square frames and fields drawn with lines from the
ink; ruled tables and lists; the orange used only as a mark. Too little reads as a generic gray page (5 at most). Too
much is as wrong (5 at most): orange fills, hexagons on everything including frames, corner ticks on every box, bold
titles, gradients or glows.

## Common UX errors (score: detail_quality)
Flag each as a blocker or major:
- Text touching an edge or a card border; content without its 16px gutter on phones.
- Titles too big for a phone; body text under 13px.
- Spacing that collapsed or ballooned; uneven padding; misaligned columns; clipped or overlapping elements;
  horizontal scroll.
- A table that does not scroll inside its panel on a phone.
- Lines of body text wider than about 75 characters.

## Interaction review

Verify with a running page as well as screenshots. Rare celebrations may be expressive; frequent hover/list actions
use only subtle styling; keyboard shortcuts, command toggles and 100+ daily actions are instant. Hold a pointer down
and verify feedback before release. Compare dimensions, font weight and padding across states. Equivalent components
must use the same interaction treatment and size variant. Audit debounce/timeout/transition waits and tap delay;
remove nonessential input latency. Reduced motion must disable animations. Static screenshots cannot prove timing.

## Accessibility (score: accessibility)
Primary copy at least 4.5:1 (the ink and the graphite pass); the quiet gray (#626261) passes for notes; the slate is for
placeholders and decoration only. Touch targets at least 44px on phones. Visible focus. States not told apart by color alone.
