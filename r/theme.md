# Hoplite theme
The Hoplite tokens and the Tailwind names that read them.

Install: npx hoplite-ds add theme
Requires: none
Packages: none
Exports: See source
Client boundary: not required by this entry file

## Usage



## Source

styles/tokens.css

```css
/* Written by hoplite-ds from its brand files. Do not edit; run the CLI again to update. */
:root {
	/* Core: the ink (#1A1A1A) on the warm ground (#F2F2F0), the gray steps between them, and the orange mark. */
	--ds-color-brand: #FF3616;
	--ds-color-black: #000000;
	--ds-color-white: #FFFFFF;
	--ds-color-ink: #1A1A1A;
	--ds-color-ground: #F2F2F0;
	--ds-color-orange: #FF3616;
	--ds-color-graphite: #323232;
	--ds-color-ash: #626261;
	--ds-color-slate: #929291;
	--ds-color-stone: #C2C2C0;
	--ds-color-paper: #FAFAF9;

	/* Surfaces: everything sits on the ground; a frame is drawn with lines, not a fill. The paper is a nav item under
	   the pointer and a story card; the hover and press fills are the ink at 7 and 11 percent over the ground. */
	--ds-color-bg-default: #F2F2F0;
	--ds-color-bg-page: #F2F2F0;
	--ds-color-bg-subtle: #FAFAF9;
	--ds-color-bg-subtle-hover: #E3E3E1;
	--ds-color-bg-pressed: #DADAD8;
	--ds-color-bg-frame: #F2F2F0;
	--ds-color-bg-canvas: #F2F2F0;
	--ds-color-bg-tint: #E3E3E1;
	--ds-color-bg-brand: #FF3616;
	--ds-color-bg-inverse: #1A1A1A;
	--ds-color-bg-dark: #1A1A1A;
	/* Code sits on the ground inside a hairline frame, as the blog's code blocks do. */
	--ds-color-bg-code: #F2F2F0;
	--ds-color-bg-code-head: #F2F2F0;
	/* The page behind a dialog: the ink at 32 percent (the site has none; derived from its line steps). */
	--ds-color-bg-scrim: rgb(26 26 26 / 0.32);
	--ds-color-bg-sheet: #F2F2F0;
	/* A switch that is off and a disabled control's fill. */
	--ds-color-bg-off: #C2C2C0;

	/* Text: the ink for titles and values, a soft gray for leads and body copy, a quiet gray for labels, notes and
	   dates, the slate for placeholders and the stone for what is unavailable. Links are the ink, underlined. */
	--ds-color-text-default: #1A1A1A;
	--ds-color-text-secondary: #323232;
	--ds-color-text-muted: #626261;
	--ds-color-text-subtle: #929291;
	--ds-color-text-nav: #323232;
	--ds-color-text-faint: #C2C2C0;
	--ds-color-text-inverse: #F2F2F0;
	--ds-color-text-brand: #1A1A1A;
	--ds-color-text-on-brand: #FFFFFF;
	--ds-color-text-label: #626261;
	--ds-color-text-accent: #FF3616;
	--ds-color-icon-default: #1A1A1A;
	--ds-color-icon-secondary: #626261;
	/* Code: the site sets code in the ink with no syntax color; keywords take the orange, comments the slate. */
	--ds-color-code-text: #1A1A1A;
	--ds-color-code-key: #1A1A1A;
	--ds-color-code-string: #323232;
	--ds-color-code-number: #323232;
	--ds-color-code-keyword: #FF3616;
	--ds-color-code-function: #1A1A1A;
	--ds-color-code-type: #323232;
	--ds-color-code-tag: #1A1A1A;
	--ds-color-code-attr: #626261;
	--ds-color-code-punct: #626261;
	--ds-color-code-comment: #929291;
	--ds-color-code-line: #929291;
	--ds-color-code-line-active: #1A1A1A;
	--ds-color-code-brace: #626261;
	--ds-color-code-head-fg: #626261;

	/* Lines, all drawn from the ink: the strong edge of a button or a hexagon (70 percent), a field and a card under
	   the pointer (32 percent), the quiet rule between rows and around popups (16 percent), and the stone for the
	   frame of a plan or a band. */
	--ds-color-border-default: rgb(26 26 26 / 0.16);
	--ds-color-border-subtle: rgb(26 26 26 / 0.16);
	--ds-color-border-strong: rgb(26 26 26 / 0.7);
	--ds-color-border-field: rgb(26 26 26 / 0.32);
	--ds-color-border-frame: #C2C2C0;
	--ds-color-border-row: rgb(26 26 26 / 0.16);
	--ds-color-border-ring: rgb(26 26 26 / 0.16);
	--ds-color-border-brand: #FF3616;
	--ds-color-border-code: rgb(26 26 26 / 0.16);
	--ds-color-corner: #929291;
	--ds-color-shadow-drop: rgb(26 26 26 / 0.12);
	--ds-color-wash-hover: rgb(26 26 26 / 0.07);
	--ds-color-wash-pressed: rgb(26 26 26 / 0.11);
	--ds-color-ring-tint: rgb(26 26 26 / 0.16);

	/* Actions: the main action is the ink hexagon (the stone under the pointer); the second is the outlined hexagon. */
	--ds-color-action-primary: #1A1A1A;
	--ds-color-action-primary-hover: #323232;
	--ds-color-action-primary-fg: #F2F2F0;
	--ds-color-focus-ring: #1A1A1A;
	/* States. The product's green for done and passing, its orange for what failed or needs a decision. */
	--ds-color-status-success: #299236;
	--ds-color-status-success-bg: rgb(41 146 54 / 0.12);
	--ds-color-status-warning: #A15C00;
	--ds-color-status-warning-bg: rgb(161 92 0 / 0.12);
	--ds-color-status-warning-fg: #1A1A1A;
	--ds-color-status-danger: #FF3616;
	--ds-color-status-danger-strong: #D92A0E;
	--ds-color-status-danger-bg: rgb(255 54 22 / 0.1);
	--ds-color-status-info: #1A1A1A;
	--ds-color-status-info-bg: rgb(26 26 26 / 0.07);
	--ds-color-status-info-fg: #1A1A1A;
	/* Charts: the ink and its gray steps, with the orange for the series that matters. */
	--ds-color-chart-series-1: #1A1A1A;
	--ds-color-chart-series-2: #FF3616;
	--ds-color-chart-series-3: #626261;
	--ds-color-chart-series-4: #929291;
	--ds-color-chart-series-5: #C2C2C0;

	/* Type: Chakra Petch (light) for display and headings, Satoshi for everything people read and press, Kode Mono for
	   labels and code. Three weights: light for display, leads and body copy under a title; regular; medium for actions,
	   names and nav items. Labels are 12px Kode Mono in capitals, tracked 8 percent. */
	--ds-font-sans: var(--font-satoshi, "Satoshi"), ui-sans-serif, system-ui, sans-serif;
	--ds-font-display: var(--font-chakra-petch, "Chakra Petch"), ui-sans-serif, system-ui, sans-serif;
	--ds-font-mono: var(--font-kode-mono, "Kode Mono"), ui-monospace, "SF Mono", Menlo, monospace;
	--ds-font-code: var(--font-kode-mono, "Kode Mono"), ui-monospace, "SF Mono", Menlo, monospace;
	--ds-font-weight-light: 300;
	--ds-font-weight-regular: 400;
	--ds-font-weight-medium: 500;
	--ds-font-weight-semibold: 500;
	--ds-font-weight-bold: 500;
	--ds-font-weight-heading: 300;
	/* The site's scale: 64 / 56 / 44 / 32 / 24 / 20 for display and headings, 18 / 16 / 14 / 12 for text. */
	--ds-text-display: 4rem;
	--ds-text-h1: 3.5rem;
	--ds-text-h2: 2.75rem;
	--ds-text-h3: 2rem;
	--ds-text-h4: 1.5rem;
	--ds-text-h5: 1.25rem;
	--ds-text-body-lg: 1.125rem;
	--ds-text-body: 1rem;
	--ds-text-body-sm: 0.875rem;
	--ds-text-caption: 0.75rem;
	--ds-text-micro: 0.75rem;
	/* Fixed line boxes: 24px under 16px copy, 20px under 14px, 16px under a label. */
	--ds-line-body: 1.5rem;
	--ds-line-body-sm: 1.25rem;
	--ds-line-caption: 1rem;
	--ds-leading-tight: 1;
	--ds-leading-display: 1.0625;
	--ds-leading-heading: 1.0909;
	--ds-leading-title: 1.3333;
	--ds-leading-snug: 1.25;
	--ds-leading-body: 1.5;
	--ds-leading-relaxed: 1.5556;
	--ds-leading-prose: 1.7778;
	--ds-leading-code: 1.6;
	--ds-tracking-normal: 0;
	/* Display type is drawn 1 percent tighter; labels are tracked 8 percent, code 4. */
	--ds-tracking-tight: -0.01em;
	--ds-tracking-caps: 0.08em;
	--ds-tracking-code: 0.04em;

	/* Space: the site's 4px steps (s-1 to s-48). Every size is a multiple of 4 or 6; the px step stays a hairline. */
	--ds-space-0: 0;
	--ds-space-px: 1px;
	--ds-space-1: 0.25rem;
	--ds-space-1-5: 0.375rem;
	--ds-space-2: 0.5rem;
	--ds-space-3: 0.75rem;
	--ds-space-4: 1rem;
	--ds-space-5: 1.25rem;
	--ds-space-6: 1.5rem;
	--ds-space-7: 1.75rem;
	--ds-space-8: 2rem;
	--ds-space-9: 2.25rem;
	--ds-space-10: 2.5rem;
	--ds-space-12: 3rem;
	--ds-space-14: 3.5rem;
	--ds-space-16: 4rem;
	--ds-space-20: 5rem;
	--ds-space-24: 6rem;
	--ds-space-32: 8rem;
	--ds-space-40: 10rem;
	/* A section's rhythm (128px above and below, 80px under its head) and a frame's inner padding. */
	--ds-section-padding: 8rem;
	--ds-section-head: 5rem;
	--ds-component-padding: 2rem;

	/* Layout: a 1280px page inside 64px gutters, a 64px header, 720px heads and 600px leads. */
	--ds-layout-column: 80rem;
	--ds-layout-gutter: 4rem;
	--ds-layout-text: 37.5rem;
	--ds-layout-heading: 45rem;
	--ds-layout-header: 4rem;
	--ds-layout-rail: 18rem;
	--ds-frame-column: min(100% - 2 * var(--ds-layout-gutter), var(--ds-layout-column));

	/* Shape: square. Frames, fields, panels and popups have no radius; actions, tags and segments are hexagons cut at
	   12px (8px when compact) instead. The pill is kept for dots and a switch's track ends only. */
	--ds-radius-control: 0;
	--ds-radius-xs: 0;
	--ds-radius-sm: 0;
	--ds-radius-panel: 0;
	--ds-radius-dialog: 0;
	--ds-radius-pill: 9999px;
	--ds-hex-chamfer: 12px;
	--ds-hex-chamfer-s: 8px;
	/* Corner ticks: a frame's four 16px corners in the slate. */
	--ds-corner-length: 16px;
	/* No drop shadows on the site: a raised panel is a hairline. A popup gets the ring and a long soft cast so it reads
	   over content; a sheet gets the site's side cast. */
	--ds-shadow-s: 0 0 0 1px rgb(26 26 26 / 0.16);
	--ds-shadow-card: 0 0 0 1px rgb(26 26 26 / 0.16);
	--ds-shadow-line: 0 1px 0 rgb(26 26 26 / 0.16);
	--ds-shadow-floating: 0 0 0 1px rgb(26 26 26 / 0.16), 0 24px 48px -24px rgb(26 26 26 / 0.16);
	--ds-shadow-dialog: 0 0 0 1px rgb(26 26 26 / 0.16), 0 32px 80px -32px rgb(26 26 26 / 0.24);
	--ds-shadow-cast: -32px 0 80px -24px rgb(26 26 26 / 0.12), -8px 0 24px -8px rgb(26 26 26 / 0.06);
	--ds-shadow-knob: 0 0 0 1px rgb(26 26 26 / 0.16);
	--ds-shadow-focus: 0 0 0 2px #1A1A1A;
	--ds-blur-scrim: 2px;

	/* Motion: 120ms for a fill under the pointer, 160ms for colors and presses, 200ms for a popup leaving or a chevron
	   turning, 240ms for a popup arriving or a hexagon turning. The strong ease-out for every entrance, in-out for what
	   travels on screen, the dock curve for frames that slide, the drawer curve for sheets. Never ease-in. */
	--ds-duration-fast: 120ms;
	--ds-duration-base: 160ms;
	--ds-duration-moderate: 200ms;
	--ds-duration-slow: 240ms;
	--ds-easing-out: cubic-bezier(0.23, 1, 0.32, 1);
	--ds-easing-in-out: cubic-bezier(0.77, 0, 0.175, 1);
	--ds-easing-drawer: cubic-bezier(0.32, 0.72, 0, 1);
	--ds-easing-dock: cubic-bezier(0.2, 0, 0, 1);
}

```

