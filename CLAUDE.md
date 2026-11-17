# hoplite-ds (working on the harness itself)

This repo is the CLI that applies the Hoplite design system to any project and keeps agents on it. `README.md` says how
it is used. Apps that install it get a different contract, written from `brand/contract.md`. Hoplite has one look, the
website's (`"surfaces": ["site"]` in `brand/brand.json` is the engine's single-look mode), with a dark theme in
`brand/site.css`.

## Loop

```sh
npm install          # also builds (prepare)
npm run build        # tsc, then scripts/build-brand.mjs (brand/ -> build/)
npm run ci           # build, limits, registry, tests; must pass before you push
```

## Where things are

- `registry/`: the component library, one item per shadcn/ui component (every one of them, rebuilt in the Hoplite
  style, no shadcn code): `components/ui`, `lib/` (cn, slot, surface), `hooks/`, `docs/<item>.md` (frontmatter: type,
  surface, kinds, files...) and `examples/<item>.tsx` (exports `Preview` first, then named states).
  `scripts/build-registry.ts` (`npm run registry`) validates every item, derives files and dependencies from imports,
  adds the theme item from the brand tokens, writes one JSON file per item and an index into `apps/www/public/r`,
  type-checks the library and runs the value check over it. Primitives: `@base-ui/react` only (Hoplite's rule: never
  Radix, Chakra or Headless UI), plus `cmdk` and `sonner`; icons are Phosphor (`@phosphor-icons/react/ssr`, the
  `...Icon` names, regular weight). `asChild` maps onto Base UI's `render` through `slot()` in `lib/utils`.
- Shapes live in `brand/site.css` as utilities: `ds-hex-frame` / `ds-hex-frame-s` (a hexagon drawn on ::before/::after,
  colored with `before:` / `after:` classes, so the element keeps its focus outline), `ds-hex` / `ds-hex-s`,
  `ds-hex-mark`, `ds-corners`, `ds-rule-x` / `ds-rule-y`, `ds-label`, `ds-link`, `ds-grain`.
- `apps/www/`: the docs site (Next.js), laid out like the other brand sites (one rail, page heads), in Hoplite's style;
  deployed to the Vercel project `hoplite-ds` (Agencidev team, root apps/www, install `cd ../.. && npm install`, toolbar
  off: its script breaks the sandboxed preview frames) with `vercel deploy --prod --scope agencidev-dev` from the repo
  root; it renders every item from source. Browser checks: `DOCS_URL=<url> npm run test:docs`, `test:library`. In
  `next dev`, use localhost: Next blocks 127.0.0.1.
- `src/library/`: loading registry items (`registry.ts`) and swap mode (`swap.ts`); `src/commands/add.ts` (add, list).
- `brand/`: the only brand-specific content. `tokens.css` is the single source of values (`:root`, light). `site.css` is
  the base layer, the dark theme and the shape utilities. `elements.json` holds how each kind of element is styled, with
  `match` data for detection and a `source`. `reference/` holds the website's pages (used by `review`) and its
  stylesheets (`reference/site-css/`, for re-measuring). `brand.json` holds names, fonts (Chakra Petch and Kode Mono
  from Google, Satoshi from Fontshare via `fonts.always`) and the library's variant names. `logo/` holds the lockup,
  the horse mark and the app icon.
- Reference for the look: the Hoplite website as rendered, https://hoplite-website-fawn.vercel.app (a Next.js build
  whose source is not in any repo we can read; `~/Desktop/TRIAGE/Work/Agencidev/hoplite-website` is an older Vite
  extract, read-only, outside the anwarlemu account). Values come from its stylesheet variables and computed styles.
  When the site changes, re-download its CSS into `brand/reference/site-css/`, re-measure, update `brand/`, and
  recapture `brand/reference/*.jpg`.
- `src/project/`: stack detection, main stylesheet and layouts, screens and the files each is drawn from.
- `src/convert/`: converts style values by role in every file type (CSS, templates, scripts, Tailwind, native).
- `src/install/`: the brand stylesheet and fonts, contract, hooks (Claude Code, Codex, Cursor), pre-commit.
- `src/plan/`: the task queue (`state.json` in the app), element detection and `look` output.
- `src/check/`: the value check (rules.ts), used by hooks, pre-commit and `check`.
- `src/review/`, `src/hooks/`, `src/commands/`.

## Rules

- No brand strings in `src/` (read `brand/brand.json`); `scripts/ci-limits.mjs` enforces it.
- No em dashes; American spelling; sentence case.
- Element styles use only brand tokens and follow the animation rules (no ease-in, no `transition: all`, 120 to 240ms,
  no geometry change on hover or press); the tests check every value.
- Restyle only: nothing the CLI writes may change a project's copy, elements or structure. Hoplite has no markup
  touches.
- Library items use only brand token classes (the value check runs over `registry/` in CI), follow the animation
  rules, take data through props (no Next imports, auth or analytics), and have a docs entry and an example.
- Apps install the `release` branch: a compiled tree (no source, intake or dev dependencies) so installs take
  seconds. `npm run release` runs the checks, builds it and pushes it; nothing reaches apps until then.
- Test changes on real projects (copies in a scratch folder, never the originals): a site, a plain HTML site, a dark
  site, a Tailwind app and a native sample.

## Do not

- Kill processes by pattern (`pkill -f "next dev"`): the owner's other dev servers run on :3000.
- Modify any other brand's repo or the hoplite-website checkout.
- Commit `build`, `dist` or `node_modules`.
