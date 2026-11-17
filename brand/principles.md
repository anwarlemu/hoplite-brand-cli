# Hoplite: what good looks like

Read by `hoplite-ds review` every time, next to the reference screenshots in `brand/reference/` (the Hoplite
website's own pages). The website's stylesheets are kept in `brand/reference/site-css/` for re-measuring.

## The idea

Hoplite is a workstation for an army of coding agents. The name is the Greek foot soldier, and the site borrows his
discipline: a drafting-table page of warm gray paper and near-black ink, every frame squared and ruled, every action a
hexagon like a shield in the line. It reads like an engineering drawing that happens to be a website: precise, quiet,
confident, with one orange mark where something matters.

## The page

- One ground: warm gray paper (#F2F2F0) with a faint grain. The ink is near-black (#1A1A1A), never pure black. Leads and
  body copy under a title are a soft graphite (#323232); labels, notes and dates the quiet gray (#626261); placeholders
  the slate (#929291). Nothing sits on white: a card is a frame of lines on the same ground.
- Lines carry the structure, all drawn from the ink: a strong 70 percent edge around a hexagonal key, a 32 percent edge
  on a field or a card under the pointer, a quiet 16 percent rule between rows, around popups and under the header,
  and a stone (#C2C2C0) frame around a plan or a band. Section guides are dashed (10px dashes on an 18px period).
- Frames are square and marked at their corners: four 16px ticks in the slate, like crop marks. Product art sits
  inside them.
- The orange (#FF3616) is a mark, not a color scheme: the cog in a hexagon, a switch that is on, the one accent word
  in a headline (flat orange, no gradient, glow or texture), an error. Never a fill for a whole panel or a button.
- The dark theme is the night: the ink and the ground swap (#1A1A1A ground, #F2F2F0 ink) and the gray steps run the
  other way. Light is the default.

## Type

- Three faces, each with one job. Chakra Petch, light, for display and headings (64, 56, 44, 32, 24 and 20px, drawn
  1 percent tighter at display sizes). Satoshi for everything people read and press (18px leads in light, 16px body,
  14px controls and notes in regular or medium). Kode Mono for labels and code: 12px capitals tracked 8 percent for an
  eyebrow, a column head, a date or a category; code tracked 4 percent.
- Three weights: light (display, leads, prose), regular, medium (actions, names, nav items). Nothing is bold.
- Sizes are 12, 14, 16, 18 or a multiple of 4. Every space, size and line box is a multiple of 4 (or 6).
- Text is balanced in headings and pretty in paragraphs; leads stop at 600px, heads at 720px.

## Actions

- Every action is a hexagon: a box with both ends cut to a point, 12px deep (8px on a 32px key or a tag). The main
  action is the ink hexagon with a medium 14px label in the ground color (Start building); under the pointer it turns
  graphite. The second action is the outlined hexagon: a 1px strong edge around the ground, filling with the hover wash
  (Download for macOS). One ink hexagon per view.
- Keys are 40px with 24px sides (32px with 16px sides in a header or a toolbar, 48px on a touch screen). An icon sits
  8px from its label at 16px.
- A text link is the medium ink label over a quiet 1px rule, with an arrow after it (Read the quickstart →). Under the
  pointer the rule wipes out and a dashed rule wipes in and marches.
- Nav items are bare 14px labels in graphite; under the pointer or while their menu is open, a compact hexagon of the
  hover wash appears behind them and the label turns ink.
- Segmented choices (Monthly, Yearly) are an outlined hexagon holding compact hexagons; the chosen one is filled ink.
  Tags are 20px outlined hexagons with a Kode Mono capital label.

## Parts

- Fields are square: 40px, a 32 percent edge on the ground, the strong edge under the pointer, a 2px ink outline on
  focus. Labels above in 14px medium; help and errors below in 14px, quiet or orange.
- Popups (menus, selects, popovers, the nav's sheet) are square panels of the ground with a quiet hairline and a long
  soft cast; rows are 36px, the row under the pointer takes the hover wash. Dialogs are the same square panel over the
  ink at 32 percent.
- Lists and tables are ruled, not boxed: a quiet rule between rows, group heads in Chakra Petch 20px, column heads as
  Kode Mono labels, values in the ink, row names in graphite. Yes is a filled ink hexagon, no a slate dash.
- An accordion (the FAQ) is ruled rows of 18px questions with a hexagon holding a plus at the end; open, the hexagon
  turns 30 degrees and the plus becomes a minus.
- Avatars and bullets are hexagons. Checks are square; a radio is a hexagon that fills.
- Switches are the product's: a small track that turns orange when on.
- Icons are Phosphor at 16px (20px in nav rows), regular weight, in the ink or the quiet gray. Icons never move on
  hover; color or opacity only.

## Motion

- Rare things may be generous; things that happen tens of times a day are subtle; things that happen a hundred times
  a day (keyboard shortcuts, the command palette) do not animate.
- Feedback lands on pointer-down: a key fills and presses in to 0.97 the instant it is pressed.
- One treatment per family: every key hovers the same way, every row the same way, every popup opens the same way.
- Colors and fills change in 120 to 160ms; popups open in 240ms on the strong ease-out and leave in 200ms; frames that
  slide use the dock curve; a hexagon turns in 240ms. Never ease-in, never `transition: all`, nothing from scale(0).
- No entrance on scroll: sections are simply there.

## Never

- Rounded corners on frames, fields, panels or popups (the switch's track and dots are the exceptions).
- Pill buttons, square buttons, or a button that is not a hexagon.
- Drop shadows on cards; white cards on the gray ground.
- A second accent color, orange fills, gradients or glows on text.
- Bold type, a fourth typeface, sizes off the scale.
- An icon that nudges on hover, an animation on a keyboard action, a scroll-triggered entrance.
