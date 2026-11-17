# Assumptions for the brand owner to confirm

Each is in force today; each names where it lives, so a change is one edit.

1. Source. Values come from the Hoplite website as rendered at https://hoplite-website-fawn.vercel.app on 2026-11-17:
   its stylesheet variables (--cream, --charcoal, --graphite, --slate, --ash, --stone, --orange, --line, --hex-shape,
   --s-*, --t-*) and the computed styles of its pages. Its source is not in a repository we can read, so the
   stylesheets are kept in `brand/reference/site-css/`. `brand/tokens.css`, `brand/site.css`, `brand/elements.json`.
2. Hoplite has one look, the website's, applied to every project (`"surfaces": ["site"]`). The product UI shown in
   the site's demos (Geist, 8 and 12px corners, white panels) is not a second surface: the library follows the
   marketing system. Light is the default; the night theme follows `.dark` or `data-theme="dark"`. `brand/site.css`.
3. Nothing is rounded except dots and a switch's track: frames, fields, panels and popups are square; actions, tags
   and segmented controls are hexagons cut 12px (8px when 32px tall); avatars, bullets and radios are point-up
   hexagons. The site has no fields, menus or dialogs of its own; those extend its lines and frames.
4. Three typefaces, as on the site: Chakra Petch (light, regular) for display, Satoshi (light, regular, medium) for
   text, Kode Mono for labels and code. This is one more than the earlier "two families" rule for the site; the live
   site uses all three. Satoshi loads from Fontshare (its free license allows commercial use from their CDN; the
   files are not shipped). `brand/brand.json`.
5. The orange (#FF3616) is a mark and also the danger color (an error, a destructive action), because the site uses
   one interface red. Success is the product's green (#299236); warning is a derived amber (#A15C00).
6. Popups get a hairline ring and a long soft cast (`shadow-floating`) so they read over content; the site's own nav
   sheet has only a rule under it. Dialogs sit on the ink at 32 percent.
7. Press feedback is the pressed fill at once, with no scale: the engine rejects state changes that move geometry,
   and the site does not scale its keys.
8. The text link keeps the site's dashed rule that wipes in and marches under the pointer, but its arrow does not
   nudge (icons never move on hover).
9. Icons are Phosphor at regular weight (the site uses its own line glyphs); the site's Nucleo set is paid.
10. Primitives come from Base UI (`@base-ui/react` 1.7.0), plus `cmdk` and `sonner`; no shadcn code. Calendar,
    chart, carousel and resizable are written by hand.
11. The logo is the horse lockup and app icon from the website (`brand/logo/`), in the ink.
12. Review passes at 7 on every score. `brand/brand.json`.
13. The repository is public (the owner's choice), so installs from `#release` need no token. It holds copies of the
    website's public stylesheets as reference material.
