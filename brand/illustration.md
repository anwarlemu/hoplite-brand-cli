# Illustration

Hoplite's illustrations are line drawings made by surveyors: thin dotted, dashed and solid lines on the ground, and
a few orange cog nodes marking points. `npx hoplite-ds illustrate` draws them in code (src/illustrate/build.ts, with the
drawing functions in src/assets/scene.ts). Every rule below names where it comes from.

## Rules

1. Three kinds of line and no others: dots (a round-capped 1.7 unit stroke every 5.2 units), dashes (7 on, 5.5 off),
   long dashes (13 on, 8 off), and solid hairlines at 0.9 units. Source: agd-playground hoplite-og scene.ts `stroke`.
2. Lines are the ink at an opacity, never a second color: 60 percent on the light ground, 72 on night, 66 on black.
   Source: the social tool's themes (brand.ts `grid`), mapped onto tokens in brand/assets/image.json.
3. The cog node is the only filled shape: a hexagon in the orange with a hexagon cut from its middle (0.42 of its
   size), lying flat on the surface it marks, never more than a handful (2 to 6) and kept apart by five node widths.
   Source: scene.ts `nodeIn` and the website's cog (cl-cog keyframes); the orange stays a mark (brand/principles.md).
4. Subjects are the brand's own: a globe (meridians, a parallel or two and a great circle tipped across, its outline
   dotted then dashed just inside), its dome rising from the foot with a solid ring and a larger node on the pole, a
   cube cut into two or three cells a side with a dotted ghost and dotted hidden edges, the loader bar, and a single
   node. Source: scene.ts `drawGlobe`, `drawCube`, `drawLoader`, layoutFor `horizon`.
5. A seed picks the circles, the cells and where the nodes sit; the same seed always redraws the same drawing.
   Source: scene.ts `mulberry`.
6. Only the circles' near halves are drawn; nodes sit only on lines that face the viewer. Source: scene.ts depth tests.
7. A picture is never redrawn in the style: it goes in a square window, darkened with bg-dark when asked (the tool's
   window shade for the brand's aerials), framed with the website's 16px corner ticks (.ds-corners) inside the dashed
   rules. Source: draw.ts `drawWindow`, brand/site.css `.ds-corners`, scene.ts `drawRules`.
8. Nothing is rounded, glowing, shaded or gradient; no drop shadows. Source: brand/principles.md, ASSUMPTIONS.md 3.
9. Grounds are the image themes (light, night, black) or none (transparent): on no ground the node's hole stays open.
10. In motion, dashes march along their lines at a constant speed and nodes turn a sixth of a turn and rest; nothing
    else moves. Source: the website's hero-globe-march (8s linear) and hs-odin (60deg on cubic-bezier(.45,0,.2,1)).

## Output

SVG keeps every line and node a vector shape: the line drawings are written as native SVG paths (a dashed line is one
path with stroke-dasharray), so they open editable in Figma or Illustrator. The loader (its label is text) and the
window (a picture) go through Skia's SVG backend with text as outlines. PNG is drawn at 2x by default.