styles/theme.css

```css
/* Written by hoplite-ds from its brand files. Do not edit; run the CLI again to update. */
@theme inline {
	--color-brand: var(--ds-color-brand);
	--color-black: var(--ds-color-black);
	--color-white: var(--ds-color-white);
	--color-primary: var(--ds-color-action-primary);
	--color-primary-hover: var(--ds-color-action-primary-hover);
	--color-on-primary: var(--ds-color-action-primary-fg);
	--color-focus-ring: var(--ds-color-focus-ring);
	--color-surface: var(--ds-color-bg-default);
	--color-surface-brand: var(--ds-color-bg-brand);
	--color-subtle: var(--ds-color-bg-subtle);
	--color-frame: var(--ds-color-bg-frame);
	--color-canvas: var(--ds-color-bg-canvas);
	--color-tint: var(--ds-color-bg-tint);
	--color-inverse: var(--ds-color-bg-inverse);
	--color-dark: var(--ds-color-bg-dark);
	--color-code: var(--ds-color-bg-code);
	--color-scrim: var(--ds-color-bg-scrim);
	--color-fg: var(--ds-color-text-default);
	--color-fg-secondary: var(--ds-color-text-secondary);
	--color-fg-muted: var(--ds-color-text-muted);
	--color-fg-subtle: var(--ds-color-text-subtle);
	--color-fg-faint: var(--ds-color-text-faint);
	--color-fg-nav: var(--ds-color-text-nav);
	--color-fg-inverse: var(--ds-color-text-inverse);
	--color-fg-brand: var(--ds-color-text-brand);
	--color-on-brand: var(--ds-color-text-on-brand);
	--color-line: var(--ds-color-border-default);
	--color-line-subtle: var(--ds-color-border-subtle);
	--color-line-strong: var(--ds-color-border-strong);
	--color-success: var(--ds-color-status-success);
	--color-warning: var(--ds-color-status-warning);
	--color-danger: var(--ds-color-status-danger);
	--color-ink: var(--ds-color-ink);
	--color-ground: var(--ds-color-ground);
	--color-orange: var(--ds-color-orange);
	--color-graphite: var(--ds-color-graphite);
	--color-ash: var(--ds-color-ash);
	--color-slate: var(--ds-color-slate);
	--color-stone: var(--ds-color-stone);
	--color-paper: var(--ds-color-paper);
	--color-page: var(--ds-color-bg-page);
	--color-subtle-hover: var(--ds-color-bg-subtle-hover);
	--color-pressed: var(--ds-color-bg-pressed);
	--color-code-head: var(--ds-color-bg-code-head);
	--color-sheet: var(--ds-color-bg-sheet);
	--color-off: var(--ds-color-bg-off);
	--color-fg-label: var(--ds-color-text-label);
	--color-fg-accent: var(--ds-color-text-accent);
	--color-icon-default: var(--ds-color-icon-default);
	--color-icon-secondary: var(--ds-color-icon-secondary);
	--color-code-text: var(--ds-color-code-text);
	--color-code-key: var(--ds-color-code-key);
	--color-code-string: var(--ds-color-code-string);
	--color-code-number: var(--ds-color-code-number);
	--color-code-keyword: var(--ds-color-code-keyword);
	--color-code-function: var(--ds-color-code-function);
	--color-code-type: var(--ds-color-code-type);
	--color-code-tag: var(--ds-color-code-tag);
	--color-code-attr: var(--ds-color-code-attr);
	--color-code-punct: var(--ds-color-code-punct);
	--color-code-comment: var(--ds-color-code-comment);
	--color-code-line: var(--ds-color-code-line);
	--color-code-line-active: var(--ds-color-code-line-active);
	--color-code-brace: var(--ds-color-code-brace);
	--color-code-head-fg: var(--ds-color-code-head-fg);
	--color-line-field: var(--ds-color-border-field);
	--color-line-frame: var(--ds-color-border-frame);
	--color-line-row: var(--ds-color-border-row);
	--color-line-ring: var(--ds-color-border-ring);
	--color-line-brand: var(--ds-color-border-brand);
	--color-line-code: var(--ds-color-border-code);
	--color-corner: var(--ds-color-corner);
	--color-shadow-drop: var(--ds-color-shadow-drop);
	--color-wash-hover: var(--ds-color-wash-hover);
	--color-wash-pressed: var(--ds-color-wash-pressed);
	--color-ring-tint: var(--ds-color-ring-tint);
	--color-success-bg: var(--ds-color-status-success-bg);
	--color-warning-bg: var(--ds-color-status-warning-bg);
	--color-warning-fg: var(--ds-color-status-warning-fg);
	--color-danger-strong: var(--ds-color-status-danger-strong);
	--color-danger-bg: var(--ds-color-status-danger-bg);
	--color-info: var(--ds-color-status-info);
	--color-info-bg: var(--ds-color-status-info-bg);
	--color-info-fg: var(--ds-color-status-info-fg);
	--color-series-1: var(--ds-color-chart-series-1);
	--color-series-2: var(--ds-color-chart-series-2);
	--color-series-3: var(--ds-color-chart-series-3);
	--color-series-4: var(--ds-color-chart-series-4);
	--color-series-5: var(--ds-color-chart-series-5);
	--font-sans: var(--ds-font-sans);
	--font-display: var(--ds-font-display);
	--font-mono: var(--ds-font-mono);
	--font-code: var(--ds-font-code);
	--font-weight-light: var(--ds-font-weight-light);
	--font-weight-normal: var(--ds-font-weight-regular);
	--font-weight-medium: var(--ds-font-weight-medium);
	--font-weight-semibold: var(--ds-font-weight-semibold);
	--font-weight-bold: var(--ds-font-weight-bold);
	--font-weight-heading: var(--ds-font-weight-heading);
	--spacing: var(--ds-space-1);
	--spacing-0: var(--ds-space-0);
	--spacing-px: var(--ds-space-px);
	--spacing-1: var(--ds-space-1);
	--spacing-1\.5: var(--ds-space-1-5);
	--spacing-2: var(--ds-space-2);
	--spacing-3: var(--ds-space-3);
	--spacing-4: var(--ds-space-4);
	--spacing-5: var(--ds-space-5);
	--spacing-6: var(--ds-space-6);
	--spacing-7: var(--ds-space-7);
	--spacing-8: var(--ds-space-8);
	--spacing-9: var(--ds-space-9);
	--spacing-10: var(--ds-space-10);
	--spacing-12: var(--ds-space-12);
	--spacing-14: var(--ds-space-14);
	--spacing-16: var(--ds-space-16);
	--spacing-20: var(--ds-space-20);
	--spacing-24: var(--ds-space-24);
	--spacing-32: var(--ds-space-32);
	--spacing-40: var(--ds-space-40);
	--spacing-layout-column: var(--ds-layout-column);
	--spacing-layout-gutter: var(--ds-layout-gutter);
	--spacing-layout-text: var(--ds-layout-text);
	--spacing-layout-heading: var(--ds-layout-heading);
	--spacing-layout-header: var(--ds-layout-header);
	--spacing-layout-rail: var(--ds-layout-rail);
	--container-frame-column: var(--ds-frame-column);
	--blur-scrim: var(--ds-blur-scrim);
	--transition-duration-fast: var(--ds-duration-fast);
	--transition-duration-120: var(--ds-duration-fast);
	--transition-duration-base: var(--ds-duration-base);
	--transition-duration-160: var(--ds-duration-base);
	--transition-duration-moderate: var(--ds-duration-moderate);
	--transition-duration-200: var(--ds-duration-moderate);
	--transition-duration-slow: var(--ds-duration-slow);
	--transition-duration-240: var(--ds-duration-slow);
	--transition-duration-150: var(--ds-duration-fast);
	--transition-duration-250: var(--ds-duration-moderate);
	--transition-duration-300: var(--ds-duration-slow);
	--leading-line-body: var(--ds-line-body);
	--leading-line-body-sm: var(--ds-line-body-sm);
	--leading-line-caption: var(--ds-line-caption);
	--spacing-section: var(--ds-section-padding);
	--spacing-component: var(--ds-component-padding);
	--default-transition-duration: var(--ds-duration-fast);
	--default-transition-timing-function: var(--ds-easing-out);
	--text-display: var(--ds-text-display);
	--text-h1: var(--ds-text-h1);
	--text-h2: var(--ds-text-h2);
	--text-h3: var(--ds-text-h3);
	--text-h4: var(--ds-text-h4);
	--text-h5: var(--ds-text-h5);
	--text-body-lg: var(--ds-text-body-lg);
	--text-body: var(--ds-text-body);
	--text-body-sm: var(--ds-text-body-sm);
	--text-caption: var(--ds-text-caption);
	--text-micro: var(--ds-text-micro);
	--leading-tight: var(--ds-leading-tight);
	--leading-display: var(--ds-leading-display);
	--leading-heading: var(--ds-leading-heading);
	--leading-title: var(--ds-leading-title);
	--leading-snug: var(--ds-leading-snug);
	--leading-body: var(--ds-leading-body);
	--leading-relaxed: var(--ds-leading-relaxed);
	--leading-prose: var(--ds-leading-prose);
	--leading-code: var(--ds-leading-code);
	--tracking-normal: var(--ds-tracking-normal);
	--tracking-tight: var(--ds-tracking-tight);
	--tracking-caps: var(--ds-tracking-caps);
	--tracking-code: var(--ds-tracking-code);
	--radius-control: var(--ds-radius-control);
	--radius-xs: var(--ds-radius-xs);
	--radius-sm: var(--ds-radius-sm);
	--radius-panel: var(--ds-radius-panel);
	--radius-dialog: var(--ds-radius-dialog);
	--radius-pill: var(--ds-radius-pill);
	--shadow-s: var(--ds-shadow-s);
	--shadow-card: var(--ds-shadow-card);
	--shadow-line: var(--ds-shadow-line);
	--shadow-floating: var(--ds-shadow-floating);
	--shadow-dialog: var(--ds-shadow-dialog);
	--shadow-cast: var(--ds-shadow-cast);
	--shadow-knob: var(--ds-shadow-knob);
	--shadow-focus: var(--ds-shadow-focus);
	--ease-out: var(--ds-easing-out);
	--ease-in-out: var(--ds-easing-in-out);
	--ease-drawer: var(--ds-easing-drawer);
	--section-head: var(--ds-section-head);
	--hex-chamfer: var(--ds-hex-chamfer);
	--hex-chamfer-s: var(--ds-hex-chamfer-s);
	--corner-length: var(--ds-corner-length);
	--easing-dock: var(--ds-easing-dock);
}

@theme {
	--animate-pop-in: ds-pop-in var(--ds-duration-slow) var(--ds-easing-out);
	--animate-pop-out: ds-pop-out var(--ds-duration-fast) var(--ds-easing-out) forwards;
	--animate-fade-in: ds-fade-in var(--ds-duration-fast) var(--ds-easing-out);
	--animate-fade-out: ds-fade-out var(--ds-duration-fast) var(--ds-easing-out) forwards;
	--animate-dialog-in: ds-dialog-in var(--ds-duration-moderate) var(--ds-easing-out);
	--animate-dialog-out: ds-dialog-out var(--ds-duration-fast) var(--ds-easing-out) forwards;
	--animate-sheet-in-right: ds-sheet-in-right var(--ds-duration-slow) var(--ds-easing-drawer);
	--animate-sheet-out-right: ds-sheet-out-right var(--ds-duration-base) var(--ds-easing-drawer) forwards;
	--animate-sheet-in-left: ds-sheet-in-left var(--ds-duration-slow) var(--ds-easing-drawer);
	--animate-sheet-out-left: ds-sheet-out-left var(--ds-duration-base) var(--ds-easing-drawer) forwards;
	--animate-sheet-in-top: ds-sheet-in-top var(--ds-duration-slow) var(--ds-easing-drawer);
	--animate-sheet-out-top: ds-sheet-out-top var(--ds-duration-base) var(--ds-easing-drawer) forwards;
	--animate-sheet-in-bottom: ds-sheet-in-bottom var(--ds-duration-slow) var(--ds-easing-drawer);
	--animate-sheet-out-bottom: ds-sheet-out-bottom var(--ds-duration-base) var(--ds-easing-drawer) forwards;
	--animate-content-in: ds-content-in var(--ds-duration-base) var(--ds-easing-out);
	--animate-accordion-down: ds-accordion-down var(--ds-duration-base) var(--ds-easing-out);
	--animate-accordion-up: ds-accordion-up var(--ds-duration-fast) var(--ds-easing-out);
	--animate-collapsible-down: ds-collapsible-down var(--ds-duration-base) var(--ds-easing-out);
	--animate-collapsible-up: ds-collapsible-up var(--ds-duration-fast) var(--ds-easing-out);
	--animate-pulse-soft: ds-pulse-soft 1.6s var(--ds-easing-in-out) infinite;
	--animate-spin-steady: spin 0.8s linear infinite;
	--animate-caret-blink: ds-caret-blink 1.1s steps(1) infinite;
	--animate-chart-line: ds-chart-line 700ms var(--ds-easing-out) backwards;
	--animate-chart-bar: ds-chart-bar 400ms var(--ds-easing-out) backwards;

	@keyframes ds-pop-in {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
	}

	@keyframes ds-pop-out {
		to {
			opacity: 0;
			transform: scale(0.98);
		}
	}

	@keyframes ds-fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes ds-dialog-in {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	@keyframes ds-dialog-out {
		to {
			opacity: 0;
			transform: scale(0.97);
		}
	}

	@keyframes ds-sheet-in-right {
		from {
			transform: translateX(100%);
		}
	}

	@keyframes ds-sheet-out-right {
		to {
			transform: translateX(100%);
		}
	}

	@keyframes ds-sheet-in-left {
		from {
			transform: translateX(-100%);
		}
	}

	@keyframes ds-sheet-out-left {
		to {
			transform: translateX(-100%);
		}
	}

	@keyframes ds-sheet-in-top {
		from {
			transform: translateY(-100%);
		}
	}

	@keyframes ds-sheet-out-top {
		to {
			transform: translateY(-100%);
		}
	}

	@keyframes ds-sheet-in-bottom {
		from {
			transform: translateY(100%);
		}
	}

	@keyframes ds-sheet-out-bottom {
		to {
			transform: translateY(100%);
		}
	}

	@keyframes ds-content-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@keyframes ds-accordion-down {
		from {
			height: 0;
			opacity: 0;
		}
		to {
			height: var(--radix-accordion-content-height);
		}
	}

	@keyframes ds-accordion-up {
		from {
			height: var(--radix-accordion-content-height);
		}
		to {
			height: 0;
			opacity: 0;
		}
	}

	@keyframes ds-collapsible-down {
		from {
			height: 0;
			opacity: 0;
		}
		to {
			height: var(--radix-collapsible-content-height);
		}
	}

	@keyframes ds-collapsible-up {
		from {
			height: var(--radix-collapsible-content-height);
		}
		to {
			height: 0;
			opacity: 0;
		}
	}

	@keyframes ds-pulse-soft {
		50% {
			opacity: 0.55;
		}
	}

	@keyframes ds-caret-blink {
		50% {
			opacity: 0;
		}
	}

	@keyframes ds-chart-line {
		from {
			stroke-dashoffset: 1;
		}
	}

	@keyframes ds-chart-bar {
		from {
			transform: scaleY(0.04);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	@keyframes ds-pop-in {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-pop-out {
		to {
			opacity: 0;
		}
	}

	@keyframes ds-dialog-in {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-dialog-out {
		to {
			opacity: 0;
		}
	}

	@keyframes ds-content-in {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-in-right {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-out-right {
		to {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-in-left {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-out-left {
		to {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-in-top {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-out-top {
		to {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-in-bottom {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-sheet-out-bottom {
		to {
			opacity: 0;
		}
	}

	@keyframes ds-chart-line {
		from {
			opacity: 0;
		}
	}

	@keyframes ds-chart-bar {
		from {
			opacity: 0;
		}
	}
}

/* Shared interaction rules for installed CSS and the component theme. */
@layer base {
 :where(button, [role="button"], a[href], input, select, textarea, summary) {
  touch-action: manipulation;
 }
}

/* Press feedback is immediate; the action still activates through the native click/keyboard path. */
:where(button, [role="button"], a[href], summary):active {
 transition-duration: 0s !important;
 transition-delay: 0s !important;
}

/* Keyboard feedback and explicitly high-frequency surfaces never wait for motion. The scroll fades below are tied to
   the scroll, not to time, so these rules leave them alone. */
:where(button, [role="button"], a[href], input, select, textarea, summary):focus-visible,
:where(button, [role="button"], a[href], input, select, textarea, summary):focus-visible *,
:where([data-ds-motion="instant"], [data-instant="true"], [data-slot^="command"]):where(:not(.fade-y, .fade-x, .fade-xy)),
:where([data-ds-motion="instant"], [data-instant="true"], [data-slot^="command"]) :where(:not(.fade-y, .fade-x, .fade-xy)),
:where([data-ds-motion="instant"], [data-instant="true"], [data-slot^="command"]) *::before,
:where([data-ds-motion="instant"], [data-instant="true"], [data-slot^="command"]) *::after,
:where([data-ds-motion="instant"], [data-instant="true"], [data-slot^="command"])::before,
:where([data-ds-motion="instant"], [data-instant="true"], [data-slot^="command"])::after {
 animation: none !important;
 transition: none !important;
 scroll-behavior: auto !important;
}

@media (prefers-reduced-motion: reduce) {
 :where(:not(.fade-y, .fade-x, .fade-xy)), ::before, ::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
 }

 .fade-y, .fade-x, .fade-xy {
  transition: none !important;
  scroll-behavior: auto !important;
 }
}

/* Scroll edges fade, never cut content off: put fade-y (a list that scrolls down), fade-x (a row that scrolls
   sideways) or fade-xy (both, the two fades intersected) on the element that scrolls. An edge with more content past it fades over 24px; the fade grows with the
   first and last 24px of scroll (tied to the scroll, not to time), so a list at rest shows its first row in full and a
   list that does not scroll has no fade. Browsers without scroll timelines get a short fixed fade. The mask hides the
   element's own background and shadow at the faded edges, so it belongs on a scroller inside a panel, not on the
   panel. */
@property --fade-start {
 syntax: "<length>";
 inherits: false;
 initial-value: 0px;
}

@property --fade-end {
 syntax: "<length>";
 inherits: false;
 initial-value: 0px;
}

@keyframes fade-start {
 from {
  --fade-start: 0px;
 }
 to {
  --fade-start: 24px;
 }
}

@keyframes fade-end {
 from {
  --fade-end: 24px;
 }
 to {
  --fade-end: 0px;
 }
}

@property --fade-x-start {
 syntax: "<length>";
 inherits: false;
 initial-value: 0px;
}

@property --fade-x-end {
 syntax: "<length>";
 inherits: false;
 initial-value: 0px;
}

@keyframes fade-x-start {
 from {
  --fade-x-start: 0px;
 }
 to {
  --fade-x-start: 24px;
 }
}

@keyframes fade-x-end {
 from {
  --fade-x-end: 24px;
 }
 to {
  --fade-x-end: 0px;
 }
}

.fade-y {
 mask-image: linear-gradient(to bottom, transparent, var(--ds-color-black) var(--fade-start), var(--ds-color-black) calc(100% - var(--fade-end)), transparent);
}

.fade-x {
 mask-image: linear-gradient(to right, transparent, var(--ds-color-black) var(--fade-start), var(--ds-color-black) calc(100% - var(--fade-end)), transparent);
}

.fade-xy {
 mask-image:
  linear-gradient(to bottom, transparent, var(--ds-color-black) var(--fade-start), var(--ds-color-black) calc(100% - var(--fade-end)), transparent),
  linear-gradient(to right, transparent, var(--ds-color-black) var(--fade-x-start), var(--ds-color-black) calc(100% - var(--fade-x-end)), transparent);
 mask-composite: intersect;
}

@supports (animation-timeline: scroll()) {
 .fade-y, .fade-x {
  animation: fade-start linear both, fade-end linear both;
  animation-range: 0px 24px, calc(100% - 24px) 100%;
 }

 .fade-y {
  animation-timeline: scroll(self block), scroll(self block);
 }

 .fade-x {
  animation-timeline: scroll(self inline), scroll(self inline);
 }

 .fade-xy {
  animation: fade-start linear both, fade-end linear both, fade-x-start linear both, fade-x-end linear both;
  animation-timeline: scroll(self block), scroll(self block), scroll(self inline), scroll(self inline);
  animation-range: 0px 24px, calc(100% - 24px) 100%, 0px 24px, calc(100% - 24px) 100%;
 }
}

@supports not (animation-timeline: scroll()) {
 .fade-y, .fade-x, .fade-xy {
  --fade-start: 8px;
  --fade-end: 8px;
 }

 .fade-xy {
  --fade-x-start: 8px;
  --fade-x-end: 8px;
 }
}

```
